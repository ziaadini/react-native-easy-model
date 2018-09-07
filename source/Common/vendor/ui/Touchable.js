import React, {Component} from 'react';
import {TouchableOpacity} from "react-native";

export class Touchable extends Component {

    render() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                {...this.props}
            >
                {this.props.children}
            </TouchableOpacity>
        )
    }
}