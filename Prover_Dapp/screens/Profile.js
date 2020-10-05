import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, 
  Text, 
  View, 
  StatusBar,  
  TouchableOpacity,
  TouchableHighlight,
  Image
} from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { render } from 'react-dom';
import Axios from 'axios';
import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';




async function getCred(){
  await Axios.post('http://192.168.0.5:3001/api/getCred')
  .then(response => setcredential(response.data))

}




export default class Profile extends Component {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar barStyle='light-content'/>
        {/* <Text style={styles.title}>여기는 디 테 일2222 !!</Text>
        <Button
          title='testtesttest'
          color='white'
          backgroundColor={colors.pink}
          onPress={() => getCred()}
        /> */}
      <Container>
          <Content >

              
        <View style={styles.view1} >
        
          <View style={{width: 137, height: 50, backgroundColor: 'powderblue'}}> 
          <Image style={{width: 80, height: 50,}}
         source={require("../assets/images/certification.png")}>
          </Image>
          </View>

          <View style={styles.view2} >
          <Text>어디에서 인증되었나 ~</Text>
          </View> 

          <View style={styles.view3} >
           <Text>2020.10.5</Text>
          </View>

        </View>
       
         
          </Content>
        </Container>
      {/* <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
      </View> */}

      {/* <View style={styles.addButton2}>
          <TouchableHighlight
            underlayColor='#ff7043'
            onPress={this.gotoPassword_2}>
            <FontIcon name='send' color='#231d54' size={35} />
          </TouchableHighlight>
        </View>

 */}

      </View>
    );
  }
  gotoBack = () => {
    this.props.navigation.navigate('Home');
  };
}

// style={{width: 137, height: 50,  backgroundColor: 'steelblue'}}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  view1:{
    flex: 1,
    flexDirection: 'row',
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
  view2:{
    width: 137,
    height: 50,
    backgroundColor: 'skyblue',
    shadowColor: '#A4A4A4',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    borderColor: '#FAFAFA',
  },
  view3:{
    width: 137,
    height: 50,
    backgroundColor: 'steelblue',
    shadowColor: '#A4A4A4',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    borderColor: '#FAFAFA',

  },

  
  });
