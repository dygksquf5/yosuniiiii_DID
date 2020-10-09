import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Button , Image} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

export default class SecondScreen extends Component {
  state = {
    code: '',
    password: '',
  };
  pinInput = React.createRef();

  _checkCode = (code) => {
    if (code != '5678') {
      this.pinInput.current.shake().then(() => this.setState({ code: '' }));
    } else {
      this.props.navigation.replace('Details');
    }
  };

  render() {
    const { code, password } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 200 }}>
          <SmoothPinCodeInput
            ref={this.pinInput}
            value={code}
            onTextChange={(code) => this.setState({ code })}
            onFulfill={this._checkCode}
            onBackspace={this._focusePrevInput}
            password={true}
          />
        </View>
        <View style={{width: 1, height: 1, alignItems: 'center', justifyContent: 'center',
              }}>
        <Image
         source={require("../assets/images/check.gif")}
         >
        </Image>
        </View>


      </View>
    );
  }
}

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
