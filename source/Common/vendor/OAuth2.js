import {AsyncStorage} from "react-native";
import {baseUrl} from "../config/main";
import {getTime} from "../constant/func";
import {Model} from "./Model";

export const oAuth2Config = {
    client_id: 'mobit_plus_app_ddD@dffdA',
    client_secret: 'ASx@sdsdF_DVDV1sd.s',
    // grant_type: 'password',
    // grant_type: 'refresh_token',
};

export class OAuth2 {

    static TOKEN_KEY = "__token__";
    static VERSION = "oauth2";

    static setExpire(response) {
        response.data['expire'] = getTime() + response.data.expires_in;
        return response;
    }

    static async hasToken(){
        let token=await AsyncStorage.getItem(OAuth2.TOKEN_KEY);
        if(token){
            return true;
        }
        return false;
    }
    static  fetch(url,method="GET",params={}) {
        return AsyncStorage.getItem(OAuth2.TOKEN_KEY).then(async (value) => {
            if (value) {//if we have token
                  value = JSON.parse(value);
                  if (value.expire < getTime()) {//if token expired
                      console.warn("expired");
                      let response = await OAuth2.resetToken(value.refresh_token);//reset token by refresh token
                      console.log('reset token response is : ');
                      console.log(response);
                      if (response.success === false) {
                          return false;
                      }

                      response = OAuth2.setExpire(response);
                      AsyncStorage.setItem(OAuth2.TOKEN_KEY, JSON.stringify(response.data));//save to async storage
                      return Model.Fetch(url, method, params, response.data.access_token);//fetch data from api
                  } else {
                      //fetch data from api
                      // console.log("url is : ");
                      // console.log("ACCESS TOKEN IS : ");
                      //   console.log(value.access_token);


                      return Model.Fetch(url, method, params, value.access_token);
                  }

              } else {
                  return false;
              }

        });
    }

    static async resetToken(refresh_token) {
        let url = baseUrl + OAuth2.VERSION + "/rest/token";
        let params = {
            refresh_token: refresh_token,
            grant_type: 'refresh_token',
            client_id: oAuth2Config.client_id,
            client_secret: oAuth2Config.client_secret,
        };
        return fetch(url,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            })
            .then((response) => response.json())
            .then((responseData) => {
                return responseData;
            })
            .catch(error => console.log(error));
    }

}