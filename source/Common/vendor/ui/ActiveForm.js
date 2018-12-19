import React from 'react';
import {View, Text, TextInput, StyleSheet, Switch, Platform, I18nManager,} from 'react-native';
import {Button, CheckBox, Icon, Radio, Spinner, Label, Picker} from "native-base";
import {Icons} from "../../config/main";
import {empty, mapObject, number_format} from '../Helper';

// import {commonCss} from '../../../assets/css/main.css';


import MobitPicker from './MobitPicker';
import {Touchable} from "./Touchable";

const style = StyleSheet.create({

    txtInput: {
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'right'
    }
});

export class TxtInput extends React.Component {
    constructor(props) {
        super(props);
    }

    changeText(val) {
        const {instance, name} = this.props;
        let obj = [];
        obj['params'] = instance.state.params;
        obj['params'][name] = val;
        instance.setState(obj);
    }

    render() {
        const {instance, name} = this.props;

        return (
            <View>
                <TextInput
                    onChangeText={(val) => {
                        this.changeText(val)
                    }}
                    value={instance.state.params[name]}
                    {...this.props}
                    style={[style.txtInput, {...this.props.style}]}
                />
                {handleError(instance, this.props)}
            </View>
        );

    }
}


const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        // alignItems: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
    },
    inputStyle: {
        flex: 1,
        textAlign: 'right'
    },
    icon: {
        color: '#bdbdbd',
        marginRight: 10,
        marginLeft: 10,
    },
    errorContainer: {
        flexDirection: "row", justifyContent: 'flex-end', alignItems: 'center'
    },
    errorText: {
        color: 'red',
        marginRight: 5,
        marginTop: 5,
        fontFamily: 'IRANSansMobile'
    },
    errorIcon: {
        fontSize: 13, color: 'red', marginRight: 5,
    }
});

/*
 style      => in container View item
 inputStyle => in input
 iconStyle  => in icon
 iconName   => name of icon
 iconType   => type of icon
 other props=> in input
 name       => name you want set to sate.params
 instance   => instance of component you want change this state

 you should define inside instance component :
 this.state={
 params:{},
 error: {}
 };

 showError   =>by default is true
 red         => if true -> even showError is false border is red.

 numberFormat  =>if it's true show number_format in value
 validationAtt => if set use this attribute instead of name
 */

export class TextBordered extends React.Component {
    constructor(props) {
        super(props);
    }

    changeText(val) {
        const {instance, name} = this.props;
        let obj = [];
        obj['params'] = instance.state.params;
        obj['params'][name] = val;
        instance.setState(Object.assign({}, instance.state, obj));
    }

    render() {
        const {instance, name} = this.props;
        let b_color = borderColor(instance, this.props);
        return (
            <View style={this.props.style ? this.props.style : {}}>
                <View style={[styles.container, {borderColor: b_color,}]}>
                    <TextInput
                        onChangeText={(val) => {
                            this.changeText(val)
                        }}
                        value={this.props.numberFormat === true ? number_format(instance.state.params[name] + "") : instance.state.params[name]}
                        {...this.props}
                        ref={this.props.refInner}
                        style={[styles.inputStyle, this.props.inputStyle, {
                            textAlignVertical: "top",
                        }]}
                        underlineColorAndroid="transparent"
                    />
                    {this.props.iconName ?
                        <View style={{flexDirection: 'column', justifyContent: 'flex-start',}}>
                            <Icon
                                name={this.props.iconName}
                                type={this.props.iconType ? this.props.iconType : "Ionicons"}
                                style={[styles.icon, {...this.props.iconStyle}, {marginTop: 8}]}
                            />
                        </View>
                        : false
                    }
                </View>
                {handleError(instance, this.props)}
            </View>
        );

    }
}

const activePickerStyle = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
    },
    itemStyle: {
        flexDirection: 'row-reverse',
        height: 100,
    },
    itemTextStyle: {
        textAlign: 'right',
        flexDirection: 'row-reverse'
    },
    textStyle: {
        textAlign: 'right'
    }
});

/*

 placeholder => placeholder of picker
 values  =>  که یک ابجکت از داده ها برای نمایش در پیکر میباشند و باید بصورت
 {{id:name,id1:name2,...}} باشد
 onValueChange => متدی برای تغییر ایتم پیکر

 itemStyle  =>    style for itemStyle
 itemTextStyle => style for itemTextStyle
 textStyle  =>    style for textStyle
 style      => in container View item

 name       => name you want set to sate.params
 instance   => instance of component you want change this state

 you should define inside instance component :
 this.state={
 params:{},
 error: {}
 };

 */
export class ActivePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            placeholder: this.props.placeholder,
        };
    }

    changeValue(val) {
        const {instance, name} = this.props;
        let obj = [];
        obj['params'] = instance.state.params;
        obj['params'][name] = val;
        instance.setState(Object.assign({}, instance.state, obj));
    }

    selectOS() {
        var instance = this.props.instance;
        if (Platform.OS === 'ios') {
            return (
                <Picker
                    style={[{flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center'}]}
                    mode="dropdown"
                    iosIcon={<Icon name="ios-arrow-down-outline"/>}
                    itemStyle={[activePickerStyle.itemStyle, this.props.itemStyle]}
                    itemTextStyle={[activePickerStyle.itemTextStyle, this.props.itemTextStyle]}
                    textStyle={[activePickerStyle.textStyle, this.props.textStyle]}
                    placeholder={this.props.placeholder}
                    placeholderStyle={{color: "#bfc6ea"}}
                    placeholderIconColor="#007aff"
                    selectedValue={instance.state.params[this.props.name] + ''}
                    onValueChange={this.changeValue.bind(this)}
                    {...this.props}
                >
                    {mapObject(this.props.values, (item, key) => {
                        return (<Picker.Item key={key} label={item} value={key}/>);
                    })}
                </Picker>
            )
        } else {
            return (
                <Picker
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'flex-end', alignItems: 'flex-end',
                    }}
                    mode="dropdown"
                    placeholderStyle={{color: "#bfc6ea"}}
                    placeholderIconColor="#007aff"
                    selectedValue={instance.state.params[this.props.name] + ''}
                    onValueChange={this.changeValue.bind(this)}
                    {...this.props}
                >
                    <Picker.Item
                        style={{flexDirection: 'row-reverse', textAlign: 'right', backgroundColor: '#0d0'}}
                        label={this.props.placeholder} value="-1"/>


                    {mapObject(this.props.values, (item, key) => {
                        return (
                            <Picker.Item key={key}
                                         label={item}
                                         value={key}/>);
                    })}
                </Picker>
            )
        }
    }

    render() {
        const {instance, name} = this.props;
        let b_color = borderColor(instance, this.props);
        return (
            <View style={this.props.style ? this.props.style : {}}>
                <View style={[activePickerStyle.pickerContainer, {borderColor: b_color}]}>
                    {this.selectOS()}
                </View>
                {handleError(instance, this.props)}
            </View>
        );

    }
}

const areaStyles = StyleSheet.create({

    container: {
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: 'gray',
    },
    inputStyle: {
        flex: 1,
        // alignItems: 'flex-start',
        flexDirection: 'column',
        textAlign: 'right'
    },
    icon: {
        color: '#bdbdbd',
        marginRight: 10,
        marginLeft: 10,
    },
    errorContainer: {
        flexDirection: "row", justifyContent: 'flex-end', alignItems: 'center'
    },
    errorText: {
        color: 'red',
        marginRight: 5,
        marginTop: 5
    },
    errorIcon: {
        fontSize: 13, color: 'red', marginRight: 5,
    }
});

/*
 name       => name you want set to sate.params
 instance   => instance of component you want change this state

 you should define inside instance component :
 this.state={
 params:{},
 error: {}
 };

 data => this is data set you want show and should be like this
 [{label:your label , value:your value},...]
 placeholder => placeholder
 onSelect => when item selected pass value to this method you my want override this method like this :
 onSelect={
 (value)=>{
 console.log(value);
 }
 }
 top =>  use in overlay
 left => use in overlay
 mode => mode of show overlay can get three value {'center' ,'down' , 'full'}
 loading => display spinner front of default value
 itemTextStyle => style for items in picker
 defaultTextStyle => style for defaultTextValue
 searchLen => if mode equal full => number of character to search in list
 onEmpty => در صورتی که این پراپس override
 شود زمانی که داده های پیکر خالی است محتوای این پراپس نمایش داده میشود
 icon =>  در صورتی که فرستاده شود مقابل هر ایتم در پیکر ایکن ارسالی نمایش داده می شود
 itemIconName =>name of icon that display in item picker
 itemIconType => tyle of icon that display in item picker
 itemIconSyle => style of icon that display in item picker

 iconName => name of icon display in picker
 iconType => type of icon display in picker
 iconStyle => style of icon display in picker

 */

const activePicker2Style = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    loadingView: {
        flexDirection: 'row-reverse',
        height: '50%'
    },
    spinner: {
        marginTop: -50,
        //marginBottom: 10,
        marginLeft: 10,
        width: '10%'
    },
    border: {
        //  borderColor: 'gray',
        borderWidth: 1
    },
    viewSpinner:{
        flexDirection:'column',
        justifyContent:'center'
    }

});

export class ActivePicker2 extends React.Component {
    constructor(props) {
        super(props);
    }

    changeValue(val) {
        const {instance, name} = this.props;
        let obj = [];
        obj['params'] = instance.state.params;
        obj['params'][name] = val.value;
        instance.setState(Object.assign({}, instance.state, obj));
    }

    defaultValue() {
        if (this.props.instance.state.params[this.props.name] !== undefined) {
            let defaultVale = this.props.data
                .filter((e) => e.value === this.props.instance.state.params[this.props.name]);
            if (defaultVale[0]) {
                return defaultVale[0];
            }
            return false;
        }
        return false;
    }

    render() {
        var instance = this.props.instance;
        let b_color = borderColor(instance, this.props);

        return (
            <View>
                <View
                    style={[{
                        paddingRight: 15,
                        width: '100%'
                    }, activePicker2Style.container, activePicker2Style.border, {borderColor: b_color}]}>
                    <View
                        style={activePicker2Style.loadingView}>
                        <View style={{width: '100%'}}>
                            {this.props.onEmpty !== undefined ?
                                <MobitPicker
                                    defaultValue={this.defaultValue()}
                                    placeholder={this.props.placeholder}
                                    data={this.props.data}
                                    onSelect={this.changeValue.bind(this)}
                                    top={this.props.top}
                                    left={this.props.left}
                                    mode={this.props.mode}
                                    searchLen={this.props.searchLen}
                                    itemTextStyle={this.props.itemTextStyle}
                                    defaultTextStyle={this.props.defaultTextStyle}
                                    onEmpty={this.props.onEmpty}
                                    itemIconName={this.props.ItemIconName}
                                    itemIconType={this.props.ItemIconType}
                                    itemIconStyle={this.props.itemIconStyle}

                                    iconName={this.props.iconName}
                                    iconType={this.props.iconType}
                                    iconStyle={this.props.iconStyle}
                                    loading={this.props.loading}
                                    {...this.props}
                                />
                                :
                                <MobitPicker
                                    defaultValue={this.defaultValue()}
                                    placeholder={this.props.placeholder}
                                    data={this.props.data}
                                    onSelect={this.changeValue.bind(this)}
                                    top={this.props.top}
                                    left={this.props.left}
                                    mode={this.props.mode}
                                    searchLen={this.props.searchLen}
                                    itemTextStyle={this.props.itemTextStyle}
                                    defaultTextStyle={this.props.defaultTextStyle}
                                    itemIconName={this.props.ItemIconName}
                                    itemIconType={this.props.ItemIconType}
                                    itemIconStyle={this.props.itemIconStyle}
                                    iconName={this.props.iconName}
                                    iconType={this.props.iconType}
                                    iconStyle={this.props.iconStyle}
                                    loading={this.props.loading}
                                    // template={this.props.template}
                                    {...this.props}
                                />

                            }
                            {/*{this.props.loading ?*/}

                                {/*<View style={activePicker2Style.viewSpinner}>*/}
                                    {/*<Spinner animation="fade" style={activePicker2Style.spinner}*/}
                                             {/*color='blue' size="small"/>*/}
                                {/*</View>*/}
                                {/*: false}*/}
                        </View>


                    </View>
                </View>
                {handleError(instance, this.props)}
            </View>
        )
    }
}


/*
 style      => in container View item
 inputStyle => in input
 iconStyle  => in icon
 iconName   => name of icon
 iconType   => type of icon
 other props=> in input
 */

export class TextArea extends React.Component {
    constructor(props) {
        super(props);
        this.height = 120;
        if (this.props.height)
            this.height = this.props.height;

    }

    changeText(val) {

        const {instance, name} = this.props;
        // console.log('change');
        // console.log(instance.state);
        let obj = [];
        obj['params'] = instance.state.params;
        obj['params'][name] = val;
        instance.setState(Object.assign({}, instance.state, obj));
    }

    render() {
        var props = {...this.props};
        delete props['height'];
        const {instance, name} = this.props;

        return (
            <View style={this.props.style ? this.props.style : {}}>
                {/*<View style={[areaStyles.container, {height: this.height}]}> */}
                <View style={[areaStyles.container]}>
                    <TextInput
                        // numberOfLines={20}
                        onChangeText={(val) => {
                            this.changeText(val)
                        }}
                        value={instance.state.params[name]}
                        {...props}
                        style={[areaStyles.inputStyle, this.props.inputStyle]}
                        // style={[styles.inputStyle, this.props.inputStyle]}
                        underlineColorAndroid="transparent"
                    />
                    {this.props.iconName ?
                        <Icon
                            name={this.props.iconName}
                            type={this.props.iconType ? this.props.iconType : "Ionicons"}
                            style={[areaStyles.icon, {...this.props.iconStyle}]}
                        />
                        : false
                    }
                </View>
                {handleError(instance, this.props)}
            </View>
        );

    }
}

const submitStyle = StyleSheet.create({

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        // paddingRight:10,
        // paddingLeft:10,
        width: 100
    },
    spinner: {
        // marginRight:3
    }
});

/*
 style => in button

 instance => instance off component you set loading in state
 loading  => state of loading
 */
export class SubmitButton extends React.Component {

    constructor(props) {
        super(props);
        this.loading = "loading";
        if (this.props.loading) {
            this.loading = this.props.loading;
        }
        // this.btnStyle=[submitStyle.button];
        // if(Array.isArray(this.props.style)){
        //     Array.prototype.push.apply(this.btnStyle, this.props.style);
        // }else{
        //     this.btnStyle.push(this.props.style);
        // }
        this.btnStyle = pushToStyle(submitStyle.button, this.props.style);
    }

    render() {
        return (
            <Button
                {...this.props}
                style={this.btnStyle}
            >

                {}
                {this.props.instance.state[this.loading] ?
                    <Spinner animation="fade" style={submitStyle.spinner} color='white' size="small"/>
                    : this.props.children}
            </Button>

        );

    }
}


const radioStyle = StyleSheet.create({

    label: {
        marginRight: 5
    }
});

/*
 items:
 key => value to set
 value => label to show

 containerStyle        => style for View wrap radio and label
 style and other props => style and other props for radio
 labelStyle            => style for label
 */
export class RadioList extends React.Component {
    names = [];//hold all name user defined this is for support multiple name in one radio list
    constructor(props) {
        super(props);
        this.names.push(this.props.name);
    }

    change(val, name = null) {
        const instance = this.props.instance;
        if (!name) {
            name = this.props.name;
        }
        let obj = [];
        obj['params'] = instance.state.params;
        //reset old state saved
        for (let key in this.names) {
            delete obj['params'][this.names[key]];
        }


        obj['params'][name] = val;
        instance.setState(obj);
    }

    render() {
        let {instance, name, items} = this.props;
        return (
            <View>
                {items.map((object, key) => {
                    if (object.name) {
                        name = object.name;
                        this.names.push(name);
                    }
                    return (
                        <View key={key}
                              style={[{flexDirection: 'row-reverse'}, this.props.containerStyle]}
                        >
                            <Radio onPress={() => {
                                this.change(object.value, object.name)
                            }}
                                   selected={instance.state.params[name] == object.value}
                                   {...this.props}
                            />
                            <Text onPress={() => {
                                this.change(object.value, object.name)
                            }}
                                  style={[radioStyle.label, this.props.labelStyle]}
                            >{object.label}</Text>
                        </View>
                    );
                })}
                {handleError(instance, this.props)}
            </View>
        );

    }
}


/*
 activeValue     => value to set in state if switch is Active
 inActiveValue   => inActive value to set in state if switch is off
 to delete params from state.params it is enough set inActiveValue to "_delete_"

 how to set label=>
 label           => string
 labelStyle  => style for label
 style       => style on container
 OR
 jsx             => jsx
 */

const switchStyle = StyleSheet.create({

    label: {
        marginRight: 5
    },
    container: {
        flexDirection: 'row-reverse', alignItems: 'center'
    }
});

export class ActiveSwitch extends React.Component {
    constructor(props) {
        super(props);
    }

    changeValue(val) {
        const {instance, name, activeValue, inActiveValue} = this.props;
        let obj = [];
        obj['params'] = instance.state.params;
        obj['params'][name] = val;
        if (val && activeValue !== undefined) {//if switch is active and active value set
            obj['params'][name] = activeValue;
        } else if (!val && inActiveValue === "_delete_") {//uf switch is inActive and inActiveValue set buy "_delete_"
            delete obj['params'][name];
        } else if (!val && inActiveValue !== undefined) {//if switch is inActive and inActiveValue set
            obj['params'][name] = inActiveValue;
        }
        instance.setState(Object.assign({}, instance.state, obj));
    }

    getValue() {
        const {instance, name, activeValue, inActiveValue} = this.props;
        let val = instance.state.params[name];
        if (val == undefined) {
            return false;
        }


        if (activeValue == val) {
            val = true;
        } else if (inActiveValue == val) {
            val = false;
        }

        return val;
    }

    render() {
        const {instance, name} = this.props;
        let val = this.getValue();
        return (
            <View>
                <View
                    style={[switchStyle.container, this.props.style]}
                >
                    <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                        <Switch
                            {...this.props}
                            onValueChange={(value) => {
                                this.changeValue(value)
                            }}
                            value={val}
                        />


                    </View>

                    <Touchable onPress={() => {
                        this.changeValue(!val)
                    }}
                    >
                        {this.props.label ?
                            <Text
                                style={[checkStyle.label, this.props.labelStyle]}>
                                {this.props.label}
                            </Text>
                            : this.props.jsx}
                    </Touchable>
                </View>
                {handleError(instance, this.props)}
            </View>
        );

    }
}

const checkStyle = StyleSheet.create({

    label: {
        marginRight: 8
    },
    container: {
        flexDirection: 'row-reverse',
        alignItems: 'center'
    }
});

/*
 activeValue     => value to set in state if switch is Active
 inActiveValue   => inActive value to set in state if switch is off
 to delete params from state.params it is enough set inActiveValue to "_delete_"

 how to set label=>
 label           => string
 labelStyle  => style for label
 style       => style on container
 OR
 jsx             => jsx
 */

export class ActiveCheckBox extends React.Component {
    constructor(props) {
        super(props);
    }

    changeValue(val) {
        const {instance, name, activeValue, inActiveValue} = this.props;
        let obj = [];
        obj['params'] = instance.state.params;
        obj['params'][name] = val;
        if (val && activeValue !== undefined) {//if switch is active and active value set
            obj['params'][name] = activeValue;
        } else if (!val && inActiveValue === "_delete_") {//uf switch is inActive and inActiveValue set buy "_delete_"
            delete obj['params'][name];
        } else if (!val && inActiveValue !== undefined) {//if switch is inActive and inActiveValue set
            obj['params'][name] = inActiveValue;
        }
        instance.setState(Object.assign({}, instance.state, obj));
    }

    getValue() {
        const {instance, name, activeValue, inActiveValue} = this.props;
        let val = instance.state.params[name];
        if (val == undefined) {
            return false;
        }


        if (activeValue == val) {
            val = true;
        } else if (inActiveValue == val) {
            val = false;
        }

        return val;
    }

    render() {
        const {instance} = this.props;
        let val = this.getValue();
        return (
            <View>
                <View
                    style={[checkStyle.container, this.props.style]}
                >
                    <View>
                        <CheckBox
                            {...this.props}
                            style={{}}
                            onPress={() => {
                                this.changeValue(!val)
                            }}
                            checked={val}
                        />

                    </View>

                    <Touchable onPress={() => {
                        this.changeValue(!val)
                    }}
                    >
                        {this.props.label ?
                            <Text
                                style={[checkStyle.label, this.props.labelStyle]}>
                                {this.props.label}
                            </Text>
                            : this.props.jsx}
                    </Touchable>
                </View>
                {handleError(instance, this.props)}
            </View>
        );

    }
}


/*
 value   => value to set in state
 style    => style in container
 how to set label=>
 label              => string
 labelStyle         => style for label
 labelContainer     => label container style
 style              => style on container
 OR
 jsx                => jsx
 disable            => if true radio is disable
 showError          => default is true
 red                => default is true (red border or label)
 */

export class ActiveRadio extends React.Component {
    constructor(props) {
        super(props);
        this.labelStyle = pushToStyle(checkStyle.label, this.props.labelStyle);
        if (this.props.disable === true) {
            this.labelStyle = pushToStyle(this.labelStyle, {color: '#9e9e9e'});
        }
    }

    changeValue() {
        if (this.props.disable === true) {
            return;
        }
        const {instance, name, value} = this.props;
        let obj = [];
        obj['params'] = instance.state.params;
        obj['params'][name] = value;
        if (this.props.extraData !== undefined) {
            obj = Object.assign({}, obj, this.props.extraData);
        }
        instance.setState(Object.assign({}, instance.state, obj));
    }

    isSelected() {
        const {instance, name, value} = this.props;
        return instance.state.params[name] === value;
    }

    render() {
        const {instance} = this.props;
        let isSelected = this.isSelected();
        let b_color = borderColor(instance, this.props);
        return (
            <View>
                <View
                    style={[checkStyle.container, this.props.style]}
                >
                    <View style={{flexDirection: 'row-reverse'}}>
                        <Radio
                            onPress={() => {
                                this.changeValue()
                            }}
                            selected={isSelected}
                            {...this.props}
                            style={{}}
                            selectedColor="#4285F4"
                            color={b_color}
                        />

                    </View>

                    <Touchable
                        onPress={() => {
                            this.props.onPress ? this.props.onPress() : this.changeValue()
                        }}
                        activeOpacity={this.props.disable ? 1 : 0.5}
                        style={this.props.labelContainer ? this.props.labelContainer : {}}
                    >
                        {this.props.label ?
                            <Text
                                style={[...this.labelStyle, setColor(b_color)]}>
                                {this.props.label}
                            </Text>
                            : this.props.jsx}
                    </Touchable>
                </View>
                {handleError(instance, this.props)}
            </View>
        );

    }
}

/*
 showError => by default is true if you don't want show error set this to false

 */
const handleError = (instance, props) => {
    let name = props.validationAtt !== undefined ? props.validationAtt : props.name;
    return (
        <View>
            {hasError(instance, name) && showError(instance, props) ?
                <Error message={instance.state.error[name]}/>
                : false}
        </View>
    )
};
const hasError = (instance, name) => {
    return instance.state.error && instance.state.error[name];
};
const showError = (instance, props) => {
    let showError = true;
    if (props.showError !== undefined) {
        showError = props.showError;
    }
    return showError;
};

const borderColor = (instance, props) => {
    if (hasError(instance, props.name) && showError(instance, props)) {
        if (props.red === false) {
            return "rgba(34,36,38,.15)";
        }
        return "red";
    } else if (hasError(instance, props.name) && props.red === true) {
        return "red";
    }
    return "rgba(34,36,38,.15)";
};

const setColor = (color) => {
    if (color === "rgba(34,36,38,.15)") {//if gray changed in top then should change here
        return {};
    }
    return {color: color}
};

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


export class Error extends React.Component {

    render() {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{this.props.message}</Text>
                <Icon style={styles.errorIcon} name={Icons.Error.name} type={Icons.Error.type}/>
            </View>
        );
    };
}

