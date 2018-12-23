import {db, baseUrl} from "../config/main";
import SQLite from "react-native-sqlite-2";
import Translate from "./Translate";
import {AsyncStorage} from "react-native";
import ActiveQuery from "./ActiveQuery"

export class Model {
    url;//load url hear after getUrl method called if third parameter is true
    params;//load params hear after getUrl method called if third parameter is true
    static db = true;//if model use database this variable should be true
    error = {};
    isNewRecord = true;
    skipOnEmpty = true;//skip validation rule by default is true
    //except unique and require
    // when do not set skipOnEmpty to false on rule

    //open db load in db field;
    constructor(dbs = true, hasVersion = true) {
        this.scenario = "default";
        if (hasVersion === true && this.constructor.VERSION === undefined) {
            throw new TypeError("VERSION static attribute must override");
        }
        if (dbs) {
            if (this.constructor.tableName() === undefined) {
                throw new TypeError("tableName method must override");
            }
            if (this.constructor.table() === undefined) {
                throw new TypeError("table method must override");
            }

            this.constructor.openDb();
        }
    }

    attributeLabels() {
        return {};
    }

    load(obj, formName = null, runValidation = false) {
        let rules = this.rules();
        if (!formName) {
            for (let i = 0; i < rules.length; i++) {
                if (Array.isArray(rules[i].field)) {
                    for (let j = 0; j < rules[i].field.length; j++) {
                        if (this._isFieldInScenario(rules[i].field[j])) {
                            this.addFieldFromObject(obj, rules[i].field[j]);
                        }
                    }
                } else {
                    if (this._isFieldInScenario(rules[i].field)) {
                        this.addFieldFromObject(obj, rules[i].field);
                    }
                }
            }
        }
        if (runValidation) {
            this.validate();
        }
    }


    unload(obj, formName = null, runValidation = false) {
        let rules = this.rules();
        if (!formName) {
            for (let i = 0; i < rules.length; i++) {
                if (Array.isArray(rules[i].field)) {
                    for (let j = 0; j < rules[i].field.length; j++) {
                        if (this._isFieldInScenario(rules[i].field[j])) {
                            this.removeFieldFromObject(obj, rules[i].field[j]);
                        }
                    }
                } else {
                    if (this._isFieldInScenario(rules[i].field)) {
                        this.removeFieldFromObject(obj, rules[i].field);
                    }
                }
            }
        }
        if (runValidation) {
            this.validate();
        }
    }


    loadAll(obj) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    getDatabaseField() {
        let obj = this.constructor.table();
        let data = {};
        for (let field in obj) {
            data[field] = this[field];
        }
        return data;
    }

    addFieldFromObject(obj, field) {
        if (field in obj) {
            this[field] = obj[field];
        }
    }

    removeFieldFromObject(obj, field) {
        if (field in obj) {
            delete this[field];
        }
    }

    static __getBaseUrl() {
        return baseUrl + this.VERSION;
    }

    static __getUrl(url, params = {}, addBaseUrl = true) {
        if (!Array.isArray(url)) {
            throw new TypeError("first argument must be an array");
        }
        let path = url;
        if (addBaseUrl) {
            path = this.__getBaseUrl();
            url.map(function (item, index) {
                path += "/" + item;
            });
        }


        var i = 0;
        for (var key in params) {
            if (i == 0) {
                path += "?" + key + "=" + params[key];
            } else {
                path += "&" + key + "=" + params[key];
            }
            i++;
        }
        return path;
    }

    getUrl(url, params = {}, setUrl = true, addBaseUrl = true) {
        let path = this.constructor.__getUrl(url, params, addBaseUrl);
        if (setUrl) {
            this.url = path;
            this.params = params;
        }
        //console.log('path in getUrl: ' + path);
        return path;
    }

    addPrams(params) {
        if (!params) {
            throw new TypeError("params must be set");
        }
        let url = this.url;
        if (!this.params) {
            this.params = {};
        } else {
            url = this.url.split("?")[0];
        }
        this.getUrl([url], Object.assign({}, this.params, params), true, false);
    }

    setParams(params) {
        if (!params) {
            throw new TypeError("params must be set");
        }
        let url = this.url;
        if (!this.params) {
            this.params = {};
        } else {
            url = this.url.split("?")[0];
        }
        this.getUrl([url], params, true, false);
    }

    removePrameter(key) {
        if (!key) {
            throw new TypeError("params must be set");
        }
        let url = this.url;
        if (!this.params) {
            this.params = {};
        } else {
            url = this.url.split("?")[0];
        }
        delete this.params[key];
        this.getUrl([url], this.params, true, false);
    }

    async fetchAsync(url = this.url) {
        try {
            let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            );
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error(error);
        }
    }

    fetch(url = this.url) {
        // console.log('url in fetch');
        //  console.log(url);
        return fetch(url,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((responseData) => {
                return responseData;
            })
            .catch(error => console.log(error));
    }

    Fetch(url = this.url, method = "GET", params = {}, token = null, tokenType = "Bearer", headers = {}) {
        return this.constructor.Fetch(url, method, params, token, tokenType, headers);
    }

    static Fetch(url, method = "GET", params = {}, token = null, tokenType = "Bearer", headers = {}) {
        if (Model.empty(headers)) {//if header did not set
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';
            if (token !== null)
                headers['Authorization'] = `${tokenType} ${token}`;
        }
        let fetchBody = {
            method: method,
            headers: headers,
        };
        if (!Model.empty(params)) {
            fetchBody['body'] = JSON.stringify(params)
        }
        return fetch(url, fetchBody)
            .then((response) => response.json())
            .then((responseData) => {
                return responseData;
            })
            .catch((error) => {
                console.log(error)
            });
    }


    async FetchAsync(url = this.url, method = "GET", params = {}, token = null, tokenType = "Bearer", headers = {}) {
        if (this.constructor.empty(headers)) {//if header did not set
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';
            if (token !== null)
                headers['Authorization'] = `${tokenType} ${token}`;
        }
        // console.log(url);
        // console.log(params);
        let response = await fetch(url,
            {
                method: method,
                headers: headers,
                // headers: {
                //     'Accept': 'application/json',
                //     'Content-Type': 'application/json',
                // },

                body: JSON.stringify(params)
            }).catch((error) => {
            console.log(error);
        });
        let responseJson = await response.json();
        return responseJson;
    }


    static async setItem(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log("error to save in async storage")
            // Error saving data
        }
    }

    static async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    static async getItem(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            // Error retrieving data
        }
    }


    static openDb() {
        this.db = SQLite.openDatabase(db.dbname, db.version, db.display_name, db.size, this.openCB, this.errorCB);
    }

    openCB = () => {
        // console.log('openCB');
        //this.state.progress.push('Database OPEN')
        //this.setState(this.state)
    };
    errorCB = (err) => {
        console.log('error in database : ', err);
        // this.state.progress.push('Error: ' + (err.message || err))
        //this.setState(this.state)
        return false;
    };
    successCB = (success) => {
        console.log(success);
    };

    async createTable() {
        let table = this.constructor.table();
        // console.log(this.constructor.tableName());
        let sql = `CREATE TABLE IF NOT EXISTS ${this.constructor.tableName()}(`;
        for (var key in table) {
            sql += ` ${key} ${table[key]},`;
        }
        sql = sql.substring(0, sql.length - 1);
        sql += ")";
        // console.log('sql is : ' + sql);
        create = await this.constructor.db.transaction((txn) => {
            txn.executeSql(sql, [], this.successCB, this.errorCB);
        });
    }


    static _findPrimary() {
        let table = this.table();
        for (let key in table) {
            if (table[key].match(/PRIMARY KEY/i)) {
                return key;
            }
        }
    }

    async delete() {
        if (this.isNewRecord) {//insert query
            throw new TypeError("call delete on new record");
        } else {// delete
            let pk = this.constructor._findPrimary();
            if (!pk) {
                throw new TypeError("table " + this.constructor.tableName() + " should have a primary key");
            }
            let query = `DELETE FROM ${this.constructor.tableName()} WHERE ${pk}=:__id__`;
            let params = [];
            params.push(this[pk]);

            let root = this;
            return new Promise(function (resolve, reject) {
                root.constructor.db.transaction((txn) => {
                    txn.executeSql(query, params, (success) => {
                        resolve(true);
                    }, (error) => {
                        console.log(error);
                        resolve(false)
                    });
                });
            });

        }

    }

    static async deleteAll() {
        // let pk = this._findPrimary();
        let query = `DELETE FROM ${this.tableName()}`;
        let params = [];

        this.openDb();
        let root = this;
        return new Promise(function (resolve, reject) {
            root.db.transaction((txn) => {
                txn.executeSql(query, params, (success) => {
                    resolve(true);
                }, (error) => {
                    console.log(error);
                    resolve(false)
                });
            });
        });
    }

    __generateInsertQuery() {
        let table = this.constructor.table();
        let insert = "";
        let values = "";
        let params = [];
        let i = 0;

        for (var key in table) {
            if (this[key] !== undefined) {
                insert += `${key},`;
                values += `:${key},`;
                params.push(this[key]);
            }
            i++;
        }
        if (insert === "") {
            throw new TypeError("there is not any value");
        }
        insert = insert.substring(0, insert.length - 1);//delete last coma
        values = values.substring(0, values.length - 1);
        let sql = `INSERT INTO  ${this.constructor.tableName()} (${insert}) VALUES (${values})`;
        return {
            sql: sql,
            params: params
        }
    }

    /*
    if instance is false => do not set error in state
    */
    async save(instance, runValidation = true) {
        let flag = this.beforeSave();
        if (runValidation) {
            flag = flag && this.validate(instance);
        }
        if (flag) {
            let q = {};
            if (this.isNewRecord) {//insert query
                q = this.__generateInsertQuery();
            } else {//update query
                q = this.__generateUpdateQuery();
            }
            let root = this;
            return new Promise(function (resolve, reject) {
                root.constructor.db.transaction((txn) => {
                    txn.executeSql(q.sql, q.params, (success) => {
                        root.afterSave();
                        resolve(true);
                    }, (error) => {
                        console.log(error);
                        resolve(false)
                    });
                });
            });
        }
        // console.log("insert : "+insert);
        // console.log("values : "+values);
        // console.log(params);
    }

    __generateUpdateQuery() {
        let table = this.constructor.table();
        let update = "";
        let params = [];
        let i = 0;

        for (var key in table) {
            if (this[key] !== undefined) {
                update += `${key}=:${key},`;
                params.push(this[key]);
            }
            i++;
        }
        if (update === "") {
            throw new TypeError("there is not any value");
        }
        update = update.substring(0, update.length - 1);//delete last coma

        let primary = this.constructor._findPrimary();
        let where = `${primary}=:_${primary}`;
        params.push(this[primary]);

        let sql = `UPDATE ${this.constructor.tableName()} SET ${update} WHERE ${where}`;
        return {
            sql: sql,
            params: params
        };
    }


    beforeSave() {
        return true;
    }

    afterSave() {

    }


    static find(instance = "") {
        return new ActiveQuery(this, instance);
    }

    _createRelationQuery(TargetInstance, link) {
        let cloneTarget = Object.assign(Object.create(Object.getPrototypeOf(TargetInstance)), TargetInstance);
        let query = TargetInstance.constructor.find(cloneTarget);

        query._link = link;
        query._baseInstance = this;
        return query;
    }

    hasMany(TargetInstance, link, getData = false) {
        let query = this._createRelationQuery(TargetInstance, link);
        query._is_multiple=true;
        if (getData) {
            return query.all();
        }
        return query;
    }

    hasOne(TargetInstance, link, getData = false) {
        let query = this._createRelationQuery(TargetInstance, link);
        query._is_multiple=false;
        if (getData) {
            return query.one();
        }
        return query;
    }


    validate(instance = false) {
        //instance for set error state
        this.resetError();
        rules = this.rules();
        if (rules !== undefined) {
            for (var i = rules.length - 1; i >= 0; i--) {
                this.handleRules(rules[i]);
            }
        }
        if (instance !== false) {
            instance.setState({
                error: this.getError(),
            });
        }
        if (!this.constructor.empty(this.error)) {
            return false;
        }
        return true;
    }

    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    static empty(obj) {
        if (!obj) {
            return true;
        }
        if (typeof obj === "string" || this.isNumeric(obj)) {//zero is empty? yes
            if (obj) {
                return false;
            }
        }

        let flag = Object.keys(obj).length === 0 && obj.constructor === Object;//check object
        if (Array.isArray(obj) && obj.length === 0) {
            flag = true;
        }
        return flag;
    }

    resetError() {
        this.error = {};
    }

    handleRules(ruleItem) {//
        if (Array.isArray(ruleItem.field)) {
            for (var i = 0; i < ruleItem.field.length; i++) {//loop on field
                this.setRule(ruleItem.field[i], this[ruleItem.field[i]], ruleItem)
            }
        } else {
            this.setRule(ruleItem.field, this[ruleItem.field], ruleItem);
        }
    }

    scenarios() {
        return {};
    }

    setScenario(scenario) {
        this.scenario = scenario;
    }

    _isFieldInScenario(field) {//get field and check is include scenario
        let fields = this.scenarios()[this.scenario];
        if (fields && fields.length > 0) {
            return fields.includes(field);
        } else {//if not scenario in scenarios method by default field is in scenario
            return true;
        }
    }

    setRule(att, value, ruleItem) {
        let scenario = "default";
        let skip = this.skipOnEmpty;
        let when = true;
        if (ruleItem.skipOnEmpty !== undefined) {
            skip = ruleItem.skipOnEmpty;
        }
        if (ruleItem.on !== undefined) {
            scenario = ruleItem.on;
        }
        if (ruleItem.when !== undefined) {
            when = ruleItem.when;
        }

        if (!this._isFieldInScenario(att)) {
            return;
        }

        if ((scenario === "default" || scenario === this.scenario) && when) {
            switch (ruleItem.rule) {
                case "required":
                    this.required(att, value);
                    break;
                case "unique":
                    if (ruleItem.skipOnEmpty && !this._hasValue(value)) {
                        break;
                    }
                    this.__unique(att, value);
                    break;
                case "email":
                    if (skip && !this._hasValue(value)) {
                        break;
                    }
                    this.__email(att, value);
                    break;
                case "number":
                    if (skip && !this._hasValue(value)) {
                        break;
                    }
                    this.__number(att, value, ruleItem.max, ruleItem.min, ruleItem.exact);
                    break;
                case "integer":
                    if (skip && !this._hasValue(value)) {
                        break;
                    }
                    this.__integer(att, value, ruleItem.max, ruleItem.min, ruleItem.exact);
                    break;
                case "string":
                    if (skip && !this._hasValue(value)) {
                        break;
                    }
                    this.__string(att, value, ruleItem.maxLength, ruleItem.minLength);
                    break;
                case "compare":
                    if (skip && !this._hasValue(value)) {
                        break;
                    }
                    this.__compare(att, value, ruleItem.compareAttribute);
                    break;
            }
        }
    }

    addError(att, error, is_priority = false) {
        this.error[att] = error;
    }

    _hasValue(value) {
        if (!value) {
            return false;
        }
        return value || value.length > 0;
    }

    required(att, value) {
        if (!this._hasValue(value)) {
            this.addError(att, this.__translate(att, "_required_"), true);
        }
    }

    async __unique(att, value) {
        let obj = {};
        obj[att] = value;
        let response = await this.constructor.find().where(obj).one();
        if (!Model.empty(response)) {
            if (!this.isNewRecord && response[att] == value) {
                return;
            }
            this.addError(att, this.__translate(att, "_unique_", value));
        }
    }

    __email(att, value) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(value)) {
            this.addError(att, this.__translate(att, "_email_"));
        }
    }

    __number(att, value, max, min, exact = false) {
        if ((!exact && Number(parseFloat(value)) != value) || (exact && Number(parseFloat(value)) !== value)) {
            this.addError(att, this.__translate(att, "_number_"));
        } else {
            if (min !== undefined && max !== undefined) {
                if (value < min || value > max) {
                    this.addError(att, this.__translate(att, "_between_", min, max));
                }
            }
            if (max !== undefined) {
                if (value > max) {
                    this.addError(att, this.__translate(att, "_max_", max));
                }
            }
            if (min !== undefined) {
                if (value < min) {
                    this.addError(att, this.__translate(att, "_min_", min));
                }
            }
        }
    }

    __integer(att, value, max, min, exact = false) {
        if ((!exact && Number(parseInt(value)) != value) || (exact && Number(parseInt(value)) !== value)) {
            this.addError(att, this.__translate(att, "_integer_"));
        } else {
            if (min !== undefined && max !== undefined) {
                if (value < min || value > max) {
                    this.addError(att, this.__translate(att, "_between_", min, max));
                }
            }
            if (max !== undefined) {
                if (value > max) {
                    this.addError(att, this.__translate(att, "_max_", max));
                }
            }
            if (min !== undefined) {
                if (value < min) {
                    this.addError(att, this.__translate(att, "_min_", min));
                }
            }
        }
    }

    __string(att, value, max, min) {
        // console.log("length : "+value.length);
        // console.log("max : "+max);
        // console.log("min : "+min);
        if (typeof value !== "string") {
            this.addError(att, this.__translate(att, "_string_"));
        } else {
            if (max !== undefined) {
                if (value.length > max) {
                    this.addError(att, this.__translate(att, "_maxLength_", max));
                }
            }
            if (min !== undefined) {
                if (value.length < min) {
                    this.addError(att, this.__translate(att, "_minLength_", min));
                    this.addError(att, this.__translate(att, "_minLength_", min));
                }
            }
        }
    }

    __compare(att, value, compareAtt) {
        if (this[att] !== this[compareAtt]) {
            let compare = this.attributeLabels()[compareAtt];
            let attribute = this.attributeLabels()[att];
            if (compare === undefined) {
                compare = compareAtt;
            }
            if (attribute === undefined) {
                attribute = att;
            }
            this.addError(att, this.__translate(att, "_compare_", compare));
            this.addError(compareAtt, this.__translate(compareAtt, "_compare_", attribute));
        }
    }


    getError(field = null) {
        if (field === null)
            return this.error;
        else
            return this.error[field];
    }

    hasError(field = null) {
        if (field === null)
            return !this.constructor.empty(this.getError());
        else
            return !this.constructor.empty(this.getError()) && !this.constructor.empty(this.getError()[field]);
    }

    __translate(att, rule, validValue1 = "", validValue2 = "") {
        let attribute = att;
        if (this.attributeLabels()[att] != undefined) {
            attribute = this.attributeLabels()[att];
        } else if (Translate.t(language, att) != undefined) {
            attribute = Translate.t(language, att);
        }
        replace = {
            _field_: attribute,
            _validValue1_: validValue1,
            _validValue2_: validValue2,
        };
        return Translate.t(language, rule, replace);
    }

    mapServerError(response, instance = false) {//
        this.loadServerError(response);
        if (instance) {
            instance.setState({
                error: this.getError(),
            });
        }
    }

    loadServerError(response) {
        let data = response.data;
        for (let key in data) {
            this.addError(data[key].field, data[key].message);
        }
    }

}