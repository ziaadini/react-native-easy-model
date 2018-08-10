import {t} from "../config/translate"

export default class {
    static t(app, prop, replace = {}) {
        if (!(app in t)) {
            throw new TypeError(`language ${app} is not define make sure define ${app} object in Common/config/translate.js`);
        } else {
            str = t[app][prop];
            for (var key in replace) {
                str = str.replace(key, replace[key]);
            }
            return str;
        }
    }
}
