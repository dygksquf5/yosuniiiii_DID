import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { render } from 'react-dom';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { State } from 'react-native-gesture-handler';
import Axios from 'axios';
import SvgQRCode from 'react-native-qrcode-svg';


// const [credential, setcredential] = useState("");

function Simple() {
  return <SvgQRCode value="Th7MpTaRZVRYnPiabds81Y:2:KIMYOHAN:1.0" />;
}

async function requestCred(){
  await Axios.post('http://192.168.0.5:3001/api/requestCred')
  .then(response => setcredential(response.data))

}
async function getCred(){
  await Axios.post('http://192.168.0.5:3001/api/getCred')
  .then(response => setcredential(response.data))

}

// async function makeSchema(){
//   await Axios.post('http://192.168.0.5:3000/api/makeSchema')
//   .then(response => setcredential(response.data))

// }



export default class Profile extends Component {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar barStyle='light-content' />
        <Text style={styles.title}>여기는 디 테 일2222 !!</Text>
        <Button
          title=" offer 요청 "
          color='white'
          backgroundColor={colors.pink}
          onPress={() => requestCred()}
        />
        <Button
          title='지갑에서 신분증 요청하기!'
          color='white'
          backgroundColor={colors.pink}
          onPress={() => getCred()}
        />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Simple />
      </View>



        
        <Button
          title='새로운 스키마 만들기!! (나중에 지울거임)'
          color='white'
          backgroundColor={colors.pink}
          onPress={() => makeSchema()}        
          />



        <Button
          title='Go Back'
          color='white'
          backgroundColor={colors.pink}
          onPress={this.gotoBack}
        />
        
      </View>
    );
  }
  gotoBack = () => {
    this.props.navigation.navigate('Home');
  };
}

// const { from } = navigation.state.params

// Details.propTypes = {
//   navigation: PropTypes.shape({
//     state: PropTypes.shape({
//       params: PropTypes.shape({
//         from: PropTypes.string,
//       }),
//     }),
//     goBack: PropTypes.func,
//   }),
// }

// Details.defaultProps = {
//   navigation: {
//     state: {
//       params: {
//         from: '',
//       },
//     },
//     goBack: () => null,
//   },
// }

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
