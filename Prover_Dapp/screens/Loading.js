import React from 'react';
import {StyleSheet, Text, View,ImageBackground} from "react-native";
import { render } from 'react-dom';

export default class Loading extends React.Component{
    render(){
        return (
            <ImageBackground
                source={require("../assets/images/cup.jpeg")}    
                style={{width:"100%",height:"100%"}}>
            </ImageBackground>
        );
    }
}
