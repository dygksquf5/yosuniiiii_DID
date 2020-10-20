import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, 
  Text, 
  View, 
  StatusBar,  
  Image
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';




export default class Profile extends Component {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar barStyle='light-content'/>

      <Container>
          <Content>
          <View className="test_yohan" style={styles.view1} >
            <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}}> 
                <Image style={{width: 80, height: 50,}}
              source={require("../assets/images/check.gif")} style={{width:50, height:50}}>
                </Image>
              </View>

                <View style={styles.view2} >
                  <Text>You've verified very successfully</Text>
                </View> 

                <View style={styles.view3} >
                <Text>2020.10.5</Text>
            </View>  
          </View>
        <View style={styles.view1} >
            <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}}> 
            <Image style={{width: 80, height: 50,}}
              source={require("../assets/images/check.gif")} style={{width:50, height:50}}>
                </Image>
              </View>

                <View style={styles.view2} >
                  <Text>You've verified very successfully</Text>
                </View> 

                <View style={styles.view3} >
                <Text>2020.10.7</Text>
            </View>  
        </View>
        <View style={styles.view1}  >
            <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}}> 
            <Image style={{width: 80, height: 50,}}
              source={require("../assets/images/check.gif")} style={{width:50, height:50}}>
                </Image>
              </View>

                <View style={styles.view2} >
                  <Text>You've verified very successfully</Text>
                </View> 

                <View style={styles.view3} >
                <Text>2020.10.11</Text>
            </View>  
        </View>
       
         
          </Content>
        </Container>

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
    marginLeft: 5,
    flexDirection: 'row',
    shadowColor: '#A4A4A4',
    marginTop: 20,
  //   shadowOpacity: 0.8,
  //   shadowRadius: 2,
  //   shadowOffset: {
  //     height: 4,
  //     width: 1,
  //   },
  //   borderRadius: 14,
  //   backgroundColor: '#FAFAFA',
  //   borderColor: '#FAFAFA',
  },
  view2:{
    alignItems: 'center',
    justifyContent: 'center',

    width: 200,
    height: 50,
    backgroundColor: 'white',
    // shadowColor: '#A4A4A4',
    // shadowOpacity: 0.8,
    // shadowRadius: 3,
    // shadowOffset: {
    //   height: 4,
    //   width: 1,
    // },
    // borderColor: '#FAFAFA',
  },
  view3:{
    alignItems: 'flex-start',

    width: 50,
    height: 50,

    backgroundColor: 'white',
    shadowColor: '#A4A4A4',
    // shadowOpacity: 0.8,
    // shadowRadius: 3,
    // shadowOffset: {
    //   height: 4,
    //   width: 1,
    // },
    // borderColor: '#FAFAFA',

  },

  
  });
