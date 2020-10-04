import React from 'react';
import {StyleSheet, Text, View,ImageBackground} from "react-native";
import { render } from 'react-dom';

export default class Loading extends React.Component{

    state={
        isLoading : true
      };
      componentDidMount= async() => {  
        // 1,000가 1초
        setTimeout(() => {this.setState({isLoading: false})},4000);
      }
    
    render(){
            if(this.state.isLoading){
            return <View style={{width:"100%",height:"100%",backgroundColor:'white'}}> 
            <ImageBackground
                source={require("../assets/images/settings.gif")}    
                style={{width:"67%",height:"50%",marginTop:"60%", marginLeft:"25%", alignItems: 'center',
                justifyContent: 'center',
            }}>
            </ImageBackground>
            </View>
        } else {
           return this.props.navigation.replace('password')
        }

    }
}

