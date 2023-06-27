import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Navigation} from "react-native-navigation";
import FastImage from 'react-native-fast-image';
import listeners from '../Components/listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = () => {
    useEffect(() => {
        listeners();
        setTimeout(() => {
            checkUserAuth();       
        }, 3000);
    }, []);
    const checkUserAuth = async () => {
        try {
            const userData = JSON.parse(await AsyncStorage.getItem("userData"));
            const welcomeScreen = await AsyncStorage.getItem("welcomeScreen");
            if (userData === null) {
                // if (welcomeScreen === null) {
                //     Navigation.push("AppStack", { component: { name: "Tutorial", options: { topBar: { visible: false } } } })
                // } else {
                //     Navigation.push("AppStack", { component: { name: "Signin", options: { topBar: { visible: false } } } })
                // }
                Navigation.push("AppStack", { component: { name: "Signin", options: { topBar: { visible: false } } } })
            } else {
                Navigation.push("AppStack", { component: 
                    {passProps: {
                        routeName: "",
                    },
                    name: "Orders",
                    options: {topBar: 
                        {backButton: {visible: false},
                        visible: false,
                        title : {text: "Orders"}}
                    }
                }})
                // Navigation.push("AppStack",{component:{name:"Workshop" , options: {  topBar: { backButton:{ visible: false}, visible: false , title : { text : ""} } } } })
            }
            console.log("userData =====> ", userData);
            console.log("welcomeScreen =====> ", welcomeScreen);
        } catch (error) {
            console.log("ERROR ======> ", error?.message);
        }
    };

    return (
        <View style={styles.mainView}>
            <FastImage
                style={{width:"80%",height:300}}
                resizeMode={FastImage.resizeMode.contain}
                source={require('../Assets/annimation.gif')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'purple',
        backgroundColor: "#FFF"
    },
})

export default Splash;