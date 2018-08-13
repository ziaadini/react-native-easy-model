import Translate from "./Translate";
import {OAuth2} from "./OAuth2";
// import {Actions} from "react-native-router-flux";
import {Model} from "../vendor/Model"

export function number_format(number) {
    var num = number.replace(/[^\d]/g, '');
    if (num.length > 3)
        num = num.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
    return num;
}

export function getTime() {
    const dateTime = Date.now();
    return Math.floor(dateTime / 1000);
}

/*
 object1  - object2  buy only compare key
 DELETE object2 data FROM object1 WHERE they have common key
 if value has been set then DELETE FROM object1
 WHERE object2 value is equal value parameter
 */
export function keyMines(object1, object2, value = undefined) {
    for (let key in object2) {
        if (value === undefined || (value !== undefined && object2[key] == value)) {
            delete object1[key];
        }
    }
    return object1;
}

export function commonObject(object1, object2) {
    let data = {};
    for (let key in object1) {
        if (object2[key] !== undefined && object1[key] === object2[key]) {
            data[key] = object1[key];
        }
    }
    return data;
}

export function imploade(separator, object, field = null) {
    let data = "";
    var val = "";
    for (let key in object) {
        if (field === null) {
            val = object[key];
        } else {
            val = object[key];
            val = val[field];
        }
        data += separator + val;
    }
    return data.substr(separator.length);
}

export async function _submit(instance, model, requireLogin = true, url = null, toastInstance = null, extraData = {}, loading = "loading") {

    if (instance.state[loading]) {
        console.log('toast loading');
        if (toastInstance) {
            toastInstance.refs.toast.show(Translate.t('app', "requesting"), 1000);
        }
        else
            instance.refs.toast.show(Translate.t('app', "requesting"), 1000);
        return;
    }
    if (url === null) {
        url = model.url;
    }

    if (instance.state.isConnected) {
        model.load(instance.state.params);
        if (model.validate(instance)) {
            let load = {};
            let params = instance.state.params;
            params = Object.assign({}, params, extraData);
            // console.log('params after assign');
            // console.log(params);
            load[loading] = true;
            instance.setState(load);
            try {
                console.log(params);
                let response = "";
                if (requireLogin) {
                    response = await OAuth2.fetch(url, "POST", params);
                } else {
                    response = await model.FetchAsync(url, "POST", params);
                }
                load[loading] = false;
                instance.setState(load);
                var p = new Promise(function (resolve, reject) {
                    resolve(response);
                });
                return p;

            } catch (error) {
                console.error(error);
            }
        } else {
            console.log(model.getError());
        }

    }
}

export function array_sum(arrayOfObject, prop) {
    var total = 0
    for (var i = 0, _len = arrayOfObject.length; i < _len; i++) {
        total += arrayOfObject[i][prop]
    }
    return total
}

export function mapObject(object, callback) {
    return Object.keys(object).map(function (key) {
        return callback(object[key], key);
    });
}

// export function goBack() {
//      Actions.pop({refresh: {refresh:Math.random()}});
// }
export function empty(obj) {
     return Model.empty(obj);
}


