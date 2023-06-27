import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebugConsole } from '../General/Constants';
import MobxUser from './User';
// import { KEY_TOKEN } from '../General/Api';

const str = (val) => {
    return JSON.stringify(val);
}

const KeyUserData = "KEY_USER_DATA";
export async function asyncStoreUser(userData) {
    try {
        const data = JSON.stringify(userData);
        AsyncStorage.setItem(KeyUserData, data)
            .then(item => {
                DebugConsole(`asyncStoreFunction AsyncStorage.setItem .then item = ${str(item)}`);
                MobxUser.setUser(userData);
            });
        return true
    } catch (e) {
        alert('asyncStoreFunction Something went wrong');
        return false;
    }
};

export async function asyncGetUser() {
    try {
        const value = await AsyncStorage.getItem(KeyUserData);
        if (value !== null) {
            let parsedValue = JSON.parse(value);
            MobxUser.setUser(parsedValue)
            return parsedValue;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};

export async function asyncLogout() {
    try {
        let keys = await AsyncStorage.getAllKeys();
        DebugConsole(`asyncLogout AsyncStorage.getAllKeys() error =  and Keys = ${keys}`)
        if (keys != undefined && keys.length > 0) {
            DebugConsole(`IF -- keys != undefined && keys.length > 0`)
            MobxUser.removeUser();
            await AsyncStorage.multiRemove(keys);
            return true
        } else {
            return false
        }
    } catch (e) {
        return false;
    }
}
