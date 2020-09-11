import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BarCodeScanner } from 'expo-barcode-scanner';


 //test###### // 
function gotoId () {
  navigation.navigate('Id');
}

//두번째 테스트 입니다 !!! //// 

function HomeScreen () {
  var [showIdView, setIdView] = useState(true)
  return (
// showIdView가 True 일때
    <View style={styles.container}>
      {showIdView ? 
    <View>
    <View style={styles.name}>
    <Text style={{fontWeight:'bold'}}>O O O 님 !</Text>
    <Image style={styles.id} source={require('../src/images/id.png')} />
    <View style={styles.box}>
      <TouchableOpacity onPress={() => setIdView(showIdView = false)}>
      <Text style={{marginTop: 10, marginLeft: 10}}>나의 신분증</Text>  
      <Text style={{marginTop: 150, marginLeft: 260}}>2022.04.18</Text>
      </TouchableOpacity>
    </View>
    </View>
    </View>
    :
    // showIdView가 Fasle 일때
    <TouchableOpacity onPress={() => setIdView(showIdView = true)}>
    <View style={{alignItems: 'center', marginTop: 60}}>
          <Text style={{fontWeight:'bold', fontSize: 20}} >나의 신분증 !</Text>
          </View>
          <Image 
          style={{ height: 130, width: 130, marginLeft: 250, marginTop: 30}}
          source={require('../src/images/a.jpg')} />
          <View style={{marginTop: 70, marginLeft: 30,}}>
              <Text>이름 : ______</Text>
              <Text>주민등록번호 :_______-______</Text>
              <Text>주소 : _______</Text>
              <Text>발급일자 : _________</Text>
              <Text>발급처 : ________</Text>
              <Text>유효기간 : ________</Text>
        
        </View>
        </TouchableOpacity>
    } 
    </View>
  )
  
}

export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


function QrScreen() {
  return (
  // <View style={{backgroundColor: 'white', flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>

  // </View>
  );
      }
const Tab = createBottomTabNavigator();


  

  return (
    <NavigationContainer>
      <Tab.Navigator
       screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? require('../src/images/home-black.png')
              : require('../src/images/home.png')
          } else if (route.name === 'QRcamera') {
            iconName = focused ? 
            require('../src/images/qrcamera-black.png')
            : require('../src/images/qrcamera.png')
          }

          // You can return any component that you like here!
          return <Image source={iconName} style={{width:20, height:20}} 
          resizeMode="contain"/>;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'black',
      }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="QRcamera" component={QrScreen}/>
        
      </Tab.Navigator>
    </NavigationContainer>
  );
  
}

const styles = StyleSheet.create({
  baseText: {
    alignItems: 'center',
    fontSize: 20,
    
  },
  image:{
      height: 50,
      width: 50,
      
  },
    container:{
        flex: 1, 
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white'
    },
    id:{
        width:40,
        height:40,
        marginTop:10,
    },
    Home:{
      backgroundColor:'white'
    },
    name:{
      marginTop: 50,
      marginLeft:30,
      
    },
    box: {
      marginTop: 30,
      borderWidth:1,
      width: 350,
      height: 200,
       
    }
})
