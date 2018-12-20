import {imploade} from "./Helper";

export default class ActiveQuery {
    _selectParams = "*";
    _where = "";
    _on = "";
    _whereParams = [];
    _limit = null;
    _offset = null;
    _order = null;
    _where_index = 0;//number of where called -> used for add to :arg
    _baseInstance;//when use relation should set base class to add _link to where condition by value of base instance
    _link = {};
    _add_tablename_to_link = true;
    _isJoin = false;//if  it's not join then add _link to where condition else add _link to on condition
    _joinBlock = "";//when joinWidth method called this method build _joinBlock variable
    constructor(instance = "", modelInstance) {
        this._tableName = instance.tableName();
        this.instance = instance;
        this._model_ = modelInstance;
        if (typeof this.instance.db === "object") {
            this.db = this.instance.db;
        } else {
            this.instance.openDb();
            this.db = this.instance.db;
        }
    }

    select(params = "*") {
        if (typeof params === "object") {
            this._selectParams = imploade(",", params);
        } else {
            this._selectParams = params;
        }
        return this;
    }

    _handleLink() {
        if (this._isJoin) {
            //add link to ON condition for join relation

            for (let index in this._link) {
                let condition = {};
                if (this._add_tablename_to_link) {
                    condition =  this._tableName + "." + index + "=" +this._baseInstance.constructor.tableName() + '.' + this._link[index];//add value of base instance to condition
                } else {
                    condition =  index + "=" + this._link[index];//add value of base instance to condition
                }
                this.andOnCondition(condition);
            }


        } else {
            for (let index in this._link) {
                let conditionObject = {};
                if (this._add_tablename_to_link) {
                    conditionObject[this._tableName + "." + index] = this._baseInstance[this._link[index]];//add value of base instance to condition
                } else {
                    conditionObject[index] = this._baseInstance[this._link[index]];//add value of base instance to condition
                }
                this.andWhere(conditionObject);
            }
        }
    }

    _generateQuery() {
        this._handleLink();//check _link and add it to WHERE or ON condition block
        let sql = `SELECT ${this._selectParams} FROM ${this._tableName}`;
        if (this._joinBlock) {
            sql += this._joinBlock;
        }
        if (this._where !== "") {
            sql += " WHERE " + this._where;
        }
        if (this._order) {
            sql += " ORDER BY " + this._order;
        }
        if (this._limit) {
            sql += " LIMIT " + this._limit;
        }
        if (this._offset) {
            sql += " offset " + this._offset;
        }
        return sql;
    }

    orderBy(order) {
        this._order = order;
        return this;
    }

    limit(limit) {
        this._limit = limit;
        return this;
    }

    offset(number) {
        this._offset = number;
        return this;
    }


    where(arg1, arg2 = null, data1 = null, data2 = null) {
        return this.andWhere(arg1, arg2, data1, data2);
    }

    andWhere(arg1, arg2 = null, data1 = null, data2 = null) {
        this._where_index++;
        this._addConditionBlock(arg1, arg2, data1, data2, "AND");
        return this;
    }

    orWhere(arg1, arg2 = null, data1 = null, data2 = null) {
        this._where_index++;
        if (this._isFirstCondition()) {
            console.warn("OR is not effected as first condition");
        }
        this._addConditionBlock(arg1, arg2, data1, data2, "OR");
        return this;
    }

    andOnCondition(arg1, arg2 = null, data1 = null, data2 = null) {
        if (this._isJoin) {
            this._where_index++;
            this._addConditionBlock(arg1, arg2, data1, data2, "AND", false);
        } else {
            //if it's not join query add condition to where statement
            this.andWhere(arg1, arg2 = null, data1 = null, data2 = null)
        }
    }


    _imploadeCondition(separator, arg1) {
        let data = "";
        for (let key in arg1) {
            if (typeof arg1[key] === "object") {//if is object use IN condition instead of =
                let count = arg1[key].length;
                let $in = "?,";
                $in = $in.repeat(count - 1) + "?";
                data += separator + "(" + key + " IN (" + $in + "))";
                for (let i in arg1[key]) {
                    this._whereParams.push(arg1[key][i]);
                }
            } else {
                data += separator + "(" + key + "=:__" + key.replace(".", "_") + this._where_index + "__)";
                this._whereParams.push(arg1[key]);
            }

        }
        return data.substr(separator.length);
    }

    _isFirstCondition() {
        return this._where === "";
    }

    _addConditionBlock(arg1, arg2 = null, data1 = null, data2 = null, type = "AND", is_where = true) {
        if (data1 === null && data2 === null) {//normal condition
            if (typeof arg1 === "object") {
                if (this._isFirstCondition()) {
                    if (is_where) {
                        this._where += `(${this._imploadeCondition(" AND ", arg1)})`
                    } else {
                        this._on += `(${this._imploadeCondition(" AND ", arg1)})`
                    }
                } else {
                    if (is_where) {
                        this._where += ` ${type} (${this._imploadeCondition(" AND ", arg1)})`
                    } else {
                        this._on += ` ${type} (${this._imploadeCondition(" AND ", arg1)})`
                    }
                }
            } else {//if where is string
                if (is_where && this._where !== "") {
                    this._where += ` ${type} `
                } else if (!is_where && this._where !== "") {
                    this._on += ` ${type} `
                }
                if (is_where) {
                    this._where += "(" + arg1 + ")";
                } else {
                    this._on += "(" + arg1 + ")";
                }
                if (arg2 !== null && Array.isArray(arg2)) {
                    this._whereParams = this._whereParams.concat(arg2);
                }
            }
        } else {
            //where('IN','field',[])
            //where('between','field',val1,val2)
            console.warn("unsupported yet");
        }
        // this._where="("+this._where+")";
    }


    joinWith(relationName, type = "LEFT JOIN") {
        let model = this._model_;
        let relationNames=relationName.split(".");
        for(let key in relationNames){
            let rel=relationNames[key];
            let obj=model[rel](false);//call relation to get active query object
            console.log('model is : ',model);
            console.log('rel is : ',rel);
            obj._isJoin = true;
            obj._handleLink(obj._tableName);
            // console.log('obj is : ', obj);
            this._joinBlock += ` ${type} ` + obj._tableName + " " + "ON" + " " + obj._on;

            model=obj._model_;

        }
        return this;
    }

    one() {
        this._limit = 1;
        let sql = this._generateQuery();
        console.log('sql is : ', sql);
        console.log('params is : ', this._whereParams);
        let root = this;
        let model = {};
        if (this._model_) {
            model = this._model_;
            model.isNewRecord = false;
        }
        return new Promise(function (resolve, reject) {
            root.db.transaction(function (txn) {
                txn.executeSql(sql, root._whereParams, function (tx, res) {
                    if (root._model_) {
                        model.loadAll(res.rows.item(0));
                    } else {
                        model = Object.assign({}, model, res.rows.item(0));
                    }
                    resolve(model);
                }, (success) => {
                    resolve(model);
                }, (error) => {
                    console.log("error : ");
                    console.log(error);
                });
            });
        });
    }

    all() {
        let sql = this._generateQuery();
        console.log('sql is : ', sql);
        console.log('params is : ', this._whereParams);
        let root = this;
        let model = {};
        if (this._model_) {
            model = this._model_;
            model.isNewRecord = false;
        }
        let data = [];
        return new Promise(function (resolve, reject) {
            root.db.transaction(function (txn) {
                txn.executeSql(sql, root._whereParams, function (tx, res) {
                    for (let i = 0; i < res.rows.length; ++i) {
                        if (root._model_) {
                            model = Object.assign(Object.create(Object.getPrototypeOf(root._model_)), root._model_);
                            model.isNewRecord = false;
                            model.loadAll(res.rows.item(i));
                        } else {
                            model = Object.assign({}, model, res.rows.item(i));
                        }
                        data.push(model);
                    }
                    resolve(data);
                }, (success) => {
                    resolve(data)
                }, (error) => {
                    console.log("error : ");
                    console.log(error);
                });
            });
        });
    }

}