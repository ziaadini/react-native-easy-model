// import {Actions} from "react-native-router-flux";
// import ProductCategory from "../../Controller/ProductCategoryController";
// import Translate from "../vendor/Translate";
// export function number_format(number) {
//     var num = number.replace(/[^\d]/g, '');
//     if (num.length > 3)
//         num = num.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
//     return num;
// }
//
// export function getTime() {
//     const dateTime = Date.now();
//     return Math.floor(dateTime / 1000);
// }
//
// export function loadParams(params, formName = null) {
//     let data = {};
//
//     for (let paramKey in params) {
//         if (paramKey == 'page') {//ignore page parameter
//             continue;
//         }
//         if (typeof params[paramKey] == 'number' || typeof params[paramKey] == 'string') {
//             data[buildKey(paramKey, formName)] = params[paramKey];
//         } else if (typeof params[paramKey] == 'object') {
//             for (let childParamsKey in params[paramKey]) {
//                 data[buildKey(paramKey, formName) + "[" + childParamsKey + "]"] = params[paramKey][childParamsKey]
//             }
//         }
//     }
//     return data;
// }
//
// export function buildKey(param, formName) {
//     if (formName) {
//         return formName + "[" + param + "]";
//     } else {
//         param;
//     }
//
// }
//
// export function href(object) {
//     if (object.page == "product-category") {
//         Actions.ProductCategory({params: object});
//     } else if (object.page == "details") {
//         Actions.DetailController({'g_id': object.id});
//     } else if (object.page == "main-products") {
//         Actions.MainProducts({'category_id': object.category_id});
//     }
// }
// export function disconnect() {
//     Actions.NotFound({params: {message: Translate.t("app", "disconnect")}});
// }
//
// export function sortData(main_id, object) {
//
//     for (let i = 0; i < object.length; i++) {
//         let obj = object[i];
//
//         if (obj.id === main_id) {
//             return obj;
//         }
//     }
// }
//
// export function remove(array, element) {
//     const index = array.indexOf(element);
//     array.splice(index, 1);
//     console.log(array);
//     return array;
// }
// // export function getDataError() {
// //     Actions.NotFound({params:{message:Translate.t("app","getDataError")}});
// // }
