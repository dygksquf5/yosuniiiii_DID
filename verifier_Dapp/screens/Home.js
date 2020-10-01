import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';
import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';





export default class Home extends Component {
  render() {
    
    return (
      
      <View style={styles.root}>
        <Container>
          <Content>
            <Card style={styles.card}>
              <View style={{ margin: 8 }}>
                <TouchableOpacity onPress={this.gotoPassword}>
                  <Text style={styles.cardUpText}>나는 점주점주점주!!! </Text>

                  {/* 신분증 사진 넣게된다면 자리 ! */}
                  <View style={{ height: 150 }} />

                  <Text style={styles.cardDownText}>2022.01.10</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Content>
        </Container>

        <View style={styles.addButton}>
          <TouchableHighlight underlayColor='#ff7043' onPress={this.gotoQR}>
            <FontIcon name='qrcode-scan' color='white' size={35} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  gotoQR = () => {
    this.props.navigation.navigate('QRcode');
  };
  gotoDetails = () => {
    this.props.navigation.navigate('testtest');
  };
  gotoPassword = () => {
    this.props.navigation.navigate('SecondScreen');
  };


}

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 20,
  },

  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    height: 200,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: '#000000',
    borderRadius: 20,
    backgroundColor: '#9966CC',
    marginTop: 50,
  },

  cardUpText: {
    color: 'white',
    textAlign: 'left',
    marginLeft: 15,
  },

  cardDownText: {
    color: 'white',
    textAlign: 'right',
    marginRight: 15,
  },

  addButton: {
    backgroundColor: '#9966CC',
    borderColor: '#9966CC',
    borderWidth: 1,
    height: 75,
    width: 75,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    right: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
});
