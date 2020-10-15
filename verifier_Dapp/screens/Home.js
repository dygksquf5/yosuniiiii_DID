import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Container,  Content, Card } from 'native-base';
import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Profile from './Profile'

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
        <Profile />
        <Container>
          <Content style={{marginTop:-30}}>
            <Card style={styles.card}>
            <TouchableOpacity onPress={this.gotoQR}>
                <Text style={{marginLeft:18, marginTop: 9, fontSize: 16, flexDirection: 'row',
                  color: "white"}}> <FontIcon name="qrcode-scan" size="30"></FontIcon> <Text>  </Text>
                  SCAN CODE
                </Text>
                </TouchableOpacity>
            </Card>
          </Content>
        </Container>
      </View>
    );
    
  }
  gotoQR = () => {
    this.props.navigation.navigate('QRcode');
  };

  getToLedger = () => {
    this.props.navigation.navigate('Home');
    Axios.post('http://192.168.0.13:3001/api/log').then((response) =>
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
    height:50,
    marginLeft: 85,
    marginRight: 85,
    marginTop: 210,
    shadowColor: '#A4A4A4',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    borderRadius: 100,
    backgroundColor: '#2c69dd',
    borderColor: '#96b4ee',
  },

  icon1:{
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 35,
    marginRight: 210,
    width: 60,
    height: 60,
    
    
  },
  line:{
    backgroundColor:'#2c69dd',
    // #96b4ee
    fontSize: 5,
    marginTop: 28,
    marginBottom: -10
  },
  
  cardDate:{
    
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight:30,
    marginBottom:20,


  },
  plusIcon:{
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight:30,
    marginBottom:30 ,
    paddingTop:6,

  },

  cardDownText: {
    // backgroundColor: 'black',
    marginTop: -41,
    fontSize: 24,
    marginRight: 35,
    marginBottom:13,
    
  },

});
