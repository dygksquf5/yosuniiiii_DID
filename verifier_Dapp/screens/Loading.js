import React from 'react';
import {ImageBackground} from "react-native";
import {render} from 'react-dom';

export default class Loading extends React.Component{
    render(){
        return(
            <ImageBackground
                source={require("../assets/images/splash.png")}
                style={{width:"100%", height:"100%"}}>
            </ImageBackground>
        );
    }
}