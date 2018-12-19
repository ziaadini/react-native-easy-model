//user model example
import {Model} from "../Common/vendor/Model"
import Translate from "../Common/vendor/Translate";

export default class ShipModel extends Model {
    static VERSION = "v1";
    constructor(createTable = true) {
        super();
        if (createTable) {
            this.createTable();
        }
    }

    static tableName() {
        return "Ship";
    }

    static table() {
        let table;
        table = {
            id: "INTEGER PRIMARY KEY NOT NULL",
            zipCode: "varchar(50)",
            user_id:'INTEGER',
            address: "text",
        };
        return table;
    }

    // rules() {
    //     return [
    //         {field: ['id'], rule: 'unique'},
    //         {field: ['first_name'], rule: 'required'},
    //         {field: ['last_name'], rule: 'required',on:this.constructor._FULL_NAME},
    //         {field:['first_name'], rule:'string',maxLength:50,minLength:2},
    //         {field:['last_name'], rule:'string',maxLength:50,minLength:2},
    //     ];
    // }

    // attributeLabels(){
    //     return {
    //         first_name:Translate.t(language,'first_name'),
    //         last_name:Translate.t(language,'last_name'),
    //     }
    // }

}