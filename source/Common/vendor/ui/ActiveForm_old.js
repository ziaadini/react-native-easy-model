import React from 'react';
import {View, Text, TextInput, StyleSheet, Switch, Platform, TouchableOpacity, I18nManager, } from 'react-native';
import {Button, CheckBox, Icon, Radio, Spinner, Label,Picker} from "native-base";
import {Icons} from "../../config/main";
import {mapObject} from '../Helper';


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
                <Text>{instance.state.error[name]}</Text>
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
        borderColor: 'gray',
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
        marginTop: 5
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

        return (
            <View style={this.props.style ? this.props.style : {}}>
                <View style={[styles.container]}>
                    <TextInput
                        onChangeText={(val) => {
                            this.changeText(val)
                        }}
                        value={instance.state.params[name]}
                        {...this.props}
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
                {instance.state.error && instance.state.error[name] ?
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{instance.state.error[name]}</Text>
                        <Icon style={styles.errorIcon} name={Icons.Error.name} type={Icons.Error.type}/>
                    </View>
                    : false}
            </View>
        );

    }
}

const activePickerStyle = StyleSheet.create({
    viewPicker:{
        borderWidth: 1,
        borderColor: 'gray',
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
                    style={[{flexDirection: 'row-reverse'}]}
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
        return (
            <View style={this.props.style ? this.props.style : {}}>
                <View style={activePickerStyle.viewPicker}>
                    {this.selectOS()}
                </View>
                {instance.state.error && instance.state.error[name] ?
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{instance.state.error[name]}</Text>
                        <Icon style={styles.errorIcon} name={Icons.Error.name} type={Icons.Error.type}/>
                    </View>: false}
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
                {instance.state.error && instance.state.error[name] ?
                    <View style={areaStyles.errorContainer}>
                        <Text style={areaStyles.errorText}>{instance.state.error[name]}</Text>
                        <Icon style={areaStyles.errorIcon} name={Icons.Error.name} type={Icons.Error.type}/>
                    </View>
                    : false}
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
        // if(this.props.style){
        //     if(Array.isArray(this.props.style)){
        //         this.btnStyle=this.props.style.slice();
        //         this.btnStyle.push(submitStyle.button)
        //     }
        // }else{
        //     this.btnStyle=submitStyle.button;
        // }
        this.loading = "loading";
        if (this.props.loading) {
            this.loading = this.props.loading;
        }
    }

    render() {
        return (
            <Button
                {...this.props}
                style={[submitStyle.button, this.props.style]}
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
                {instance.state.error && instance.state.error[name] ?
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{instance.state.error[name]}</Text>
                        <Icon style={styles.errorIcon} name={Icons.Error.name} type={Icons.Error.type}/>
                    </View>
                    : false}
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
                {instance.state.error && instance.state.error[name] ?
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{instance.state.error[name]}</Text>
                        <Icon style={styles.errorIcon} name={Icons.Error.name} type={Icons.Error.type}/>
                    </View>
                    : false}
                <TouchableOpacity onPress={() => {
                    this.changeValue(!val)
                }}
                                  style={{width: '100%'}}
                >
                    {this.props.label ?
                        <Text
                            style={[checkStyle.label, this.props.labelStyle]}>
                            {this.props.label}
                        </Text>
                        : this.props.jsx}
                </TouchableOpacity>
            </View>
        );

    }
}

const checkStyle = StyleSheet.create({

    label: {
        marginRight: 5
    },
    container: {
        flexDirection: 'row-reverse', alignItems: 'center'
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
        const {instance, name, checked} = this.props;
        let val = this.getValue();
        return (
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
                {instance.state.error && instance.state.error[name] ?
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{instance.state.error[name]}</Text>
                        <Icon style={styles.errorIcon} name={Icons.Error.name} type={Icons.Error.type}/>
                    </View>
                    : false}

                <TouchableOpacity onPress={() => {
                    this.changeValue(!val)
                }}
                                  style={{width: '100%'}}
                >
                    {this.props.label ?
                        <Text
                            style={[checkStyle.label, this.props.labelStyle]}>
                            {this.props.label}
                        </Text>
                        : this.props.jsx}
                </TouchableOpacity>
            </View>
        );

    }
}


/*
 value   => value to set in state
 style    => style in container
 how to set label=>
 label           => string
 labelStyle  => style for label
 style       => style on container
 OR
 jsx             => jsx
 */

export class ActiveRadio extends React.Component {
    constructor(props) {
        super(props);
    }

    changeValue() {
        const {instance, name, value} = this.props;
        let obj = [];
        obj['params'] = instance.state.params;
        obj['params'][name] = value;
        instance.setState(Object.assign({}, instance.state, obj));
    }

    isSelected() {
        const {instance, name, value} = this.props;
        return instance.state.params[name] === value;
    }

    render() {
        const {instance, name, checked} = this.props;
        let isSelected = this.isSelected();
        return (
            <View
                style={[checkStyle.container, this.props.style]}
            >
                <View style={{flexDirection:'row-reverse'}}>
                    <Radio
                        onPress={() => {
                            this.changeValue()
                        }}
                        selected={isSelected}
                        {...this.props}
                        style={{}}
                        selectedColor="#4285F4"
                    />

                </View>
                {instance.state.error && instance.state.error[name] ?
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{instance.state.error[name]}</Text>
                        <Icon style={styles.errorIcon} name={Icons.Error.name} type={Icons.Error.type}/>
                    </View>
                    : false}

                <TouchableOpacity
                    style={{width: '100%'}}
                    onPress={() => {
                        this.props.onPress ? this.props.onPress() : this.changeValue()
                    }}>
                    {this.props.label ?
                        <Text
                            style={[checkStyle.label, this.props.labelStyle]}>
                            {this.props.label}
                        </Text>
                        : this.props.jsx}
                </TouchableOpacity>
            </View>
        );

    }
}
