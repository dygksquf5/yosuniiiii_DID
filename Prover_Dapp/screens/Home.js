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
          <TouchableOpacity onPress={this.gotoPassword}>
            <Card style={styles.card}>
              <View style={styles.icon1}>
                  <FontIcon name='id-card' color='black' size={50}> 
                  <Text style={styles.cardDownText}>   모바일 신분증</Text>
                  </FontIcon> 
              </View>
              <View style={styles.cardDate}>
                <Text ></Text>
                <Text >2022.01.10</Text>
              </View>

            </Card>
            </TouchableOpacity>
          </Content>
        </Container>

        <View style={styles.addButton2}>
          <TouchableHighlight
            underlayColor='#ff7043'
            onPress={this.gotoPassword_2}>
            <FontIcon name='send' color='#231d54' size={35} />
          </TouchableHighlight>
        </View>

        <View style={styles.addButton}>
          <TouchableHighlight underlayColor='#ff7043' onPress={this.gotoQR}>
            <FontIcon name='qrcode-scan' color='#231d54' size={35} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  gotoQR = () => {
    this.props.navigation.navigate('QRcode');
  };
  gotoPassword = () => {
    this.props.navigation.navigate('SecondScreen');
  };
  gotoPassword_2 = () => {
    this.props.navigation.navigate('password');
  };

  getToLedger = () => {
    this.props.navigation.navigate('Home');
    Axios.post('http://192.168.0.5:3001/api/log').then((response) =>
      setproverDID(response.data)
    );
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

  // button: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
    
  // },

  card: {
    height: 140,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 40,
    shadowColor: '#A4A4A4',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
  },
  icon1:{
    alignItems: 'flex-start',
    justifyContent: 'center',
    // backgroundColor: 'black',
    marginLeft: 30,
    marginTop: 35,

  },
  cardDate:{
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight:30,
    marginBottom:20,


  },

  cardDownText: {
    fontWeight: 'bold',
    fontSize: 25
    
  },

  addButton: {
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
    borderWidth: 1,
    height: 65,
    width: 65,
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
  addButton2: {
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
    borderWidth: 1,
    height: 65,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 130,
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
