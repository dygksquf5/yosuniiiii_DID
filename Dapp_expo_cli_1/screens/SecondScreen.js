import Axios from 'axios';
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

export default class SecondScreen extends Component {
  state = {
    code: '',
    password: '',
  };
  pinInput = React.createRef();

  _checkCode = (code) => {
   
    if (code != '5678') {
      this.pinInput.current.shake().then(() => this.setState({code: ''}));
     } else {
      this.props.navigation.navigate('Home');
      Axios.post("http://192.168.0.5:3001/api/log")
      .then( response => console.log(response.data))
    }
    }
    
  render() {
    const {code, password} = this.state;
    return (
      <View style={styles.container}>
        <View style={{marginBottom: 200}}>
        <SmoothPinCodeInput
          ref={this.pinInput}
          value={code}
          onTextChange={(code) => this.setState({code})}
          onFulfill={this._checkCode}
          onBackspace={this._focusePrevInput}
          password={true}
        />
        </View>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    alignItems: 'center',
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
});