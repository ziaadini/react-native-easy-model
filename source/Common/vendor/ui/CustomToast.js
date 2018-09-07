import React, {Component} from 'react';
import Toast from "react-native-easy-toast";
import {commonCss} from "../../../assets/css/main.css";

export class CustomToast extends Component {
    constructor(props) {
        super(props);
    }

    show(text, duration = 1000) {
        this.refs.toast.show(text, duration);
    }

    render() {
        return (
            <Toast ref='toast'
                   style={{
                       // width:'100%',justifyContent:'center',alignItems:'center',
                       backgroundColor:'rgba(66, 66, 66, 0.9)',
                       borderRadius:2,
                   }}

                   textStyle={[commonCss.text,commonCss.colorWhite]}
            />
        )
    }
}