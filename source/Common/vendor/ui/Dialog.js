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
                        <Text style={commonCss.text}>
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
                                حذف
                            </Text>
                        </Button>
                        <Button style={[commonCss.btnGrayLight,commonCss.btn,style.btnWidth]}
                        onPress={()=>{
                            this.close();
                        }}
                        >
                            <Text style={commonCss.text}>
                                انصراف
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
    },

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
                width={"60%"}
                height={120}
            >
                <View style={LoadingStyle.container}>
                        <Spinner color="blue"/>
                </View>
            </DialogComponent>
        )
    }
}