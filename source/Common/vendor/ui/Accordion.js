import React, {Component} from 'react';
import {
    StyleSheet, Text, View, TouchableHighlight, Animated, Image
}
    from 'react-native';
import {Icon} from 'native-base';
import {Icons} from '../../../Common/config/main';
import {accordionCss} from '../../../assets/css/style.css';
import {commonCss} from '../../../assets/css/main.css';
import {Touchable} from "./Touchable";

export default class Accordion extends Component {
    constructor(props) {
        super(props);
        this.icons = {
            'open': 'ios-arrow-down',
            'close': 'ios-arrow-up'
        };

        this.state = {expanded: false};
    }

    toggle(id, level) {
        //زمانی که ایتمی انتخاب میشود
        //ابتدا سطح بررسی میشود اگر سطح ۱ بود
        //category_id در  state   ست میشود
        // و در صورتی که سطح۲ باشد
        //در child_id  ست میشود
        var instance = this.props.instance;
        if (level === 1) {
            if (instance.state.category_id !== id) {
                instance.setState({category_id: id})
            } else {
                instance.setState({category_id: ''})
            }

        } else {
            if (instance.state.child_id !== id) {
                instance.setState({
                    ...this.state,
                    child_id: id
                });
            } else {
                instance.setState({
                    ...this.state,
                    child_id: ''
                })
            }

        }
    }

    render() {
        let instance = this.props.instance;
        //set open icon accordion to default
        let icon = this.icons['open'];

        //set icon close for select accordion
        if (instance.state.category_id === this.props.id || instance.state.child_id === this.props.id) {
            icon = this.icons['close'];
        }
        return (
            <View style={accordionCss.border} key={this.props.index}>
                <View
                    key={this.props.index}
                    style={accordionCss.container}>

                    <Touchable
                        key={this.props.index}
                        onPress={() => {
                            this.toggle(this.props.id, this.props.level)
                        }}
                        underlayColor="#f1f1f1"
                        style={accordionCss.titleContainer}>

                        {/*برای ایتم های سطح ۲ هم تصویر و هم عنوان نمایش میدهد*/}
                        <View style={accordionCss.viewTitle}>
                            {this.props.level === 2 ?
                                <View style={accordionCss.viewLevele2}>
                                    <View style={accordionCss.viewImg}>
                                        <Image source={{uri: this.props.src}} style={accordionCss.img}/>
                                    </View>
                                    <View style={accordionCss.viewTitleLevele2}>
                                        <Text
                                            style={[commonCss.textBold, commonCss.h4, accordionCss.text]}>{this.props.name}</Text>
                                    </View>

                                </View> :
                                //برای ایتم های سطح ۱ فقط عنوان را نمایش میدهد
                                <View>
                                    <Text
                                        style={[commonCss.textBold, commonCss.h4, accordionCss.text]}>{this.props.name}</Text>
                                </View>}
                        </View>
                        <Icon
                            style={accordionCss.FAIcon}
                            name={icon}
                            type={Icons.card.type}
                        />

                    </Touchable>


                    {(instance.state.category_id === this.props.id || instance.state.child_id === this.props.id) && (
                        <View style={accordionCss.body}>
                            {this.props.children}
                        </View>)}

                </View>
            </View>
        );
    }
}

