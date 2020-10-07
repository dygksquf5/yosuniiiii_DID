import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Image } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import * as SQLite from 'expo-sqlite';
import Axios from 'axios';

const DB = SQLite.openDatabase('prover_cred.db');

function insert_cred(data){
  DB.transaction(tx => {
    tx.executeSql(
      `insert into prover_cred (credential) values (?);`,
      [data]
    );
  })
}


const delete_cred = (data) => {
  DB.transaction(
    tx => {
      tx.executeSql(`delete from prover_cred where aid = ?;`, [data]);
    }, null,
  )    
}


export default class SecondScreen extends Component {
  state = {
    code: '',
    password: '',
    credential: [],
  };


  componentWillMount(){
    DB.transaction(tx =>{
      tx.executeSql(
        'create table if not exists prover_cred (aid INTEGER PRIMARY KEY NOT NULL, credential VARCHAR (8000), date TEXT NOT NULL);'
      ),
      null,

      DB.transaction(tx => {
        tx.executeSql(
          'select * from prover_cred',
          null,
          (_, { rows: { _array } }) => this.setState({credential: _array})
        )
      }
      ) 
    })
  }

  componentDidMount() {
    Axios.post('http://192.168.0.5:3001/api/getCred')
    .then(response => {this.setState({json: JSON.stringify(response.data)})})

  }




  pinInput = React.createRef();

  _checkCode = (code) => {
    if (code != '5678') {
      this.pinInput.current.shake().then(() => this.setState({ code: '' }));
    } else {
      this.props.navigation.replace('success');
      Axios.post('http://192.168.0.5:3001/api/getCred')
      .then(response => {this.setState({credential: response.data})})
    }
  };

  goback = () => {
    this.props.navigation.replace('Home');
  };
  

  
  // onPress={() => requestCred()}
  

  render() {
    const { code, password } = this.state;

    const { credential } = this.state;

    const prover_credential = this.state.credential.map((value) =>
    JSON.stringify(value.data.title))

    // 디비 넣기! // 

    // insert_cred(credential);

    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 200 }}>
        <Button title={'back'} onPress={this.goback} color="black" />            
          <SmoothPinCodeInput
            ref={this.pinInput}
            value={code}
            onTextChange={(code) => this.setState({ code })}
            onFulfill={this._checkCode}
            onBackspace={this._focusePrevInput}
            password={true}
          />
        </View>
        <View style={styles.container}>
        {/* {details_2.map((item, index) =>
        <Text key={index}>{item.age}</Text>)} */}
        <Text>
        {this.state.json}

        then !! 
        {typeof(this.state.json)}
         {/* { details_2} */}
         
         
         </Text>
        </View>


        <View style={{width: 1, height: 1, alignItems: 'center', justifyContent: 'center',
              }}>
        <Image
         source={require("../assets/images/password.png")}
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
