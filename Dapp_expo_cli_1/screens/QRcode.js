import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Axios from 'axios';
import 'url-search-params-polyfill';

function QRcode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // state = {
  //   type: {type},
  //   data: {data},
  // };
  // updateState = () => {
  //   this.setState({
  //     type: this.state,
  //     data: this.state,
  //   });
  // }
  // gotoDetails = () => {
  //   this.props.navigation.navigate('Details');
  // };

  const handleBarCodeScanned = ({ type, data }) => {
    async function testtest() {
      // var params = new URLSearchParams();
      // await params.append('data',JSON.stringify(data));

      await Axios({
        method: 'POST',
        url: 'http://192.168.0.5:3001/api/schema',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          data: data,
        },
      }).then((res) => {
        console.log(res.data);
      });
    }

    setScanned(true);
    // alert('Bar code with type'+JSON.stringify({type})+ 'and data'+JSON.stringify({data})+ 'has been scanned!')
    Alert.alert(type, data, [
      { Text: 'OK!!!!!!!!!!', onPress: () => testtest() },
    ]);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    // <View style={{backgroundColor: 'white', flex:1, justifyContent: 'center', alignItems: 'center'}}>
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={'Tap to Scan'} onPress={() => setScanned(false)} />
        // <Button title={'Tap to Scan'} onPress={this.gotoDetails} />

      )}
    </View>

    // </View>
  );
  
}

export default QRcode;
