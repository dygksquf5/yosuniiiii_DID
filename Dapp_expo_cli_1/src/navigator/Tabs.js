import React from 'react'
import { View } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import { colors } from '../theme';


// import HomeScreen from '../../screens/HomeScreen';
// import SecondScreen from '../../screens/SecondScreen';
// import MainScreen from '../../screens/MainScreen';
// import IdScreen from '../../screens/IdScreen';
// import Home from '../../screens/Home';
// import Details from '../../screens/Details';
// import QRcode from '../../screens/QRcode';

import { certification, Home_test, QRcode_test } from './stack'
// stack navigators
// import { HomeNavigator, ProfileNavigator, QRcodeNavigator } from '../stacks'

const TabNavigator = createBottomTabNavigator(
  {
    HomeTab: {
      screen: certification,
      navigationOptions: { title: 'certification' },
    },
    ProfileTab: {
      screen: Home_test,
      navigationOptions: { title: 'Home' },
    },
    QRcodetTab: {
      screen: QRcode_test,
      navigationOptions: { title: 'QRQR' },
    },
  },
  // {
  //   defaultNavigationOptions: ({ navigation }) => ({
  //     // eslint-disable-next-line react/prop-types
  //     tabBarIcon: ({ focused }) => {
  //       const { routeName } = navigation.state
  //       switch (routeName) {
  //         case 'HomeTab':
  //           return (
  //             <FontIcon
  //               name="home"
  //               color={focused ? colors.lightPurple : colors.gray}
  //               size={20}
  //               solid
  //             />
  //           )
  //         case 'ProfileTab':
  //           return (
  //             <FontIcon
  //               name="user"
  //               color={focused ? colors.lightPurple : colors.gray}
  //               size={20}
  //               solid
  //             />
  //           )
  //           case 'QRcodeTab':
  //             return (
  //               <FontIcon
  //                 name="qrcode"
  //                 color={focused ? colors.lightPurple : colors.gray}
  //                 size={20}
  //                 solid
  //               />
  //             )
  //         default:
  //           return <View />
  //       }
  //     },
  //     initialRouteName: 'Home',
  //     tabBarOptions: {
  //       activeTintColor: colors.lightPurple,
  //       inactiveTintColor: colors.gray,
  //       style: {
  //         // backgroundColor: 'white',
  //         // borderTopColor: 'gray',
  //         // borderTopWidth: 1,
  //         // paddingBottom: 5,
  //         // paddingTop: 5,
  //       },
  //     },
  //     swipeEnabled: false,
  //   }),
  // },
)

export default TabNavigator
