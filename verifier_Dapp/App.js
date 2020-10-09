import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';


import Home from './screens/Home';
import QRcode from './screens/QRcode';
import Loading from './screens/Loading';


const navigationProps = {
  headerTintColor: 'black',
  headerStyle: { backgroundColor: 'white', 
  height: 90, 
  shadowColor: '#A4A4A4',
  shadowOpacity: 0.4,
  shadowRadius: 3,
  shadowOffset: {
    height: 4,
    width: 1,
  },

},
  headerTitleStyle: { fontSize: 27, marginLeft: -130, marginTop:-10 },
}

let user_name = "점주"


const StacNav2 = createStackNavigator({
  Home: { screen: Home ,
    navigationOptions: ({ navigation }) => ({
      title: user_name+"님",
      ...navigationProps,  
    }),
   },

  QRcode: { screen: QRcode, ncavigationOptions: { headerShown: false } },


});


const StacNav3 = createStackNavigator({
  QRcode: { screen: QRcode, ncavigationOptions: { headerShown: false } },

 
});



const TabNavigator = createBottomTabNavigator({
  홈: {
    screen: StacNav2,
    navigationOptions: {
      tabBarIcon: () => <FontIcon name='home-city' fontweight="bold" color="#231d54" size={30}></FontIcon>,
      tabBarOptions: {
        activeTintColor: "#2c69dd",
        inactiveTintColor: "gray",
      }
    },
  },
  connection: {
    screen: StacNav3,
    navigationOptions: {
      tabBarIcon: () => <FontIcon name='qrcode-scan' fontweight="bold" color="#231d54" size={30}></FontIcon>,
      tabBarOptions: {
        activeTintColor: "#2c69dd",
        inactiveTintColor: "gray"
      }
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
        Axios.post('http://192.168.0.5:3002/api/log')
        return <Loading/>
      }else{
        return <Appcontainer />
      }
  }
}

