import React, { useState, useEffect , Component} from 'react';
import PropTypes from 'prop-types'
import {
  StyleSheet, Text, View, StatusBar
} from 'react-native'
import Button from '../src/components/Button'
import { colors } from '../src/theme'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { render } from 'react-dom';
import { State } from 'react-native-gesture-handler';




export default class Home extends Component {

  render(){
    return(

  <View style={styles.root}>
    <StatusBar barStyle="light-content" />
    <Text style={styles.title}>Home</Text>
    <Button
      title="Go to Details"
      color="white"
      backgroundColor={colors.lightPurple}
      onPress={this.gotoDetails}
      />
    <Button
      title="Go to 큐알큐알"
      color="white"
      backgroundColor={colors.lightPurple}
      onPress={this.gotoQR}
      />
  </View>
    )
  }
  gotoQR = () => {
    this.props.navigation.navigate("QRcode")
  }
  gotoDetails = () => {
    this.props.navigation.navigate('testtest');
  };

}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
})

