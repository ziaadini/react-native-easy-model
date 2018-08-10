import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback, TouchableNativeFeedback
} from 'react-native';
import {Icon, Right} from 'native-base';
import EStyleSheet from "react-native-extended-stylesheet";

const Dimensions = require('Dimensions');

/*

containerStyle     => style for View wrap
headerStyle        => style for  wrap header
header             => jsx
top                => margin from top and bottom
left               => margin from left and right
closeOut           => close by click outSide default is true
 */
export class Overlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fadeShadow: false,
        };


        let top = 150;
        let left = 20;
        if (props.top) {
            top = props.top;
        }
        if (props.left) {
            left = props.left;
        }
        this.closeOut = true;
        if (this.props.closeOut === false) {
            this.closeOut = false;
        }

        EStyleSheet.build({
            $deviceWidth: Dimensions.get('window').width,
            $deviceHeight: Dimensions.get('window').height,
            $height: Dimensions.get('window').height - top * 2,
            $top: top,
            $width: Dimensions.get('window').width - left * 2,
            $left: left,
        });

        this.styles = EStyleSheet.create({
            modalContainer: {
                height: "$height",
                top: "$top",
                width: '$width',
                left: "$left",
                backgroundColor: '#fff',
                padding: 10
            },
            topContainer: {
                flexDirection: 'row'
            }
        });
    }

    componentWillReceiveProps() {
        if (this.isOpen) {
            setTimeout(() => {
                this.setState({
                    fadeShadow: true
                });
            }, 1000);
        }
    }


    setModalVisible(visible) {
        let state = {};
        state[this.props.stateName] = visible;
        state = Object.assign({}, this.props.instance.state, state);
        this.props.instance.setState(state);
    }
    isOpen(){
        return this.props.instance.state[this.props.stateName];
    }

    close() {
        this.setState({
            fadeShadow: false
        });
        setTimeout(() => {
            this.setModalVisible(false);
        }, 1);
    }

    _modalContent() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                }}
                style={[this.styles.modalContainer, this.props.containerStyle]}>
                    <View style={[this.styles.topContainer, this.props.headerStyle]}>
                        <Icon name="close"
                              onPress={() => {
                                  this.close();
                                  // this.setModalVisible(!instance.state[stateName]);
                              }}
                        />
                        <Right>
                            {this.props.header}
                        </Right>
                    </View>
                    {this.props.children}

            </TouchableOpacity>
        );
    }

    render() {
        const {instance, stateName} = this.props;

        return (
            <Modal
                // animationType="fade"
                animationType="slide"
                transparent={true}
                visible={instance.state[stateName]}
                onRequestClose={() => {
                    this.setModalVisible(!instance.state[stateName]);
                }}>

                {this.state.fadeShadow ?
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            if (this.closeOut)
                                this.close();
                        }}
                        style={{width: "100%", height: '100%', backgroundColor: "rgba(5, 5, 10, 0.7)"}}>
                        {this._modalContent()}
                    </TouchableOpacity>
                    :
                    this._modalContent()
                }
            </Modal>
        );

    }
}