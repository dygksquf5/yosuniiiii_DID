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
  const [verifying, setverifying] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);



  const handleBarCodeScanned = ({ type, data }) => {
    async function testtest() {
      await Axios({
        method: 'POST',
        url: "http://192.168.0.5:3002/api/getschemaId",
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          data: data,
        },
      }).then((res) => {
        setverifying(res.data);
      });
    }

    setScanned(true);
    testtest()
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
      {scanned && (Alert.alert(JSON.stringify(verifying))
      )&& (
        <Button title={'Tap to Scan'} onPress={() => setScanned(false)} />
        // <Button title={'Tap to Scan'} onPress={this.gotoDetails} />

      )}
    </View>

    // </View>
  );
  
}

export default QRcode;
