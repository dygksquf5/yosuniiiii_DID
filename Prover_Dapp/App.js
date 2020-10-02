import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { colors } from './src/theme';
// import Button from './src/components/Button';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Button,
} from 'react-native';

import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';


import SecondScreen from './screens/SecondScreen';
import password from './screens/password';

import IdScreen from './screens/IdScreen';
import Home from './screens/Home';
import QRcode from './screens/QRcode';
import Details from './screens/Details';
import Profile from './screens/Profile';
import Details2 from './screens/Details2';
import Loading from './screens/Loading';
import QRgenerator from './screens/QRgenerator';
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


const navigationProps = {
  headerTintColor: 'white',
  headerStyle: { backgroundColor: colors.darkPurple , height: 110 },
  headerTitleStyle: { fontSize: 27, fontweight: 'bold', marginRight:80 , alignItems: 'flex-start',
  justifyContent: 'center',
},
}

let test_1 = "요한"
const StacNav2 = createStackNavigator({
  Home: { screen: Home ,
    navigationOptions: ({ navigation }) => ({
      title: test_1+"님, 반갑습니다",
      ...navigationProps,
      headerRight: <TouchableOpacity><FontIcon 
      name={"android-messages"}
      size={30}
      marginRight={30}
      onPress={() => navigation.navigate("Profile")}
      color="white">
       </FontIcon>
       </TouchableOpacity>
  
    }),
   },
  Details: { screen: Details,
    navigationOptions: ({ navigation }) => ({
      title: "신분증 상세정보",
      headerTintColor: 'black',
      headerStyle: { backgroundColor: 'white' , height: 110 },
      headerTitleStyle: { fontSize: 20, fontweight: 'bold', marginRight:80 , alignItems: 'flex-start',
      justifyContent: 'center',
    },
    }),
 },
  SecondScreen: { screen: SecondScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      ...navigationProps,   
    }),
 },
  QRgenerator: {screen: QRgenerator,
    navigationOptions: ({ navigation }) => ({
      title: "신원인증 QRcode",
      headerTintColor: 'black',
      headerStyle: { backgroundColor: 'white' , height: 110 },
      headerTitleStyle: { fontSize: 20, fontweight: 'bold', marginRight:80 , alignItems: 'flex-start',
      justifyContent: 'center',
    },
    }),
},

  success: { screen: success,
    navigationOptions: ({ navigation }) => ({
      title: " ",
      ...navigationProps,
    }),
 },
  password: { screen: password,
    navigationOptions: ({ navigation }) => ({
      header: null,
      ...navigationProps,
    }),
 },

  Details2: { screen: Details2,
    navigationOptions: ({ navigation }) => ({
      title: test_1+"님, 반갑습니다",
      ...navigationProps,
    }),
 },

  QRcode: { screen: QRcode, ncavigationOptions: { header: null } },
});
const StacNav3 = createStackNavigator({
  Profile: { screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: test_1+"님, 반갑습니다",
      ...navigationProps,
    }),
 },
});

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: StacNav2,
    navigationOptions: {
      tabBarIcon: () => <FontIcon name='home' fontweight="bold" color="#231d54" size={30}></FontIcon>,
    },
  },
  Profile: {
    screen: StacNav3,
    navigationOptions: {
      tabBarIcon: () => <FontIcon name='android-messages' fontweight="bold" color="#231d54" size={30}></FontIcon>,
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
    setTimeout(() => {this.setState({isLoading: false})},4000);
  }


  render(){
      if(this.state.isLoading){
        Axios.post('http://192.168.0.5:3001/api/log').then((response) =>
        setproverDID(response.data)
      );  
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
