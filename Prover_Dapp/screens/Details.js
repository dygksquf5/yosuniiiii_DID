import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, 
  Text,
  View,
  StatusBar,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
 } from 'react-native';
import Button from '../src/components/Button';
import { colors } from '../src/theme';
import { render } from 'react-dom';
import { State } from 'react-native-gesture-handler';
import FontIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';




// let testtest = {
//   "11dakdj;l : " : "이나어리나ㅓ아이",
//   "이름" : "김요한",
//   "나이" : "20",
//   "주소" : "머나먼 세종시",
//   "좋아하는 음식" : "이거 신분증이잖아 ...."
// }; 

let name = "김요한"
let age = "21"
let address = "머나먼 세종시"
let gender = " 남자 "


export default class Details extends Component {
  render() {
    return (
      <View style={styles.root}>
        <Container>
          <Content>
          <TouchableOpacity >
            <Card style={styles.card}>
              <View style={styles.information}>
                <Text > 이름 : {name}</Text>
                <Text > 나이 : {age}</Text>
                <Text > 주소 : {address}</Text>
                <Text > 성별 : {gender}</Text>

              </View>
            </Card>
            </TouchableOpacity>
          </Content>
        </Container>



        <StatusBar barStyle='light-content' />
        <Text style={styles.title}>인증 QR코드 생성하기</Text>
        {/* <Button
          title='Go Back'
          color='white'
          backgroundColor={colors.pink}
          onPress={this.QRgenerator}
        /> */}
        <View style={styles.addButton}>
        <TouchableHighlight underlayColor='#ff7043' onPress={this.QRgenerator}>
          <FontIcon name='qrcode-scan' color='#231d54' size={35} />
        </TouchableHighlight>
        </View>

      </View>
    );
  }
  QRgenerator = () => {
    this.props.navigation.replace('QRgenerator');
  };
}

// const { from } = navigation.state.params

// Details.propTypes = {
//   navigation: PropTypes.shape({
//     state: PropTypes.shape({
//       params: PropTypes.shape({
//         from: PropTypes.string,
//       }),
//     }),
//     goBack: PropTypes.func,
//   }),
// }

// Details.defaultProps = {
//   navigation: {
//     state: {
//       params: {
//         from: '',
//       },
//     },
//     goBack: () => null,
//   },
// }

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
  addButton: {
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
    borderWidth: 1,
    height: 75,
    width: 75,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    right: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  card: {
    height: 300,
    width: 300,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 40,
    shadowColor: '#A4A4A4',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
  },
  information: {
    marginTop: 30,
    marginLeft: 30,
    fontSize: 10,
    fontWeight: 'bold',


  }
});
