import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const AppButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default class HomeScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <View style={{ marginBottom: 200 }}>
          <Text style={styles.baseText}>본인 인증을 완료했어요 !</Text>

          <AppButton onPress={this.gotoHome} title={'확  인'} />
          {/* <Button onPress={this.gotoSecond} title="확인"></Button> */}
        </View>
      </View>
    );
  }
  gotoHome = () => {
    this.props.navigation.replace('Home');
  };
}

const styles = StyleSheet.create({
  baseText: {
    // color: '#707070',
    fontSize: 20,
    marginBottom: 60,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
