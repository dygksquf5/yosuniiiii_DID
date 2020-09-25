import React, { useState, useEffect , Component} from 'react';
import PropTypes from 'prop-types'
import {
  StyleSheet, Text, View, StatusBar, TouchableOpacity
} from 'react-native'
import Button from '../src/components/Button'
import { colors } from '../src/theme'
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { render } from 'react-dom';
import { State } from 'react-native-gesture-handler';




export default class Home extends Component {

  render(){
    return(
      
<View style={styles.root}>
    <View>
<Text style={styles.name}> O O O 님 ! </Text>

<TouchableOpacity onPress={this.gotoDetails}>
<Container>
  <Content style={{marginTop: 30,}}>
    <Card style={styles.card}>
      <CardItem header>
        <Text>나의 신분증 !</Text>
      </CardItem>
      <CardItem>
        <Body>
{/* <View style={{height: 200}}/> */}
        </Body>
      </CardItem>
      <CardItem footer>
        <Text style={{marginLeft: 280}}>2022.01.10</Text>
      </CardItem>
   </Card>
  </Content>
</Container>
</TouchableOpacity>
</View>

    {/* <StatusBar barStyle="light-content" />
    <Text style={styles.title}>Home</Text> */}
    {/* <Button
      title="Go to Details"
      color="white"
      backgroundColor={colors.lightPurple}
      onPress={this.gotoDetails}
      /> */}
    {/* <Button style={styles.button}
      title="Go to 큐알큐알"
      color="white"
      backgroundColor={colors.lightPurple}
      onPress={this.gotoQR}
      /> */}
  </View>
    )
  }
  gotoQR = () => {
    this.props.navigation.navigate("QRcode")
  }
  gotoDetails = () => {
    this.props.navigation.navigate('testtest');
  };

}


const styles = StyleSheet.create({
  name: {
    fontWeight:'bold', 
    marginTop:75, 
    marginLeft:30
  },
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
  button: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: { 
    marginLeft:15, 
    borderColor:'white', 
    borderRadius:10,
    shadowColor: '#000000'

  },
  
})

