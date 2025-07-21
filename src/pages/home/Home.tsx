/* eslint-disable react-native/no-inline-styles */

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, NativeModules, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/type';
import { BleManager } from 'react-native-ble-plx';
import CustomAlert from '../../modals/alert';

interface HomeProps {
}
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const Home: React.FC<HomeProps> = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [startConnection,setStartConnection] = useState(false);
  const [modalVisible,setModalVisible] = useState(false);
  const { AcresBLE } = NativeModules;
  const bleManager = new BleManager();
  let deviceUUID : string;
  const scanConnect = async () => {
    try {
      deviceUUID = await AcresBLE.findDevice();
      navigation.navigate('Funding',{
        deviceUUID,
      });
    }
    catch(sdkError){
            navigation.navigate('Funding',{
        deviceUUID,
      });
      console.error('Error using Acres SDK to find device:', sdkError);
      bleManager.startDeviceScan(null,null,(error,device)=>{
          if (error){
            setModalVisible(true);
            return;
          }if (device?.id || device?.name){
            bleManager.stopDeviceScan();
            deviceUUID = device.id;
            navigation.navigate('Funding',{
              deviceUUID,
            });
          }
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{fontSize:20}}>Acres Demo App</Text>
      </View>
     <LottieView
      source={require('../../assets/lottie/bluetooth.json')}
      style={{width: '80%', height: '80%'}}
      autoPlay = {startConnection}
      loop
    />
        <View>
            <TouchableOpacity onPress={()=>{
              setStartConnection(true);
              scanConnect();
            }} style={styles.button}>
              <Text style={{color:'white'}}>
                {startConnection ? 'Searching a device to pair' : 'Connect to Bluetooth'}
              </Text> 
               {startConnection ? <ActivityIndicator size="small" color="#fff" style={{marginLeft:10}}/> : ''}
            </TouchableOpacity>
        </View>
                  <CustomAlert
                  visible={modalVisible}
                  onClose={() =>
                  {
                    setModalVisible(false);
                    setStartConnection(false);
                  }
                  }
                  title="No device detected"
                  message="We couldn’t find any Bluetooth devices nearby. Make sure the device is powered on and within range, then try again."
                />
        </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent:'center',
    alignItems:'center',
  },
  button : {
    backgroundColor: 'rgba(19, 77, 159, 1)',
    paddingHorizontal: 40,
    paddingVertical : 20,
    borderRadius:20,
    flexDirection:'row',
  },
});

export default Home;
