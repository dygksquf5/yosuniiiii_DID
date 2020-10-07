import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Image, FlatList } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import * as SQLite from 'expo-sqlite'
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



// const select_cred = (setUserFunc) => {
//   DB.transaction(
//     tx => {
//       tx.executeSql(
//         'select * from prover_cred',
//         [],
//         (_, { rows: { _array } }) => {
//           setUserFunc(_array)
//         }
//       );
//     },
//     (t, error) => { console.log("db error load users"); console.log(error) },
//     (_t, _success) => { console.log("loaded users")}
//   );
// }

// const select_cred = () => {
//   DB.transaction(tx => {
//     tx.executeSql(
//       `SELECT * FROM prover_cred`,
//       null,
//       (_, { rows: { _array } }) => this.setState({testtest: _array})
//     );
//   })
// }


export default class SecondScreen extends Component {

  
  state = {
    code: '',
    password: '',
    credential: '',
    testtest: '',
  };

  // constructor(props){
  //   super(props)
  //   this.state = {attrs: [] }
  // }
  



  componentWillMount(){
    DB.transaction(tx =>{
      tx.executeSql(
        'create table if not exists prover_cred (aid integer primary key not null, credential varchar (8000));'
      ),
      null

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
    .then(response => {this.setState({credential: response.data.attrs})})

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
  


  render() {
    const { code, password } = this.state;

    // const { credential } = this.state;

    // const prover_credential = JSON.stringify(this.state.credential)

    // insert_cred(prover_credential);

    const listSeparator = () => {
      return (
        <View
          style={{
            height: 5,
            width: "50%",
            backgroundColor: "#fff",
            marginLeft: "10%"
          }}
        />
      );
    };




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


                
                <View>
                <Text>
                  {JSON.stringify(this.state.credential)}

                </Text>
                </View>


        {/* <Text>

                {JSON.stringify(this.state.credential.country)}

                {JSON.stringify(this.state.credential.age)}
                {JSON.stringify(this.state.credential.name)}
                {JSON.stringify(this.state.credential.address)}
                {JSON.stringify(this.state.credential.phone_number)}
                {JSON.stringify(this.state.credential.gender)}

         </Text>
 */}
        {/* <View style={{width: 1, height: 1, alignItems: 'center', justifyContent: 'center',
              }}>
        <Image
         source={require("../assets/images/password.png")}
         >
        </Image>
        </View> */}

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
