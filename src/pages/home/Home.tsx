/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/type';
import CustomAlert from '../../modals/alert';
import { requestPermissions } from '../../permission';
import bleService from '../../services/bleService';
import { Device } from 'react-native-ble-plx';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [startConnection, setStartConnection] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  const handleConnect = async () => {
    const granted = await requestPermissions();
    if (!granted) {return;}

    setStartConnection(true);
    try {
      await bleService.startScanAndConnect(
        (device:Device) => {
          navigation.navigate('Funding', {
            deviceUUID: device.id,
            from: 'BLE Manager',
            rssi: device.rssi?.toString() ?? '',
            connectedDevice: device,
          });
        },
        (errMsg:string) => {
          setMessage(errMsg);
          setModalVisible(true);
        },
        (reason:string) => {
          if (reason === 'disconnected') {
            Alert.alert('Device disconnected');
            navigation.navigate('Home');
          } else if (reason === 'weak-signal') {
            navigation.navigate('Home');
            Alert.alert('Walkaway Detected', 'Signal strength too weak');
          }
        }
      );
    } catch (e) {
      setMessage((e as Error).message);
      setModalVisible(true);
    } finally {
      setStartConnection(false);
    }
  };

  // useEffect(() => {
  //   return () => {
  //     bleService.disconnect();
  //   };
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 20 }}>Acres Demo App</Text>
      <LottieView
        source={require('../../assets/lottie/bluetooth.json')}
        style={{ width: '80%', height: '80%' }}
        autoPlay={startConnection}
        loop
      />
      <TouchableOpacity onPress={handleConnect} style={styles.button}>
        <Text style={{ color: 'white' }}>
          {startConnection ? 'Connecting...' : 'Connect to Bluetooth'}
        </Text>
        {startConnection && <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />}
      </TouchableOpacity>
      <CustomAlert
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Connection Failed"
        message={message}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: {
    backgroundColor: '#134d9fff',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Home;
