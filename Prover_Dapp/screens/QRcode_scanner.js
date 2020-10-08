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





function QRcode_scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);



  const handleBarCodeScanned = ({ type, data }) => {
    async function request_Axios() {
      await Axios({
        method: 'POST',
        url: data
      })
    }

    setScanned(true);
    request_Axios()
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
      "발급 완료",
      "홈에서 발급절차를 완료 해 주세요 :)",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    )
      ) && (
          <Button title={'Tap to Scan'} onPress={() => setScanned(false)} />
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
export default QRcode_scanner;
