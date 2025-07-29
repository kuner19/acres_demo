// services/bleService.js
import { BleManager, Device } from 'react-native-ble-plx';

class BLEService {
  manager = new BleManager();
  device = null;
  rssiInterval = null;
  walkawayCallback = null;
  rssiThreshold = -65;
  belowThresholdCount = 0;
  maxStrikes = 2;
  walkawayHandled = false;

  startScanAndConnect = async (onConnected, onError, onWalkaway) => {
    const devicelist = [];
    let strongestDevice = null;
    this.walkawayCallback = onWalkaway;
    this.walkawayHandled = false;

    return new Promise((resolve, reject) => {
      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          this.manager.stopDeviceScan();
          onError?.(error.message);
          return reject(error);
        }

        if (device && device.rssi !== null && device.rssi >= -50) {
          const existingIndex = devicelist.findIndex(d => d.id === device.id);
          if (existingIndex === -1) {
            devicelist.push(device);
          } else if ((device.rssi ?? -999) > (devicelist[existingIndex].rssi ?? -999)) {
            devicelist[existingIndex] = device;
          }

          if (!strongestDevice || device.rssi > strongestDevice.rssi) {
            strongestDevice = device;
          }
        }
      });

      setTimeout(async () => {
        this.manager.stopDeviceScan();

        if (!strongestDevice) {
          const msg = 'No strong device found';
          onError?.(msg);
          return reject(new Error(msg));
        }

        try {
          this.device = await this.manager.connectToDevice(strongestDevice.id);
          await this.device.discoverAllServicesAndCharacteristics();

          // Listen for disconnect
          this.device.onDisconnected(async () => {
            await this.disconnect();
            this.walkawayCallback?.('disconnected');
          });

          this.startRSSIMonitoring();
          onConnected?.(this.device);
          resolve(this.device);
        } catch (err) {
          onError?.(err.message);
          reject(err);
        }
      }, 5000);
    });
  };

  startRSSIMonitoring = () => {
    if (!this.device) return;

    this.belowThresholdCount = 0;
    this.rssiInterval = setInterval(async () => {
      try {
        const updated = await this.device.readRSSI();
        const rssi = updated.rssi ?? -100;
        console.log('RSSI:', rssi);
        if (rssi < this.rssiThreshold) {
          this.belowThresholdCount++;
          if (this.belowThresholdCount >= this.maxStrikes) {
            await this.disconnect();
            this.walkawayCallback?.('weak-signal');
          }
        } else {
          this.belowThresholdCount = 0;
        }
      } catch (err) {
        console.log('RSSI read error:', err.message);
      }
    }, 5000);
  };

  stopRSSIMonitoring = () => {
    if (this.rssiInterval) {
      clearInterval(this.rssiInterval);
      this.rssiInterval = null;
    }
  };

  disconnect = async () => {
    if(this.walkawayHandled) {return;}
    this.walkawayHandled = true;
    this.stopRSSIMonitoring();
    if (this.device) {
      try {
        await this.device.cancelConnection();
      } catch {}
    }
    this.device = null;
  };
}

export default new BLEService();
