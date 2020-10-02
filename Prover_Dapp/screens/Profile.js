import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { render } from 'react-dom';
import { State } from 'react-native-gesture-handler';
import Axios from 'axios';
import SvgQRCode from 'react-native-qrcode-svg';




async function getCred(){
  await Axios.post('http://192.168.0.5:3001/api/getCred')
  .then(response => setcredential(response.data))

}




export default class Profile extends Component {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar barStyle='light-content' />
        <Text style={styles.title}>여기는 디 테 일2222 !!</Text>
        <Button
          title='testtesttest'
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
      </View>

      </View>
    );
  }
  gotoBack = () => {
    this.props.navigation.navigate('Home');
  };
}


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
