hello this is yadollah ziaadini from iran at the beginning i'm sorry about my bad english, then lats go! 

react native easy model support:
  
  *  ## react native validation rules
  *  ## react native multi language
  *  ## react native easy work with sqlite database
  *  ## react native url manager for server fetch request
  *  ## react native easy request to server
 
![react native form validation](https://github.com/ziaadini/react-native-easy-model-/blob/master/source/assets/persion.PNG)

Dependency:

* https://github.com/craftzdog/react-native-sqlite-2
* https://www.npmjs.com/package/native-base

native base is optional if you want use active form you should install native base too.

How to config  react-native-easy-model :

* Step 0: please install related above staff
* Step 1: config language inside index.js, create global language variable inside this file.  If you want change language, you can change language variable as you wish.
Here is the code :  **global.language="en";**

* Step2: download and copy Common directory then paste it whatever you want inside your project

* step3: config db and base url inside common/config/main.js
Congratulations! You installed it successful enjoy!

How to use it :
you can fallow examples inside the project but i explain some staff here :

first create your model class extends from base model class like this : 



```
import {Model} from "../Common/vendor/Model"
import Translate from "../Common/vendor/Translate";

export default class UserModel extends Model {
    static VERSION = "v1";
    static _FULL_NAME="fullName";//scenario for require full name
    constructor(createTable = true) {
        super();
        this.getUrl(['user/data']);
        if (createTable) {
            this.createTable();
        }
    }

    static tableName() {
        return "User";
    }

    static table() {
        let table;
        table = {
            id: "INTEGER PRIMARY KEY NOT NULL",// g_id
            first_name: "varchar(50)",
            last_name: "varchar(50)",
        };
        return table;
    }

    rules() {
        return [
            {field: ['id'], rule: 'unique'},
            {field: ['first_name'], rule: 'required'},
            {field: ['last_name'], rule: 'required',on:this.constructor._FULL_NAME},
            {field:['first_name'], rule:'string',maxLength:50,minLength:2},
            {field:['last_name'], rule:'string',maxLength:50,minLength:2},
        ];
    }

    attributeLabels(){
        return {
            first_name:Translate.t(language,'first_name'),
            last_name:Translate.t(language,'last_name'),
        }
    }

}
```
if you don't want use local database for your model inside constructor write **super(false);**

**what about getUrl method?**

with this method you can manage your urls, getUrl use VERSION and baseUrl variables, you can see common/config/main.js in this file you can config baseUrl and db configurations.
getUrl also has second parameter see this example:
```
let params={id:5,name:'ali'};
this.getUrl(['user','data'],params);
//this.url is : baseUrl/version/user/data?id=5&name=ali
```
getUrl set this.url field and return generated url but if you don't want this, you can simply set third parameter to false.

**what about createTable() method?**
this method create table if not exist.

tableName() => name of table and table() => model look this static method to do some thing about db such as build query and create table.

**rules method:**
  your rules for validation, you can simply return array of object for validation like above model example, some thing     maybe is few complex is scenario.
what is scenario? you can simply define a name with key on : "your scenario", then when you want use it 
you can write some thing like this: youtModel.setScenario("your scenario"); default scenario is : 'default'.
if you can't understand scenario don,t worry i will explain this in component example.

**attributeLabels method:**
this method use for translate for example in validation errors you can see this usage.
what is Translate.t(language,'first_name')?
this method use language global variable (key of object in Common/config/translate.js)
and second parameter is field you want to translate and in the end you should put your translate inside Common/config/translate.js.

your component: 
```
import React, {Component} from 'react';
import {
    Text,
    View
} from 'react-native';
import UserModel from "./source/model/UserModel";
import {SubmitButton, TextBordered} from "./source/Common/vendor/ui/ActiveForm";

export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            params: {},
            error: {},
        };
        this.model = new UserModel();
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
```
**let me start from render :** 
<TextBordered>
this is a component from ActiveForm (sorry is rtl you can customize for your self).

instance: instance of component to read error from state and change state.params
name : after text input changed value of text input set in state.params.name

 _submit method : 

_**what is load method?**_  load method is perfect this method get an object and load data from model let me show you by example:
```
object={id:1,first_name:'yadollah',last_name:'ziaadini', sex:'male'}
model.load(obj) do some thing like this
model.id=1;
model.first_name="yadollah";
model.last_name="ziaadini";
// model.sex="some text"; why is commented? because don,t load
```
model.sex commented but why? it's because no validation rule definde on sex!

load method look at rules() method and then load fields to model.

**what about model.setScenario('fullName')?**

this method set fullName scenario to model, this means last_name is require now in this example.
because require rule set on : "fullName".

**model.validate(this)?**

validate method check validation, after run this method you can get errors width **model.getError();**
if you passed ```this``` to validate method, this method set errors in **state.error** and show error because render called.


**model.save(this,true)?**

save data to database and if second parameter is true call validate method.
if **model.isNewRecord** (when new a model is true by default) is true save() method execute insert query else execute update query (where pk=pkValue).

**i will complete this document later...**

**if you are yii developer this codes is very simple for you. because it's like _yii2 php framework_.**
