import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import SecondScreen from './screens/SecondScreen';
import MainScreen from './screens/MainScreen';
import IdScreen from './screens/IdScreen';


// StackNavigator 객체 생성
const stackNav = createStackNavigator({
  // Home: {screen:HomeScreen, ncavigationOptions:{header:null}},
  First: {screen: HomeScreen},
  Second: {screen: SecondScreen},
  Home: {screen: MainScreen},
  Id: {screen:IdScreen},
  // QR: {screens: QRApp, ncavigationOptions:{header:null}},
});

// 네비게이터 객체를 가지고 있는 AppContainer객체 생성 : 컴포넌트 객체
const Container = createAppContainer(stackNav);

export default class Main extends Component {
  render() {
    return <Container theme="light"></Container>;
  }
}