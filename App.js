/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Text,
    View
} from 'react-native';
import UserModel from "./source/model/UserModel";
import {SubmitButton, TextBordered} from "./source/Common/vendor/ui/ActiveForm";
import ShipModel from "./source/model/ShipModel";

export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            params: {},
            error: {},
        };
        this.model = new UserModel();
    }
    async componentWillMount(){
        // let ship=new ShipModel();
        // ship.zipCode="656545";
        // ship.address="سمنان ایران";
        // ship.user_id=1;
        // await ship.save(this,false);
        let data=await UserModel.find(new UserModel())
            .joinWith(['ships.numbers','ships'])
            .groupBy("User.id")
            .all();

        // let ships=await data.getShips().all();
        // let ships=await data['getShips']().all();
        console.log('data is : ',data);
        // console.log('ships is : ',ships);
    }

    async _submit() {
        this.model.load(this.state.params);//load data from object inside model
        //if you comment setScenario, then last_name is not require
        this.model.setScenario(UserModel._FULL_NAME);//set scenario to require fullName
        if (await this.model.save(this, true)) {
            console.warn('success');
            this.model.unload(this.state.params);//if you want redirect this line is not require
            this.setState({//clean form
                params:{},
            });
        } else {
            console.log(this.model.getError());
        }

    }


    render() {
        return (
            <View style={{padding:20}}>
                <TextBordered
                    instance={this}
                    name="first_name"
                    style={{marginBottom:10}}
                    placeholder={this.model.attributeLabels().first_name}
                    iconName="person"
                />
                <TextBordered
                    instance={this}
                    name="last_name"
                    style={{marginBottom:10}}
                    placeholder={this.model.attributeLabels().last_name}
                    iconName="person"
                />
                <SubmitButton instance={this} loading="_loading"
                              onPress={() => {
                                  this._submit();
                              }}
                >
                    <Text style={{color:'white'}}>submit</Text>
                </SubmitButton>
            </View>
        );
    }
}