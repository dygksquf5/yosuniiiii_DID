import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { colors } from './src/theme';
import FontIcon from 'react-native-vector-icons/FontAwesome5'



import HomeScreen from './screens/HomeScreen';
import SecondScreen from './screens/SecondScreen';
import MainScreen from './screens/MainScreen';
import IdScreen from './screens/IdScreen';
import Home from './screens/Home'
import QRcode from './screens/QRcode'
import Details from './screens/Details'
import Profile from './screens/Profile'

import stackNav from './src/navigator/stack'


// assets
import { imageAssets } from './src/theme/images'
import { fontAssets } from './src/theme/fonts'



// StackNavigator 객체 생성
// const createNav = createStackNavigator({
//   certification: { screen: HomeScreen },
//   Password: { screen: SecondScreen },
//   Home: { screen: Home },
//   testtest: { screen: Details },
//   Id: { screen: IdScreen },
//   QRcode: { screen: QRcode, ncavigationOptions: { header: null } },
// });


const StacNav1 = createStackNavigator({
  certification: {screen: HomeScreen},


})


const StacNav2 = createStackNavigator({
    Home: {screen: Home},
    SecondScreen : {screen: SecondScreen},
    Details: { screen: Details },

});
const StacNav3 = createStackNavigator({
    Profile: {screen: Profile},

})




const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: StacNav2,
    navigationOptions: {
      tabBarIcon: () => <FontIcon name="home" size={23}></FontIcon>
    }
  },
  Profile : {
    screen: StacNav3,
    navigationOptions: {
      tabBarIcon: () => <FontIcon name="user" size={23}></FontIcon>
    }

  },
});

const SwitchNav = createSwitchNavigator({
    
    second: { screen: TabNavigator},
  },
  {
    initialRouteName: 'second',
})



export default createAppContainer(SwitchNav);

// const AppContainer = createAppContainer(SwitchNav);

// export default class App extends Component {
//   render() {
//     return (
//         <AppContainer />
//     );
//   }
// }



// 네비게이터 객체를 가지고 있는 AppContainer객체 생성 : 컴포넌트 객체
