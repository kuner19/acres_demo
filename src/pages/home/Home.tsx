/* eslint-disable react-native/no-inline-styles */

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/type';

interface HomeProps {
}
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const Home: React.FC<HomeProps> = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [startConnection,setStartConnection] = useState(false)

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
              // setStartConnection(!startConnection);
              navigation.navigate('Funding')
            }} style={styles.button}>
              <Text style={{color:'white'}}>
                {startConnection ? 'Searching a device to pair' : 'Connect to Bluetooth'}
              </Text> 
               {startConnection ? <ActivityIndicator size="small" color="#fff" style={{marginLeft:10}}/> : ''}
            </TouchableOpacity>
        </View>
        </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#07254cff',
    justifyContent:'center',
    alignItems:'center',
  },
  button : {
    backgroundColor: 'rgba(19, 77, 159, 1)',
    paddingHorizontal: 40,
    paddingVertical : 20,
    borderRadius:20,
    flexDirection:'row',
  }
});

export default Home;
