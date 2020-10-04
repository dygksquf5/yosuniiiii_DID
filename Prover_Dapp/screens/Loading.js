import React from 'react';
import {StyleSheet, Text, View,ImageBackground} from "react-native";
import { render } from 'react-dom';

export default class Loading extends React.Component{
    render(){
        return (
            <ImageBackground
                source={require("../assets/images/first_page.png")}    
                style={{width:"130%",height:"90%", marginTop:"20%",backgroundColor:'white', alignItems: 'center',
                justifyContent: 'center',
            }}>
            </ImageBackground>
        );
    }
}
