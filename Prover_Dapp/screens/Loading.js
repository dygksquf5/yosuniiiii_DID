import React from 'react';
import {ImageBackground} from "react-native";

export default class Loading extends React.Component{
    render(){
        return (
            <ImageBackground
                source={require("../assets/images/loading.jpg")}    
                style={{width:"100%",height:"100%",backgroundColor:'white', alignItems: 'center',
                justifyContent: 'center',
            }}>
            </ImageBackground>
        );
    }
}
