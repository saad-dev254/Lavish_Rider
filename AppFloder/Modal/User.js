import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

// {
//     "uid": 2550229,
//     "first_name": "Saqib",
//     "last_name": "Rehman",
//     "mobile": "",
//     "email": "saqibrehman903@gmail.com",
//     "gender": "Male",
//     "device_token": null,
//     "type": "real",
//     "dob": "",
//     "complete_profile": 1,
//     "picture_url": "",
//     "source": "email",
//     "created": "2022-03-15 18:17:40",
//     "modified": "2022-03-15 18:17:40",
//     "is_subscribed": 0
//   }
class User {

    user = {}
    isPremiumSubscriber = false;
    constructor() {
        makeAutoObservable(this);
    }
    setUser(obj) {
        console.log(`isPremium = ${obj?.is_subscribed == 1} ${typeof (obj?.is_subscribed)} and value ${obj?.is_subscribed}`)
        this.isPremiumSubscriber = obj?.is_subscribed == 1 || false;
        this.user = obj;
    }
    removeUser() {
        this.isPremiumSubscriber = false;
        this.user = {}
    }

    isPremium() {
        console.log("IS PREMIUM CALLED");
        console.log(JSON.stringify(this.user));
        console.log(JSON.stringify(this?.user?.package?.active_package == 1));
        console.log(this.isPremiumSubscriber);
        // return this.isPremiumSubscriber;
        return this?.user?.package?.active_package == 1
    }
    setUserStatus(bool) {
        console.log(`SetuserStatus = ${bool}`)
        this.isPremiumSubscriber = bool;
    }

}

const MobxUser = new User();
export default MobxUser;
export const ContextMobxUser = createContext(MobxUser);
// export const useContextMobxUser = useContext(ContextMobxUser);