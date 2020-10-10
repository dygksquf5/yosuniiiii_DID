import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import Axios from 'axios';


export default class wallet extends Component {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar barStyle='light-content' />
        <Text style={styles.title}>wallet reset하기</Text>
        <Button
          title='Go Back'
          color='white'
          backgroundColor={colors.pink}
          onPress={this.resetWallet}
        />
      </View>
    );
  }
  resetWallet = () => {
    this.props.navigation.navigate('Home');
    Axios.post('http://192.168.0.14:3001/api/deleteWallet_and_create')
  };
};



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
