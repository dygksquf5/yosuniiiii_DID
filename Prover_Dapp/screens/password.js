import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Image, FlatList } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import * as SQLite from 'expo-sqlite'
import Axios from 'axios';

const db = SQLite.openDatabase('prover_cred.db');

const insert_cred = (data) => {
  db.transaction(
    (tx) => {
    tx.executeSql(
      `insert into prover_cred (credential) values (?);`,
      [data]
    )
  }
  )
}





// delete = (id) => {
//   db.transaction(tx => {
//     tx.executeSql('DELETE FROM items WHERE id = ? ', [id],
//       (txObj, resultSet) => {
//         if (resultSet.rowsAffected > 0) {
//           let newList = this.state.data.filter(data => {
//             if (data.id === id)
//               return false
//             else
//               return true
//           })
//           this.setState({ data: newList })
//         }
//       })
//   })
// }

const deleteItem = (data) => {
  db.transaction(
    tx => {
      tx.executeSql(`delete from prover_cred where credential = ?;`, [data]);
    }, null,
  )    
}







export default class SecondScreen extends Component {


  
  
  state = {
    code: '',
    password: '',
    credential: '',
    database_information: '',
  };

  // constructor(props){
  //   super(props)
  //   this.state = {attrs: [] }
  // }
  



  // componentWillMount(){
  //   db.transaction(
  //     (tx) =>{
  //     tx.executeSql(
  //       'create table if not exists prover_cred (aid integer primary key not null, credential varchar (8000));'
  //     ),
  //     null

  //     db.transaction(
  //       (tx) => {
  //       tx.executeSql(
  //         'select * from prover_cred',
  //         null,
  //         (_, { rows: { _array } }) => this.setState({database_information: _array})
  //       )
  //     }
  //     ) 
  //   })
  // }

  // componentDidMount() {
  //   Axios.post('http://192.168.0.5:3001/api/getCred')
  //   .then(response => {this.setState({credential: response.data})})

  // }




  pinInput = React.createRef();

  _checkCode = (code) => {
    if (code != '5678') {
      this.pinInput.current.shake().then(() => this.setState({ code: '' }));
    } else {
      this.props.navigation.replace('success');
      Axios.post('http://192.168.0.5:3001/api/requestCred')
      // .then(response => {insert_cred(JSON.stringify(response.data.name))})

    }
  };

  goback = () => {
    this.props.navigation.replace('Home');
  };
  




  render() {
    const { code, password } = this.state;

    // const { credential } = this.state;

    // const prover_credential = JSON.stringify(this.state.credential)

    // insert_cred("안녕")
    // deleteItem("안녕")





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
                  {/* {JSON.stringify(this.state.database_information)} */}

                </Text>
                </View>


        {/* <Text>

                {JSON.stringify(this.state.credential.country)}

                {JSON.stringify(this.state.credential.age)}
                {JSON.stringify(this.state.credential.name)}
                {JSON.stringify(this.state.credential.address)}
                {JSON.stringify(this.state.credential.phone_number)}
                {JSON.stringify(this.state.credential.gender)}

         </Text> */}

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