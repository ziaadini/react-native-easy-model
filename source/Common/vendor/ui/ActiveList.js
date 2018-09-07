import React from "react";
import {FlatList, Text, View} from "react-native";
import {OAuth2} from "../OAuth2";
import Translate from "../Translate";
import CenterLoading from "../../../View/layout/CenterLoading";
import {Spinner} from "native-base";
import {Actions} from "react-native-router-flux";

/*
 basic instruction :
 call getData method from parent if user is connect
 call getData method when user is first disconnect and then connect;
 */


/*
 props:
 this.props.model      => model ref for get data;
 this.props.instance   => instance of parent class ;
 this.props.needLogin  => if need oauth2 set it true
 this.isConnected      => for handle network info
 footer                => jsx to show when is loading true
 onLoadComplete        => jsx show in the footer when loading has been finished

 extraData             => it's array add array in front of data set

 onLoadMore            =>arrow function return page number when load more called
 onLoadMoreComplete    =>arrow function return page number when load more complete
 */

/*for filter
 change your model url and then call this method setFilter() with ref;
 for change model url you can use this methods :
 model.removePrameter(your parameter key);
 model.addPrams(object of your parameter)
 model.setParams(object of your parameter);
 also this props in model hold params;
 model.params

 */

/*
 method should
 set in parent :

 _renderItem({item}); =>method render item output:jsx
 _noData();          =>method return jsx if have not data
 */

export class ActiveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 0,
            data: [],
            loading: false,
            scrollBegin: false,
            parameter: this.params,
            refreshing: false,
            hasData: true,//داده داریم که نشون بدیم
        };
        //render item should set inside parent component
        this.model = this.props.model;
        this.instance = this.props.instance;
        this.needLogin = this.props.needLogin;
        this.isConnected = this.props.isConnected;
        if (this.needLogin === undefined) {
            this.needLogin = false;
        }
    }

    componentWillReceiveProps(props) {
        this.isConnected = props.isConnected;
    }


    handleRefresh() {
        this.setState({
            page: 1
        }, () => {
            this.getData();
        });

    }

    setFilter() {//change your model url and then call this method
        this.setState({
            page: 1,
            refreshing: true
        }, () => {
            this.getData();
        });
    }

    async getData() {
        if (this.isConnected) {
            this.model.addPrams({page: this.state.page});
            try {
                if (this.needLogin) {
                    let get = await OAuth2.fetch(this.model.url).then((response) => {
                        if (response === false) {
                            Actions.Login();
                        }
                        if (response) {
                            console.log(response);
                            if (response.items.length) {
                                this.setState(prevState => {
                                    return {
                                        data: this.state.page === 1 ? response.items : [...prevState.data, ...response.items],
                                        //page: prevState.page + 1,
                                        pageCount: response._meta.pageCount,
                                        loading: false,
                                        refreshing: false,
                                        hasData: true,
                                    }
                                });
                            } else {
                                this.setState({
                                    loading: false,
                                    refreshing: false,
                                    hasData: false,
                                });
                            }
                        }
                        if (this.props.onLoadMoreComplete) {
                            this.props.onLoadMoreComplete(this.state.page);
                        }
                    });
                } else {
                    let get = await this.model.fetch(this.model.url).then((response) => {
                        if (response) {
                            if (response.items.length) {

                                if(this.state.page===1&&this.props.extraData!==undefined){
                                    this.setState({
                                        data:  [...this.props.extraData, ...response.items],
                                        pageCount: response._meta.pageCount,
                                        loading: false,
                                        refreshing: false,
                                        hasData: true,
                                    });

                                }else{
                                    this.setState(prevState => {
                                        return {
                                            data: this.state.page === 1 ? response.items : [...prevState.data, ...response.items],
                                            pageCount: response._meta.pageCount,
                                            loading: false,
                                            refreshing: false,
                                            hasData: true,
                                        }
                                    });
                                }

                            } else {
                                this.setState({
                                    loading: false,
                                    refreshing: false,
                                    hasData: false,
                                });
                            }
                            if (this.props.onLoadMoreComplete) {
                                this.props.onLoadMoreComplete(this.state.page);
                            }
                        }
                    });
                }
            } catch (e) {
                console.log('error');
            }
        }
    }

    handleLoadMore() {
        if (this.state.scrollBegin) {
            if (this.state.page >= 1 && this.state.page < this.state.pageCount) {

              //  console.log('page in load more:' + this.state.page);
                if (this.props.onLoadMore) {
                    this.props.onLoadMore(this.state.page);
                }
                this.setState({
                    page: this.state.page + 1,
                    loading: true,
                    scrollBegin: false,
                    //  refreshing: true
                }, () => this.getData());

            }
        }
        if (!this.isConnected) {
            // console.warn("active list state");
            this.setState({
                loading: false
            }, () => this.instance.refs.toast.show(Translate.t("app", "disconnect"), 1000));

        }

    }

    _renderFooter = () => {
        if (!this.state.loading) {
            if (this.props.onLoadComplete) {
                return (this.props.onLoadComplete);
            }
            return (<View style={{height: 0, marginBottom: 55}}></View>);
        } else {
            if (this.props.footer) {
                return this.props.footer;
            } else {
                return (
                    <CenterLoading height={55}/>
                );
            }

        }
    };

    render() {

        return (
            <View style={{flex: 1}}
            ref="list"
            >
                {this.state.hasData ?
                    <View style={{flex: 1}}>
                        <FlatList
                            data={this.state.data}
                            renderItem={this.instance._renderItem.bind(this.instance)}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={() => <Spinner color="blue"/>}
                            onEndReached={this.handleLoadMore.bind(this)}
                            onEndReachedThreshold={0.9}
                            ListFooterComponent={this._renderFooter}
                            onMomentumScrollBegin={() => {
                                if (this.state.scrollBegin === false)
                                    this.setState({scrollBegin: true})
                            }}
                            ItemSeparatorComponent={() => <View style={{width: '100%', height: 5}}/>}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh.bind(this)}
                            initialNumToRender={this.props.initialNumToRender ? this.props.initialNumToRender : 20}
                            {...this.props}
                        />
                        {/*{this.renderFooter()}*/}
                    </View>

                    : this.instance._noData()}
            </View>
        );
    }
}