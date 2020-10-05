import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { render } from 'react-dom';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { State } from 'react-native-gesture-handler';
import SvgQRCode from 'react-native-qrcode-svg';


function Simple() {
  return <SvgQRCode value="Th7MpTaRZVRYnPiabds81Y:2:KIMYOHAN:1.0" size={300}/>
}


export default class Details extends Component {
  render() {
    return (
      <View style={styles.root}>
        
        <Simple />
      </View>
    );
  }

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
