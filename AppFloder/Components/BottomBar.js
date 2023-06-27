import React from "react";
import {Image, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import { Navigation } from "react-native-navigation";

const BottomBar = () => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    return (
        <View style={{
            flexDirection:"row",
            backgroundColor:isDarkTheme?"#000":"#FFFFFF",
            padding:16,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.00,
            elevation: 24
        }}>
            <TouchableOpacity
                activeOpacity={.7}
                style={{flex:1,justifyContent:"center",alignItems:"center"}}
                onPress={() => {
                    Navigation.push("AppStack",{component:{name:"Workshop" , options: {  topBar: { backButton:{ visible: false}, visible: false , title : { text : ""} } } } })
                }}>
                <Image 
                    source={require("../Assets/home-icon-2.png")}
                    style={{height:20,width:20,resizeMode:"contain"}}
                />
                <View style={{marginTop:12}}>
                    <Text style={{fontSize:12,color:isDarkTheme?"#FFF":"#000"}}>
                        Home
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={.7}
                style={{flex:1,justifyContent:"center",alignItems:"center"}}
                onPress={() => {
                    Navigation.push("AppStack", {component: 
                        {passProps: {
                            routeName: "bottombar",
                        },
                        name: "Orders",
                        options: {topBar: 
                            {backButton: {visible: true}, 
                            visible: true , 
                            title : {text: "Orders"}}
                        }
                    }})
                }}>
                <Image 
                    source={require("../Assets/order-icon.png")}
                    style={{height:20,width:20,resizeMode:"contain"}}
                />
                <View style={{marginTop:12}}>
                    <Text style={{fontSize:12,color:isDarkTheme?"#FFF":"#000"}}>
                        My Order
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={.7}
                style={{flex:1,justifyContent:"center",alignItems:"center"}}
                onPress={() => {
                    Navigation.push("AppStack", {component: 
                        {passProps: {
                            routeName: "bottombar",
                        },
                        name: "Invoice",
                        options: {topBar: 
                            {backButton: {visible: true}, 
                            visible: true , 
                            title : {text: "Invoice"}}
                        }
                    }})
                }}>
                <Image 
                    source={require("../Assets/invoice-icon.png")}
                    style={{height:20,width:20,resizeMode:"contain"}}
                />
                <View style={{marginTop:12}}>
                    <Text style={{fontSize:12,color:isDarkTheme?"#FFF":"#000"}}>
                        Invoice
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={.7}
                style={{flex:1,justifyContent:"center",alignItems:"center"}}
                onPress={() => {
                    Navigation.push("AppStack", {component: 
                        {passProps: {},
                        name: "Profile",
                        options: {topBar: 
                            {backButton: {visible: true}, 
                            visible: true , 
                            title : {text: "Profile"}}
                        }
                    }})
                }}>
                <Image 
                    source={require("../Assets/user-icon.png")}
                    style={{height:20,width:20,resizeMode:"contain"}}
                />
                <View style={{marginTop:12}}>
                    <Text style={{fontSize:12,color:isDarkTheme?"#FFF":"#000"}}>
                        Profile
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
  );
};

export default BottomBar;
