import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

export default class IdScreen extends Component {
    render() {
      return (
        <View>
          <Text style={{alignItems: 'center',
      fontSize: 20,
      marginBottom: 60}}>나의 신분증 !</Text>
          <Image 
          style={styles.image}
          source={require('../src/images/a.jpg')} />
          <View>
              <Text>이름 : ______</Text>
              <Text>주민등록번호 :_______-______</Text>
              <Text>주소 : _______</Text>
              <Text>발급일자 : _________</Text>
              <Text>발급처 : ________</Text>
              <Text>유효기간 : ________</Text>
          </View>
        </View>
         
        
     
      );
    } 
  }
  
  const styles = StyleSheet.create({
    baseText: {
      
    },
    image:{
        height:'100%',
        width:'100%',
        marginLeft:300
    },
    
    appButtonText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
      alignSelf: 'center',
      textTransform: 'uppercase',
    },
  });