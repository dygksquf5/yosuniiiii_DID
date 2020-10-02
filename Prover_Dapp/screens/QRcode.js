import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Dimensions,
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


  const handleBarCodeScanned = ({ type, data }) => {
    async function testtest() {
      // var params = new URLSearchParams();
      // await params.append('data',JSON.stringify(data));
      await Axios({
        method: 'POST',
        url: data,
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

  // return (
  //   // <View style={{backgroundColor: 'white', flex:1, justifyContent: 'center', alignItems: 'center'}}>
  //   <View
  //     style={{
  //       flex: 1,
  //       flexDirection: 'column',
  //       justifyContent: 'flex-end',

  //     }}
  //   >
  //     <BarCodeScanner
  //       onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
  //       style={StyleSheet.absoluteFillObject}
  //     />






  //     {scanned && (
  //       <Button title={'Tap to Scan'} onPress={() => setScanned(false)} />
  //       // <Button title={'Tap to Scan'} onPress={this.gotoDetails} />

  //     )}
  //   </View>

  //   // </View>
  // );
  const { width } = Dimensions.get('window');

    return (
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFill, styles.container]}
      >
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
