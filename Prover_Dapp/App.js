import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer'
import { colors } from './src/theme';
// import Button from './src/components/Button';
import {
  TouchableOpacity
} from 'react-native';

import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';


import SecondScreen from './screens/SecondScreen';
import password from './screens/password';

import Home from './screens/Home';
import QRcode_scanner from './screens/QRcode_scanner';
import Details from './screens/Details';
import Profile from './screens/Profile';
import Details2 from './screens/Details2';
import Loading from './screens/Loading';
import QRgenerator_adult from './screens/QRgenerator_adult';
import QRgenerator_minor from './screens/QRgenerator_minor';
import success from './screens/success';
import Loading_2 from './screens/Loading_2'
import wallet from './screens/wallet'



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

let user_name = "김요한"

const message = createStackNavigator({


  Profile: { screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: "Recent Message",
      headerRight:
      <TouchableOpacity><FontIcon 
      name={"menu"}
      size={30}
      onPress={() => navigation.openDrawer()}
      color="black"
      paddingLeft= {10}>
       </FontIcon>
       </TouchableOpacity>,
      ...navigationProps,
    }),
 },


 
})


const StacNav2 = createStackNavigator({
  Home: { screen: Home ,
    navigationOptions: ({ navigation }) => ({
      title: user_name+"님",
      headerRight:
      <TouchableOpacity><FontIcon 
      name={"menu"}
      size={30}
      onPress={() => navigation.openDrawer()}

      color="black"
      paddingLeft= {10}>
       </FontIcon>
       </TouchableOpacity>,
      ...navigationProps,  
    }),
   },
  Details: { screen: Details,
    navigationOptions: ({ navigation }) => ({
      title: "  Details",
      headerTintColor: 'black',
      headerStyle: { backgroundColor: 'white' , height: 110 },
      headerTitleStyle: { fontSize: 20, fontweight: 'bold', marginRight:80 , alignItems: 'flex-start',
      justifyContent: 'center',

    },
    }),
 },
 Details2: { screen: Details2,
  navigationOptions: ({ navigation }) => ({
    title: "  Details2",
    headerTintColor: 'black',
    headerStyle: { backgroundColor: 'white' , height: 110 },
    headerTitleStyle: { fontSize: 20, fontweight: 'bold', marginRight:80 , alignItems: 'flex-start',
    justifyContent: 'center',

  },
  }),
},

  SecondScreen: { screen: SecondScreen,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
 },
 QRgenerator_adult: {screen: QRgenerator_adult,
    navigationOptions: ({ navigation }) => ({
      title: " ",
      headerTintColor: 'black',
      headerStyle: { backgroundColor: 'white' , height: 110 },
      headerTitleStyle: { fontSize: 20, fontweight: 'bold', marginRight:80 , alignItems: 'flex-start',
      justifyContent: 'center',
    },
    }),
},
QRgenerator_minor: {screen: QRgenerator_minor,
  navigationOptions: ({ navigation }) => ({
    title: " ",
    headerTintColor: 'black',
    headerStyle: { backgroundColor: 'white' , height: 110 },
    headerTitleStyle: { fontSize: 20, fontweight: 'bold', marginRight:80 , alignItems: 'flex-start',
    justifyContent: 'center',
  },
  }),
},

  QRcode_scanner: { screen: QRcode_scanner, ncavigationOptions: { headerShown: false } },

  password: { screen: password,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
      ...navigationProps,
    }),
 },


 Loading_2: { screen: Loading_2,
  navigationOptions: ({ navigation }) => ({
    headerShown: false,
  }),
},

password: { screen: password,
  navigationOptions: ({ navigation }) => ({
    headerShown: false,
    ...navigationProps,
  }),
},

success: { screen: success,
navigationOptions: ({ navigation }) => ({
  headerShown: false,
  ...navigationProps,
}),
},

wallet : { screen: wallet,
  navigationOptions: ({ navigation }) => ({
    headerShown: false,
    ...navigationProps,
  }),
  },

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
  message: {
    screen: message,
    navigationOptions: {
      tabBarIcon: () => <FontIcon name='android-messages' fontweight="bold" color="#231d54" size={30}></FontIcon>,
      tabBarOptions: {
        activeTintColor: "#2c69dd",
        inactiveTintColor: "gray"
      }
    },
  },
});



const DrawerNavigator = createDrawerNavigator({

  홈: {
    screen: TabNavigator,
    navigationOptions: {
      navOptionIcon: () => <FontIcon name='home-city' size={30}></FontIcon>   },
  },
  지갑리셋 : wallet,
});

const Appcontainer = createAppContainer(DrawerNavigator);

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
        Axios.post('http://192.168.0.14:3001/api/log')
        return <Loading/>
      }else{
        return <Appcontainer />
      }
  }
}

