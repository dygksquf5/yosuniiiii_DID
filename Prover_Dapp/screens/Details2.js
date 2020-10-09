import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';


export default class Details2 extends Component {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar barStyle='light-content' />
        <Text style={styles.title}>여기는 디 테 일 22!!</Text>
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
    this.props.navigation.replace('Home');
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
