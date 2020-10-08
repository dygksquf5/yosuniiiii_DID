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

    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={[StyleSheet.absoluteFill, styles.container]}
    >
      {scanned && (Alert.alert(
      "스캔 완료",
      (JSON.stringify(verifying),
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    ))
      )
        && (
          <Button title={'Tap to Scan'} onPress={() => setScanned(false)} />
          // <Button title={'Tap to Scan'} onPress={this.gotoDetails} />
        )}

      <View style={styles.layerTop} />
      <View style={styles.layerCenter}>
        <View style={styles.layerLeft} />
        <View style={styles.focused} />
        <View style={styles.layerRight} />
      </View>
      <View style={styles.layerBottom} />
    </BarCodeScanner>
    
    
  );
}


const opacity = 'rgba(0, 0, 0, .4)';
const styles = StyleSheet.create({
container: {
  flex: 8,
  flexDirection: 'column'
},
layerTop: {
  flex: 3.5,
  backgroundColor: opacity,

},
layerCenter: {
  flex: 8,
  flexDirection: 'row'
},
layerLeft: {
  flex: 0.5,
  backgroundColor: opacity
},
focused: {
  flex: 4
},
layerRight: {
  flex: 0.5,
  backgroundColor: opacity
},
layerBottom: {
  flex: 3.5,
  backgroundColor: opacity
},
});
export default QRcode;
