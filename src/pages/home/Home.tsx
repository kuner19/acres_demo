/* eslint-disable react-native/no-inline-styles */

import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, NativeModules, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import LottieView from 'lottie-react-native';

import { RootStackParamList } from '../../navigation/type';
import CustomAlert from '../../modals/alert';
import { requestPermissions } from '../../permission';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const bleManagerRef = useRef(new BleManager());
  const bleManager = bleManagerRef.current;

  const [startConnection, setStartConnection] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('We couldn’t find any Bluetooth devices nearby. Make sure the device is powered on and within range, then try again.');

  const { AcresBLE } = NativeModules;

  const scanConnect = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;

    setStartConnection(true);
    const devicelist: Device[] = [];
    let strongestDevice: Device | null = null;

    try {
      // Try using Acres BLE SDK first
      const deviceUUID = await AcresBLE.findDevice();
      navigation.navigate('Funding', {
        deviceUUID,
        from: 'Acres BLE',
        rssi: '',
        connectedDevice:'',
      });
    } catch (sdkError) {
      console.warn('AcresBLE SDK failed, falling back to BLE scan:', sdkError);
      // Delay slightly before scanning
      setTimeout(() => {
        bleManager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.error('BLE Scan error:', error);
            bleManager.stopDeviceScan();
            setMessage('Bluetooth scan failed: ' + error.message);
            setModalVisible(true);
            setStartConnection(false);
            return;
          }

          if (device && typeof device.rssi === 'number' && device.rssi >= -50 && device.id) {
            const existingIndex = devicelist.findIndex(d => d.id === device.id);

            if (existingIndex === -1) {
              devicelist.push(device);
            } else {
              // Replace if new signal is stronger
              if ((device.rssi ?? -999) > (devicelist[existingIndex].rssi ?? -999)) {
                devicelist[existingIndex] = device;
              }
            }

            if (
              !strongestDevice ||
              (device.rssi ?? -999) > (strongestDevice.rssi ?? -999)
            ) {
              strongestDevice = device;
            }
          }
        });
      }, 300);

      // Stop scanning and connect after 6 seconds
      setTimeout(async () => {
        bleManager.stopDeviceScan();

        if (!strongestDevice) {
          setModalVisible(true);
          setStartConnection(false);
          return;
        }

        try {
          const connectedDevice = await bleManager.connectToDevice(strongestDevice.id);
          await connectedDevice.discoverAllServicesAndCharacteristics();

          navigation.navigate('Funding', {
            deviceUUID: connectedDevice.id,
            from: 'BLE Manager',
            rssi: connectedDevice.rssi?.toString() ?? '',
            connectedDevice,
          });
        } catch (connectError) {
          console.error('Failed to connect:', connectError);

          setMessage(
            `Found ${devicelist.length} device(s):\n` +
              devicelist
                .map(d => `• ${d.name || 'Unknown'} (${d.id}) - RSSI: ${d.rssi}`)
                .join('\n') +
              `\n\nFailed to connect to: ${strongestDevice.name || 'Unknown'} (${strongestDevice.id})`
          );
          setModalVisible(true);
        } finally {
          setStartConnection(false);
        }
      }, 10000); // ← Correct scanning duration
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ fontSize: 20 }}>Acres Demo App</Text>
      </View>

      <LottieView
        source={require('../../assets/lottie/bluetooth.json')}
        style={{ width: '80%', height: '80%' }}
        autoPlay={startConnection}
        loop
      />

      <View>
        <TouchableOpacity
          onPress={
            (scanConnect)
          }
          style={styles.button}
        >
          <Text style={{ color: 'white' }}>
            {startConnection ? 'Searching for device...' : 'Connect to Bluetooth'}
          </Text>
          {startConnection && <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />}
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setStartConnection(false);
        }}
        title="No device detected"
        message={message}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    backgroundColor: 'rgba(19, 77, 159, 1)',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Home;
