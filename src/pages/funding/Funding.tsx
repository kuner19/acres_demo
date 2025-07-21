/* eslint-disable react-native/no-inline-styles */

import LottieView from 'lottie-react-native';
import React, {useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FundingProps {}

const Funding: React.FC<FundingProps> = ({ }) => {
  const [startWithdraw,setStartWithdraw] = useState(false);
  const [startFund,setStartFund] = useState(false);

  return (
    <SafeAreaView style={styles.img_container}>
      <View style={styles.container}>
        <View style={{width:'100%', position:'relative'}}>
          <LottieView
            source={require('../../assets/lottie/confetti.json')}r
            style={styles.lottie}
            autoPlay
            loop={false}
          />
          <Image source={require('../../assets/png/slotmachine2.png')} style={styles.image} />
        </View>
                <View>
            <TouchableOpacity onPress={()=>{
              setStartFund(!startFund);
            }} style={styles.button}>
              <Text style={{color:'white'}}>
                {startFund ? '' : 'Fund Game'}
              </Text>
               {startFund ? <ActivityIndicator size="small" color="#fff" style={{marginLeft:10}}/> : ''}
            </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
              setStartWithdraw(!startWithdraw);
            }} style={styles.button}>
              <Text style={{color:'white'}}>
                {startWithdraw ? '' : 'Withdraw Game'}
              </Text>
               {startWithdraw ? <ActivityIndicator size="small" color="#fff" style={{marginLeft:10}}/> : ''}
            </TouchableOpacity>
        </View>
      </View>
        </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent:'center',
    alignItems:'center',
    height:'100%'
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
  }
});

export default Funding;
