import React, {Component} from 'react';
import Collapsible from 'react-native-collapsible';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import {Icons} from "../../../Common/config/main";
import {Icon} from "native-base";
import Anime from 'react-native-anime';
import {commonCss} from "../../../assets/css/main.css";
import {Touchable} from "./Touchable";

const Style = StyleSheet.create({

    parentContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
    },
    icon: {
        fontSize: 19,
    },
    iconContainer: {
        width: 12,
    }
});

/*
    title       =>title
    children    => collapsed items
    style       => style for title
    show        => by default is true : if show is false return anything
    duration    => duration for header icon animation
 */
export class SlideDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };
        this.parentStyle = pushToStyle(Style.parentContainer, this.props.style);
        this.duration=250;
        if(this.props.duration){
            this.duration=this.props.duration;
        }
    }

    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        }, () => {
            if (this.state.collapsed === true) {
                this.box.reset();
            } else {
                this.box.rotate(180, {duration: this.duration}).start();
            }
        });
    }

    render() {
        if(this.props.show!==undefined&&!this.props.show){
            return (false);
        }
        return (
            <View>
                <Touchable onPress={() => {
                    this.toggle();
                }}
                                  style={this.parentStyle}
                >
                    <Text style={commonCss.text}>{this.props.title}</Text>
                    <View style={Style.iconContainer}>
                        <Anime.View ref={ref => this.box = ref}>
                            <Icon name={Icons.arrowDown.name} type={Icons.arrowDown.type}
                                  style={Style.icon}
                            />
                        </Anime.View>
                    </View>
                </Touchable>
                <Collapsible collapsed={this.state.collapsed}>
                    {this.props.children}
                </Collapsible>
            </View>
        )
    }
}

const pushToStyle = (prevStyle, newStyle) => {

    if (!Array.isArray(prevStyle)) {
        prevStyle = [prevStyle];
    }
    if (Array.isArray(newStyle)) {
        Array.prototype.push.apply(prevStyle, newStyle);
    } else {
        prevStyle.push(newStyle);
    }
    return prevStyle;
};