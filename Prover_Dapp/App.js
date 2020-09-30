import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { colors } from './src/theme';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

import SecondScreen from './screens/SecondScreen';
import password from './screens/password';

import IdScreen from './screens/IdScreen';
import Home from './screens/Home';
import QRcode from './screens/QRcode';
import Details from './screens/Details';
import Profile from './screens/Profile';
import Details2 from './screens/Details2';
import Loading from './screens/Loading';

import success from './screens/success';


// assets
import { imageAssets } from './src/theme/images';
import { fontAssets } from './src/theme/fonts';

// StackNavigator 객체 생성
// const createNav = createStackNavigator({
//   certification: { screen: HomeScreen },
//   Password: { screen: SecondScreen },
//   Home: { screen: Home },
//   testtest: { screen: Details },
//   Id: { screen: IdScreen },
//   QRcode: { screen: QRcode, ncavigationOptions: { header: null } },
// });

// const StacNav1 = createStackNavigator({
//   certification: {screen: HomeScreen}
// })

const StacNav2 = createStackNavigator({
  Home: { screen: Home },
  Details: { screen: Details },
  SecondScreen: { screen: SecondScreen },
  
  success: { screen: success },
  password: { screen: password },

  Details2: { screen: Details2 },

  QRcode: { screen: QRcode, ncavigationOptions: { header: null } },
});
const StacNav3 = createStackNavigator({
  Profile: { screen: Profile },
});

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: StacNav2,
    navigationOptions: {
      tabBarIcon: () => <FontIcon name='home' size={23}></FontIcon>,
    },
  },
  Profile: {
    screen: StacNav3,
    navigationOptions: {
      tabBarIcon: () => <FontIcon name='user' size={23}></FontIcon>,
    },
  },
});

const SwitchNav = createSwitchNavigator(
  {
    first: { screen: TabNavigator },
  },
  {
    initialRouteName: 'first',
  }
);

const Appcontainer = createAppContainer(SwitchNav)

export default class App extends Component{
  state={
    isLoading : true
  };
  componentDidMount= async() => {  
    // 1,000가 1초
    setTimeout(() => {this.setState({isLoading: false})},3000);
  }


  render(){
      if(this.state.isLoading){
        return <Loading/>
      }else{
        return <Appcontainer />
      }
  }
}

// const AppContainer = createAppContainer(SwitchNav);

// export default class App extends Component {
//   render() {
//     return (
//         <AppContainer />
//     );
//   }
// }

// 네비게이터 객체를 가지고 있는 AppContainer객체 생성 : 컴포넌트 객체
