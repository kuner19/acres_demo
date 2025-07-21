/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Home from './src/pages/home/Home';
import Funding from './src/pages/funding/Funding';
import App from './App';


AppRegistry.registerComponent(appName, () => App);

console.log('Home:', Home);
console.log('Funding:', Funding);