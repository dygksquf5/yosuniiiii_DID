import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { render } from 'react-dom';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { State } from 'react-native-gesture-handler';

export default class Details extends Component {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar barStyle='light-content' />
        <Text style={styles.title}>여기는 디 테 일 !!</Text>
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
