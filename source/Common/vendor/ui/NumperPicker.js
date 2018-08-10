import React, {Component} from 'react';
import {
    View,
    Text, StyleSheet,
    TouchableOpacity
} from 'react-native';
import {Icon} from "native-base";
import {Icons} from "../../config/main";

const Styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: "space-around",
        borderWidth: 0.5,
        borderColor: 'gray',
        width: '100%',
    },
    split: {
        borderLeftWidth: 0.5, borderColor: 'gray', height: '100%'
    },
    icon: {
        fontSize: 18,
    },
    allItem: {
        padding: 5,
    }
});

/*
    value => <Text>your value</Text>
    onPlus => when plus pressed
    onMinus => when minus pressed
 */

export class NumperPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={Styles.container}>

                <TouchableOpacity style={Styles.allItem}
                                  onPress={this.props.onPlus}
                >
                    <Icon style={Styles.icon} name={Icons.Plus.name} type={Icons.Plus.type}/>
                </TouchableOpacity>

                <View style={Styles.split}></View>
                <View style={[Styles.center, Styles.allItem]}>
                    {this.props.value}
                </View>
                <View style={Styles.split}></View>

                <TouchableOpacity style={Styles.allItem}
                                  onPress={this.props.onMinus}
                >
                    <Icon style={Styles.icon} name={Icons.Minus.name} type={Icons.Minus.type}/>
                </TouchableOpacity>

            </View>
        )
    }
}