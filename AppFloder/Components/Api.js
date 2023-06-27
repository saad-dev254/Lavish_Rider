import AsyncStorage from "@react-native-async-storage/async-storage";

 
export async function setItem(key, value) {
    try {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // console.error('AsyncStorage#setItem error: ' + error.message);
    }
}

export async function getItem(key) {
    return await AsyncStorage.getItem(key)
        .then((result) => {
            if (result) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    // console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
                }
            }
            return result;
        });
}
export async function removeItem(key) {
    return await AsyncStorage.removeItem(key);
}

// export default {
//     ,
//     ,

//     // getData = async () => {
//     //     try {
//     //       const value = await AsyncStorage.getItem('@baseurl')
//     //       if(value !== null) {
//     //         // value previously stored

//     //         console.log ("valuevalue" , value)

//     //       }
//     //     } catch(e) {
//     //       // error reading value
//     //     }
//     //   }
    export var BaseUrl = "https://www.lavishdxb.com/api/"

class URL {
    BaseUrl = ""
    constructor(){
        //
        this.loadKey()
    }

    async loadKey(){
        const key = await getItem("MeriKey")
        // -- KEY - KIYA AA RAHI ...
        //NULLL
        this.BaseUrl = key;
    }
    async changeAndSaveBaseUrl(newComponyUrl){

            // getItem("CompanyUrl").then((keyResult) => {
            //     console.log(JSON.stringify(keyResult,null,2))
            // })
        //DO THE STUFF HERE.
        // this.BaseUrl ""= newComponyUrl;
        setItem("MeriKey",newComponyUrl);
        console.log("newComponyUrl" , newComponyUrl)

    }
}

const APP_URL = new URL();
export {APP_URL};





 
export const GetAllWorkshop = BaseUrl + "workshop"
export const GetQuestions = BaseUrl + "faqs/"
export const SignUp = BaseUrl + "register"
export const SignIn = BaseUrl + "login"

export const pickUP = BaseUrl + "arrange/location"

export const orderhistory = BaseUrl + "get/orders/"

export const editProfile = BaseUrl + "user/update/1"
