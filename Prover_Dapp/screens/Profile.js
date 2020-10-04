import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, 
  Text, 
  View, 
  StatusBar,  
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { render } from 'react-dom';
import Axios from 'axios';
import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';





async function getCred(){
  await Axios.post('http://192.168.0.5:3001/api/getCred')
  .then(response => setcredential(response.data))

}




export default class Profile extends Component {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar barStyle='light-content' />
        <Text style={styles.title}>여기는 디 테 일2222 !!</Text>
        <Button
          title='testtesttest'
          color='white'
          backgroundColor={colors.pink}
          onPress={() => getCred()}
        />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
      </View>

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
  addButton2: {
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
    borderWidth: 1,
    height: 65,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 130,
    right: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },

});
