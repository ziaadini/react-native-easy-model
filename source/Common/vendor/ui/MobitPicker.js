import React from 'react';
import {View, Text, FlatList, TextInput, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon,Spinner} from 'native-base';
import {Icons} from '../../config/main';
import {Overlay} from '../../vendor/ui/Overlay';
import {DownOverlay} from '../../vendor/ui/DownOverlay';
// import {commonCss} from '../../../assets/css/main.css';
import {Touchable} from "./Touchable";
// import {mainCss} from '../../../assets/css/style.css';
import {empty} from '../../../Common/vendor/Helper';

export default class MobitPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPicker: false,
            params: {},
            data: [],
        };
    }

    componentWillMount() {
        if (this.props.defaultValue) {
            this.setState({
                params: {
                    label: this.props.defaultValue.label,
                    value: this.props.defaultValue.value
                },
                data: this.props.data
            });
        } else {
            this.setState({
                params: {
                    label: this.props.placeholder,
                    value: -1
                },
                data: this.props.data
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue) {
            this.setState({
                params: {
                    label: nextProps.defaultValue.label,
                    value: nextProps.defaultValue.value
                },
                data: nextProps.data
            });
        } else {
            this.setState({
                params: {
                    label: nextProps.placeholder,
                    value: -1
                },
                data: nextProps.data
            })
        }
    }

    //زمانی که روی placeholder پیکر کلیک میشود
    //مودال باز میشود
    selectItem() {
        //if (this.props.data) {
        if (!empty(this.props.data)) {
            this.setState({
                modalPicker: true
            })
        } else {

            if (this.props.onEmpty !== undefined) {
                return (this.props.onEmpty());
            } else {
                this.setState({
                    modalPicker: true
                })
            }

        }
        // } else {
        //     this.setState({
        //         modalPicker: true
        //     })
        // }


    }


    //ایتم های فلت لیست
    renderItem({item}) {
        return <RenderPickerItem
            item={item}
            itemTextStyle={this.props.itemTextStyle}
            instance={this}/>
    }


    //mode=down and center
    centerContent() {
        return (
            <View style={{
               flex:1,
                backgroundColor: '#fff'
            }}>
                <View style={styles.centerContentView}>
                    {!empty(this.props.data) ?
                        <FlatList
                            data={this.props.data}
                            renderItem={this.renderItem.bind(this)}
                            keyExtractor={(item, index) => index.toString()}
                            {...this.props}
                            top={undefined}
                            left={undefined}
                            style={{backgroundColor: '#fff',}}
                            ItemSeparatorComponent={() => <View style={{width:'100%', height: 1,backgroundColor:'rgba(34,36,38,.15)'}}/>}
                        />
                        :
                        <View style={styles.viewNoData}>
                        </View>
                    }
                </View>
            </View>
        )
    }

    changeSearch(text) {
        let len = text.length;
        if (len >= this.props.searchLen) {
            var newData = [];
            text = text.trim();
            let label;
            this.props.data.map((item, index) => {
                if (item.label.toLowerCase().indexOf('' + text + '') !== -1) {
                    console.log('include');
                    // console.log(item.label);
                    newData.push(item);
                }
            })
            // console.log('newData is:');
            this.setState({
                ...this.state.params,
                data: newData
            });
            console.log(newData);
        } else if (len == 0) {
            this.setState({
                data: this.props.data
            });
        }
    }

    //mode=full
    fullContent() {
        // console.log(this.props.icon);
        return (
            <View style={styles.fullContentView}>
                <ScrollView style={{marginBottom: 20}}>
                    {this.state.data.length > 0 ?
                        this.state.data.map((item, index) =>
                            <View style={styles.mainView}
                                  key={index}>
                                {this.props.itemIconName !== undefined ?
                                    <Touchable
                                        style={styles.viewWithIcon}
                                        onPress={() => this.changeItem(item)}>
                                        <Text
                                            style={this.props.itemTextStyle}
                                        >{item.label}</Text>
                                        <Icon name={this.props.itemIconName} type={this.props.itemIconType}
                                              style={this.props.itemIconStyle}/>
                                    </Touchable>
                                    :
                                    <Touchable
                                        style={styles.borderItemScroll}
                                        onPress={() => this.changeItem(item)}>
                                        <Text
                                            style={this.props.itemTextStyle}
                                        >{item.label}</Text>
                                    </Touchable>
                                }
                            </View>
                        ) :
                        this.props.data.map((item, index) =>
                            <View style={styles.mainView}
                                  key={index}>
                                <Touchable
                                    style={styles.borderItemScroll}
                                    onPress={() => this.changeItem(item)}>
                                    <Text
                                        style={this.props.itemTextStyle}
                                    >{item.label}</Text>
                                </Touchable>
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        )
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.viewSelect]}
                onPress={() => {
                    this.selectItem()
                }}>
                <View style={styles.viewRight}>
                    {this.props.iconName !== undefined ?
                        <Icon name={this.props.iconName} type={this.props.iconType}
                              style={[styles.icon, this.props.iconStyle]}
                        />
                        : false}
                    <Text style={this.props.defaultTextStyle}
                          onPress={() => {
                              this.selectItem()
                          }}>
                        {this.state.params.label}
                    </Text>
                </View>
                <View style={styles.viewLeft}>
                    {this.props.loading ?
                        <View style={styles.viewSpinner}>
                            <Spinner animation="fade" style={styles.spinner}
                                     color='blue' size="small"/>
                        </View> :
                        <Icon name='ios-arrow-down' type='Ionicons'
                              style={styles.iconLeft}
                        />
                    }

                </View>
                {this.props.mode === 'center' ?
                    <Overlay
                        instance={this}
                        stateName="modalPicker"
                        top={this.props.top}
                        left={this.props.left}
                    >
                        {this.centerContent()}
                    </Overlay>
                    :
                    this.props.mode === 'down' ?
                        <DownOverlay
                            instance={this}
                            stateName="modalPicker"
                            top={this.props.top}
                            left={this.props.left}
                        >
                            {this.centerContent()}
                        </DownOverlay>
                        :
                        <Overlay
                            instance={this}
                            stateName="modalPicker"
                            top={0.01}
                            left={0.01}
                            header={<View style={{width: '90%', marginLeft: 10}}>
                                <TextInput
                                    style={[styles.searchText]}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => this.changeSearch(text)}
                                    placeholder='کلمه مورد نظر خود را تایپ کنید'
                                />
                            </View>}
                        >
                            {this.fullContent()}
                        </Overlay>
                }

            </TouchableOpacity>
        )
    }

    //زمانی که ایتمی انتخاب میشود مودال بسته میشود در مقادیر
    //value and label در
    //params instance ست میشود
    changeItem(item) {
        this.setState({
            modalPicker: false,
            params: {
                label: item.label,
                value: item.value
            }
        }, () => {
            this.props.onSelect(this.state.params);
        });

    }
}

export class RenderPickerItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const item = this.props.item;
        return (
            <View style={styles.mainView}>
                <Touchable
                    style={{backgroundColor: '#fff'}}
                    onPress={() => this.props.instance.changeItem(item)}>
                    <Text
                        style={this.props.itemTextStyle}
                    >{item.label}</Text>
                </Touchable>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 40,
        // borderBottomWidth: 1,
        // borderBottomColor: 'rgba(34,36,38,.15)',
        backgroundColor: '#fff'
    },
    borderItemScroll: {
        paddingRight: 10,
    },
    viewInnerTouch: {},
    searchText: {
        height: 40,
        borderColor: 'rgba(34,36,38,.15)',
        borderWidth: 1
    },
    viewFull: {
        marginBottom: 40
    },
    centerContentView: {
        height: '95%',
        marginBottom: 5,
        backgroundColor: '#fff'
    },
    fullContentView: {
        marginTop: 20,
        height: '90%',
    },
    viewWithIcon: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    viewSelect: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
      //  backgroundColor:'#0fd'
    },
    viewRight: {
        flexDirection: 'row-reverse'
    },
    viewLeft: {
        flexDirection: "column",
        justifyContent: 'center',
    },
    iconLeft: {
        fontSize: 15,
        color: 'gray',
        marginLeft: 15
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    viewNoData: {
        backgroundColor: '#fff',
        height: '100%'
    },
    icon: {
        color: '#bdbdbd',
        // marginRight: 5,
        marginLeft: 10,
    },
    spinner: {
       // marginTop: -50,
        marginBottom: 20,
        marginLeft: 20,
        width: '10%'
    },
    viewSpinner:{
        flexDirection:'column',
        justifyContent:'center',
        //backgroundColor:'#0f0'
    }
})