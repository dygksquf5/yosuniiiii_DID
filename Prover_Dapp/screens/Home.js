import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';
import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Axios from 'axios';


 // database 로 완성시켜야 될 코드!!! // 
let testtest1 = '신분증이 없습니다'
let testtest2 = '모바일 신분증 '
let date_1 = '2022.01.10';
let a = 1;
let testtest = null; 
let test_pic = null;


if (a == undefined){
   testtest = testtest1,
   test_pic = null,
   date_1 = "발급받으세요"
} else {
   testtest = testtest2
   test_pic = require("../assets/images/IDcard.png"),
   date_1
}
// ------------------------------// 



export default class Home extends Component {
  render() {

    return (
      <View style={styles.root}>
        <Container>
          <Content>
          <TouchableOpacity onPress={this.gotoPassword}>
            <Card style={styles.card}>
            {/* <View style={styles.line}>
                <Text>   </Text>
              </View> */}

              <View style={styles.cardDate}>
              <Image style={styles.icon1} 
               source={test_pic}>
              {/* <FontIcon name='script-text' color='black' size={44}> 
                  </FontIcon>  */}
                  </Image>

              <Text style={styles.cardDownText}>{testtest}</Text>
                <Text >{date_1}</Text>
              </View>

            </Card>
            </TouchableOpacity>
          </Content>
        </Container>
        <View style={styles.addButton}>
          <TouchableHighlight underlayColor='#ff7043' onPress={this.gotoQR} >
            {/* <Image
            source={require("../assets/images/qrcode.png")}>
            </Image> */}
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
    justifyContent: 'flex-start',
    marginTop: 35,
    marginRight: 210,
    width: 60,
    height: 60,
    
    
  },
  // line:{
  //   backgroundColor:'#f4c151',
  //   fontSize: 5,
  //   marginTop: 20,
  //   marginBottom: -10
  // },
  
  cardDate:{
    
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight:30,
    marginBottom:20,


  },

  cardDownText: {
    // backgroundColor: 'black',
    marginTop: -41,
    fontSize: 24,
    marginRight: 35,
    marginBottom:13,
    
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
});
