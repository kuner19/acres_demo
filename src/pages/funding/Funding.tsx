/* eslint-disable react-native/no-inline-styles */

import { RouteProp, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, {useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/type';
import CustomAlert from '../../modals/alert';

interface FundingProps {}
type FundingRouteProp = RouteProp<RootStackParamList, 'Funding'>;

const Funding: React.FC<FundingProps> = ({ }) => {
  const route = useRoute<FundingRouteProp>();
  const [startWithdraw,setStartWithdraw] = useState(false);
  const [modalVisible,setModalVisible] = useState(false);
  const [startFund,setStartFund] = useState(false);
  const [message, setMessage] = useState('');
  const { deviceUUID } = route.params;

  const fund = async () => {
        const payload = {
        UUID: deviceUUID,
        PlayerId: '1234567890842456',
        PlayerAccountNumber: '1234567890842456',
        Destination: 'TO_EGM',
        SASSERIAL:
          deviceUUID === 'EFF5EF7D-FD6B-3982-C8F1-922B8CED6F2C'
            ? 'm1:KG:000151641'
            : 'm1:KG:000141793',
        ReferenceId: 'any reference string',
        CashableCents: Math.round(parseFloat('20') * 100),
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
      setMessage('Successfully fund');
      setModalVisible(true);
      }catch(error){
        setMessage('Unable to fund');
        setModalVisible(true);
      }
};

  const withdraw = async () => {
        const payload = {
        UUID: deviceUUID,
        PlayerId: '1234567890842456',
        PlayerAccountNumber: '1234567890842456',
        Destination: 'TO_EXTERNAL_ACCOUNT',
        SASSERIAL:
          deviceUUID === 'EFF5EF7D-FD6B-3982-C8F1-922B8CED6F2C'
            ? 'm1:KG:000151641'
            : 'm1:KG:000141793',
        ReferenceId: 'any reference string',
        CashableCents: Math.round(parseFloat('20') * 100),
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
      setMessage('Sucessfully withdraw');
      setModalVisible(true);
      }catch(error){
        setMessage('Unable withdraw');
        setModalVisible(true);
      }
};

  return (
    <SafeAreaView style={styles.img_container}>
      <View style={styles.container}>
        <View style={{width:'100%', position:'relative'}}>
          <LottieView
            source={require('../../assets/lottie/confetti.json')}
            style={styles.lottie}
            autoPlay
            loop={false}
          />
          <Image source={require('../../assets/png/slotmachine2.png')} style={styles.image} />
        </View>
                <View>
            <TouchableOpacity onPress={()=>{
              fund()
              setStartFund(!startFund);
            }} style={styles.button}>
              <Text style={{color:'white'}}>
                {startFund ? '' : 'Fund Game'}
              </Text>
               {startFund ? <ActivityIndicator size="small" color="#fff" style={{marginLeft:10}}/> : ''}
            </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
                withdraw();
              setStartWithdraw(!startWithdraw);
            }} style={styles.button}>
              <Text style={{color:'white'}}>
                {startWithdraw ? '' : 'Withdraw Game'}
              </Text>
               {startWithdraw ? <ActivityIndicator size="small" color="#fff" style={{marginLeft:10}}/> : ''}
            </TouchableOpacity>
        </View>
      </View>
                        <CustomAlert
                  visible={modalVisible}
                  onClose={() =>
                  {
                    setStartFund(false);
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
    width:200,
    height:200,
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
  }
});

export default Funding;
