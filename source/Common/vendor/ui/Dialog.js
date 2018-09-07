import React, {Component} from 'react';
import {DialogComponent, SlideAnimation} from 'react-native-dialog-component';
import {
    View,
    Text, StyleSheet, Image,
} from 'react-native';
import {Button, Spinner} from "native-base";
import {commonCss} from "../../../assets/css/main.css";


const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    textContainer: {
        padding: 15,
        paddingTop:50,
        paddingBottom:50,
    },
    btnContainer:{
        flex:1,
        flexDirection:'row-reverse',
        justifyContent:'space-around'
    },
    btnWidth:{
        width:'45%'
    }
});

/*
    onOk           => when user press ok
    okLabel        =>label of ok button
    cancelLabel    =>label of cancel button
    message        => your message
    for open dialog you should call show function from ref

 */
export class DeleteDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    show() {
        this.dialogComponent.show();
    }
    close(){
        this.dialogComponent.dismiss();
    }


    render() {
        return (
            <DialogComponent
                ref={(dialogComponent) => {
                    this.dialogComponent = dialogComponent;
                }}
                dialogAnimation={new SlideAnimation({slideFrom: 'bottom'})}
                width={"90%"}
                height={180}
            >
                <View style={style.container}>
                    <View style={style.textContainer}>
                        <Text style={[commonCss.text,{textAlign:'right'}]}>
                            {this.props.message ? this.props.message : "آیا از حذف این مورد اطمینان دارید؟"}
                        </Text>
                    </View>
                    <View style={style.btnContainer}>
                        <Button style={[
                            commonCss.btnDanger,commonCss.btn,
                            style.btnWidth,commonCss.danger
                        ]}
                        onPress={()=>{
                            this.close();
                            this.props.onOk();
                        }}
                        >
                            <Text style={[commonCss.text,commonCss.colorWhite]}>
                                {this.props.okLabel?this.props.okLabel:'حذف'}
                            </Text>
                        </Button>
                        <Button style={[commonCss.btnGrayLight,commonCss.btn,style.btnWidth]}
                        onPress={()=>{
                            this.close();
                        }}
                        >
                            <Text style={commonCss.text}>
                                {this.props.cancelLabel?this.props.cancelLabel:'انصراف'}
                            </Text>
                        </Button>
                    </View>
                </View>
            </DialogComponent>
        )
    }
}


const LoadingStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        paddingTop:30,
    },

    image:{
        width:150,height:50
    }
});

export class LoadingDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    show() {
        this.dialogComponent.show();
    }
    close(){
        this.dialogComponent.dismiss();
    }


    render() {
        return (
            <DialogComponent
                ref={(dialogComponent) => {
                    this.dialogComponent = dialogComponent;
                }}
                dismissOnTouchOutside={false}
                animationDuration={12}
                width={"80%"}
                height={150}
            >
                <View style={LoadingStyle.container}>
                    <Image source={require('../../../assets/Images/mobit.png')}
                        style={LoadingStyle.image}
                           resizeMode='cover'
                    />
                    <Spinner color="blue"/>
                </View>
            </DialogComponent>
        )
    }
}