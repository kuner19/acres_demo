import React from 'react';
import Home from './src/pages/home/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Funding from './src/pages/funding/Funding';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='Funding' component={Funding}/>
      </Stack.Navigator>
    </NavigationContainer>

  )
};

export default App;