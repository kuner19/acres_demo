/* eslint-disable react-native/no-inline-styles */

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/type';
import CustomAlert from '../../modals/alert';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BleManager } from 'react-native-ble-plx';

interface WithdrawGameplayProp {}
type WithdrawRouteProp = RouteProp<RootStackParamList, 'WithdrawGameplay'>;
type WithdrawGamplayScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WithdrawGameplay'>;

const WithdrawGameplay: React.FC<WithdrawGameplayProp> = ({ }) => {
  const route = useRoute<WithdrawRouteProp>();
  const navigation = useNavigation<WithdrawGamplayScreenNavigationProp>();
  const [modalVisible,setModalVisible] = useState(false);
  const [startWithdraw,setStartWithdraw] = useState(false);
  const [message, setMessage] = useState('');
  const {connectedDevice } = route.params;
  const [amount, setAmount] = useState('');
  const manager = new BleManager();

    const formatCurrency = (value:any) => {
    const cleaned = value.replace(/[^0-9]/g, '');

    if (!cleaned) {return '';}

    const number = parseFloat(cleaned) / 100;
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

    const handleChange = (text:any) => {
    const formatted = formatCurrency(text);
    setAmount(formatted);
  };
    const parseDollarString = (str:string) => {
  // Remove dollar sign and commas
  const cleaned = str.replace(/[$,]/g, '');
  return parseFloat(cleaned);
};
  const withdraw = async () => {
     const payload = {
        UUID: connectedDevice.id,
        PlayerId: '1234567890842456',
        PlayerAccountNumber: '1234567890842456',
        Destination: 'TO_EXTERNAL_ACCOUNT',
        SASSERIAL:
          connectedDevice.id === 'EFF5EF7D-FD6B-3982-C8F1-922B8CED6F2C'
            ? 'm1:KG:000151641'
            : 'm1:KG:000141793',
        ReferenceId: 'any reference string',
        CashableCents: Math.round(parseDollarString(amount) * 100),
        NonRestrictedCents: 0,
        RestrictedCents: 0,
      };
      try {
        const response = await fetch(
        'https://konnect-cgi-acres-dev.koinpayments.io/cts/funds/egm',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      let result = await response.json();
      if(result.error){
        setMessage(`${result.error}`);
      } else {
            try {
                await manager.cancelDeviceConnection(connectedDevice.id);
                navigation.navigate('Home');
            } catch (disconnectError) {
                setMessage(`Disconnect error: ${disconnectError}`,);
            }
            setMessage(`Successfully withdrew ${amount}`);
            }

      }catch(error){
        setMessage('Unable withdraw');
      }finally {
    setModalVisible(true);
    setStartWithdraw(false);
  }
};

  return (
    <SafeAreaView style={styles.img_container}>
      <View style={styles.container}>
        <View style={{width:'100%', position:'relative'}}>
          <Image source={require('../../assets/png/withdraw.png')} style={styles.image} />
        </View>
                <View>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={handleChange}
                    placeholder="$0.00"
                    placeholderTextColor={'#161616ff'}
                    maxLength={15}
                 />
            <TouchableOpacity onPress={()=>{
              withdraw();
              setStartWithdraw(!startWithdraw);
            }} style={styles.button} disabled={startWithdraw}>
              <Text style={{color:'white'}}>
                {startWithdraw ? '' : 'Withdraw'}
              </Text>
               {startWithdraw ? <ActivityIndicator size="small" color="#fff" style={{marginLeft:10}}/> : ''}
            </TouchableOpacity>
        </View>
      </View>
                        <CustomAlert
                  visible={modalVisible}
                  onClose={() =>
                  {
                    setStartWithdraw(false);
                    setModalVisible(false);
                  }
                  }
                  title="Alert"
                  message={message}
                />
        </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  container: {
    justifyContent:'center',
    alignItems:'center',
    height:'100%',
  },
  button : {
    backgroundColor: '#134d9fff',
    paddingHorizontal: 40,
    paddingVertical : 20,
    borderRadius:20,
    flexDirection:'row',
    marginTop:30,
    justifyContent:'center',
    minWidth:200,
  },
  img_container:{
    alignItems:'center',
  },
  image : {
    width:180,
    height:180,
  },
  lottie:{
    width:250,
    height:250,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -225 }, // -width / 2
      { translateY: -225}, // -height / 2
    ],
  },
  modal:{
    width:250,
    height:250,
    backgroundColor:'red',
  },
  input:{
    fontSize: 30,
    borderBottomWidth: 1,
    borderColor: '#888',
    paddingVertical: 4,
    marginTop:15,
    color:'#161616ff',
  },
});

export default WithdrawGameplay;
