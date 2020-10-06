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
          <Content style={{marginBottom: -200}}>
          <TouchableOpacity onPress={this.gotoPassword}>
            <Card style={styles.card}>
            <View style={styles.line}>
                <Text>   </Text>
              </View>

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
          <Content style={{marginVertical:-110}}>
          <TouchableOpacity onPress={this.gotoGetCred}>
            <Card style={styles.card2}> 
              <View style={styles.plusIcon}>
                <FontIcon name='folder-plus-outline' color='#96b4ee' size={45}> 
                  </FontIcon> 

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
            <Text style={{ marginLeft:-10, marginTop: 3, fontSize: 14,
                  color: "white"}}> <FontIcon name='qrcode-scan' color='white' size={27}  style={{marginLeft:-90}} /><Text>   </Text>
              SCAN CODE
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
    
  }
  gotoQR = () => {
    this.props.navigation.navigate('QRcode_scanner');
  };
  gotoPassword = () => {
    this.props.navigation.navigate('SecondScreen');
  };
  gotoPassword_2 = () => {
    this.props.navigation.navigate('password');
  };
  gotoGetCred = () => {
    this.props.navigation.replace('Loading_2');
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
    height: 180,
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

  card2:{
    height: 100,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 50,
    paddingTop: 20,
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

  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 100,
    borderRadius: 100,
    backgroundColor: '#2c69dd',
    borderColor: '#96b4ee',
    height: 45,
    width: 180,
    borderRadius: 100,
    position: 'absolute',
    bottom: 30,
    shadowColor: '#A4A4A4',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      height: 4,
      width: 1,
    },
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

  // message:{
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 140,
  // },

});
