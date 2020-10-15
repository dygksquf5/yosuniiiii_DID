import React, {  Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native';
import SvgQRCode from 'react-native-qrcode-svg';


function Simple() {
  return <SvgQRCode value="http://192.168.0.13:3001/api/proofReq/minor" size={300}/>
}


export default class mQRgenerator_minor extends Component {
  render() {
    return (
      <View style={styles.root}>
        
        <Simple />
      </View>
    );
  }

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
});
