import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, 
  Text,
  View,
  StatusBar,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Image
 } from 'react-native';
import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';

import Axios from 'axios';



export default class Details extends Component {

state = {
  name: '',
  age:'',
  address:'',
  phone_number:'',
  gender:'',
  country:'',
}

  componentWillMount() {
    Axios.post('http://192.168.0.14:3001/api/getCred/adult')
    .then(response => {this.setState({
      name: response.data.name,
      age:response.data.age,
      address:response.data.address,
      phone_number:response.data.phone_number,
      gender:response.data.gender,
      country:response.data.country,
    })})

  }






  render() {
    return (
      <View style={styles.root}>
        <Container>
          <Content>
          <TouchableOpacity >
            <Card style={styles.card}>
              <View style={styles.information}>
                <Text > 이름 : {this.state.name}</Text>
                <Text > 나이 : {this.state.age}</Text>
                <Text > 주소 : {this.state.address}</Text>
                <Text > 성별 : {this.state.gender}</Text>
                <Text > 국가 : {this.state.country}</Text>            
            

              </View>
            </Card>
            </TouchableOpacity>
          </Content>

          <Content style={{marginVertical:-100}}>
          <TouchableOpacity onPress={this.Minor_Credential}>
            <Card style={styles.card2}>
              <View style={styles.information2}>
                <Text > Minor Credential -> {this.state.name2}</Text>
            

              </View>
            </Card>
            </TouchableOpacity>
          </Content>


        </Container>



        <StatusBar barStyle='light-content' />
        <Text style={styles.title}>인증 QR코드 생성하기</Text>
        <View style={styles.addButton}>
        <TouchableHighlight underlayColor='#ff7043' onPress={this.QRgenerator_adult}>
          <FontIcon name='qrcode-scan' color='#231d54' size={35} />
        </TouchableHighlight>
        </View>

      </View>
    );
  }
  QRgenerator_adult = () => {
    this.props.navigation.replace('QRgenerator_adult');
  };
  Minor_Credential = () => {
    this.props.navigation.replace('Details2');
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
  addButton: {
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
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
  card: {
    height: 150,
    width: 300,
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
  card2: {
    height: 50,
    width: 300,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
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

  information: {
    marginTop: 30,
    marginLeft: 30,
    fontSize: 10,
  },
  information2:{
    marginTop: 15,
    marginLeft: 80,
    fontSize: 10,
  },
});
