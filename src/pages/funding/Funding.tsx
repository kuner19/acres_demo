/* eslint-disable react-native/no-inline-styles */

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/type';
import CustomAlert from '../../modals/alert';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface FundingProps {}
type FundingRouteProp = RouteProp<RootStackParamList, 'Funding'>;
type FundGamplayScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FundGameplay'>;

const Funding: React.FC<FundingProps> = ({ }) => {
  const navigation = useNavigation<FundGamplayScreenNavigationProp>();
  const route = useRoute<FundingRouteProp>();
  const [startWithdraw,setStartWithdraw] = useState(false);
  const [modalVisible,setModalVisible] = useState(false);
  const [startFund,setStartFund] = useState(false);
  const [message, setMessage] = useState('');
  const { deviceUUID,from,connectedDevice } = route.params;


  useEffect(()=>{
      setMessage(`deviceUUID : ${deviceUUID} , from : ${from}`);
      setModalVisible(true);
  },[deviceUUID,from]);


  const fund = async () => {
            navigation.navigate('FundGameplay', {
            connectedDevice,
          });
};

  const withdraw = async () => {
            navigation.navigate('WithdrawGameplay', {
            connectedDevice,
          });
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
              fund();
            }} style={styles.button}>
              <Text style={{color:'white'}}>
                {startFund ? '' : 'Fund Game'}
              </Text>
               {startFund ? <ActivityIndicator size="small" color="#fff" style={{marginLeft:10}}/> : ''}
            </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
                withdraw();
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
