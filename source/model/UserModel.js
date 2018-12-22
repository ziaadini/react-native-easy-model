//user model example
import {Model} from "../Common/vendor/Model"
import Translate from "../Common/vendor/Translate";
import ShipModel from "./ShipModel";

export default class UserModel extends Model {
    static VERSION = "v1";
    static _FULL_NAME="fullName";//scenario for require full name
    constructor(createTable = true) {
        super();
        this.getUrl(['user','data']);
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
    ships(getData=false){
        let on={};
        on[this.constructor.tableName()+"."+"id"]=2;
        return this.hasMany(new ShipModel(),{user_id:'id'},getData).andOnCondition(on);
    }

}