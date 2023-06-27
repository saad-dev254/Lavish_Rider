import React, {useEffect, useState} from "react";
import {Dimensions, Image, ScrollView, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {AppTheme} from "../AppTheme/AppTheme";
import {Navigation} from "react-native-navigation";
import Modal from 'react-native-modal';

const SideBar = (props) => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const {isModalVisible, toggleModal, userData, termsModalToggle} = props;
    const {width, height} = Dimensions.get('window');

    return (
        <View style={{flex:1}}>
            <Modal
                height={height}
                style={{margin:0}}
                width={width / 1.5}
                swipeDirection={"left"}
                isVisible={isModalVisible}
                animationIn={"slideInLeft"}
                statusBarTranslucent={true}
                onBackdropPress={toggleModal}
                animationOut={"slideOutLeft"}>
                <View style={{flex:1,backgroundColor:isDarkTheme?'#000':"#FFF"}}>
                    <ScrollView>
                        <TouchableOpacity 
                            activeOpacity={.7}
                            onPress={() => {
                                toggleModal();
                                Navigation.push("AppStack",{component:{name: "Profile", options: {topBar: {backButton:{visible: true}, visible: true, title: {text: "Profile"}}}}})
                            }}
                            style={{backgroundColor:AppTheme.ButtonGreenColor,height:260,justifyContent:"center",alignItems:"center"}}>
                            <View style={{height:100,width:100,alignItems:"center",borderRadius:100}}>
                                <Image
                                    style={{height:"100%",width:"100%",resizeMode:"contain",borderRadius:100}}
                                    source={{uri: userData?.profile === undefined || userData?.profile === null || userData?.profile === "" ? "https://www.pngkit.com/png/detail/428-4289289_accounts-missing-profile.png" : userData?.profile}}
                                />
                            </View>
                            <View style={{marginTop:12}}>
                                <Text style={{color:"#FFF",fontSize:16,textAlign:"center",fontWeight:"bold",textTransform:"capitalize"}}>
                                    {userData?.name}
                                </Text>
                                <Text style={{color:"#FFF",fontSize:13,textAlign:"center"}}>
                                    {userData?.email}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{paddingHorizontal:16}}>
                            <TouchableOpacity 
                                activeOpacity={.7}
                                onPress={toggleModal}
                                style={{flexDirection:"row",marginTop:20}}>
                                <View style={{justifyContent:"center"}}>
                                    <Image 
                                        source={require("../Assets/home-icon-2.png")}
                                        style={{height:20,width:20,resizeMode:"contain",tintColor:isDarkTheme?'#FFF':"#gray"}}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center",marginLeft:20}}>
                                    <Text style={{fontSize:16,color:isDarkTheme?'#FFF':"#gray",fontWeight:"700"}}>
                                        Home
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                activeOpacity={.7}
                                style={{flexDirection:"row",marginTop:20}}
                                onPress={() => {
                                    toggleModal();
                                    Navigation.push("AppStack",{component:{name:"Approval" , options: { topBar: { backButton:{ visible: true}, visible: true , title : { text : "Approvals"} } } } })
                                }}>
                                <View style={{justifyContent:"center"}}>
                                    <Image 
                                        source={require("../Assets/order-icon.png")}
                                        style={{height:20,width:20,resizeMode:"contain",tintColor:isDarkTheme?'#FFF':"#gray"}}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center",marginLeft:20}}>
                                    <Text style={{fontSize:16,color:isDarkTheme?'#FFF':"#gray",fontWeight:"700"}}>
                                        Approvals
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                activeOpacity={.7}
                                style={{flexDirection:"row",marginTop:20}}
                                onPress={() => {
                                    toggleModal();
                                    Navigation.push("AppStack",{component:{name:"AboutUs" , options: { topBar: { backButton:{ visible: true}, visible: true , title : { text : "About Us"} } } } })
                                }}>
                                <View style={{justifyContent:"center"}}>
                                    <Image 
                                        source={require("../Assets/about-icon.png")}
                                        style={{height:20,width:20,resizeMode:"contain",tintColor:isDarkTheme?'#FFF':"#gray"}}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center",marginLeft:20}}>
                                    <Text style={{fontSize:16,color:isDarkTheme?'#FFF':"#gray",fontWeight:"700"}}>
                                        About Us
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                activeOpacity={.7}
                                style={{flexDirection:"row",marginTop:20}}
                                onPress={() => {
                                    toggleModal();
                                    Navigation.push("AppStack",{component:{name:"PrivacyPolicy", options: { topBar: { backButton:{ visible: true}, visible: true , title : { text : "PrivacyPolicy"} } } } })
                                }}>
                                <View style={{justifyContent:"center"}}>
                                    <Image 
                                        source={require("../Assets/privacy-policy.png")}
                                        style={{height:20,width:20,resizeMode:"contain",tintColor:isDarkTheme?'#FFF':"#gray"}}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center",marginLeft:20}}>
                                    <Text style={{fontSize:16,color:isDarkTheme?'#FFF':"#gray",fontWeight:"700"}}>
                                        Privacy Policy
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                activeOpacity={.7}
                                style={{flexDirection:"row",marginTop:20}}
                                onPress={() => {
                                    toggleModal();
                                    Navigation.push("AppStack",{component:{name:"ContactUs" , options: { topBar: { backButton:{ visible: true}, visible: true , title : { text : "ContactUs"} } } } })
                                }}>
                                <View style={{justifyContent:"center"}}>
                                    <Image 
                                        source={require("../Assets/contact-icon.png")}
                                        style={{height:20,width:20,resizeMode:"contain",tintColor:isDarkTheme?'#FFF':"#gray"}}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center",marginLeft:20}}>
                                    <Text style={{fontSize:16,color:isDarkTheme?'#FFF':"#gray",fontWeight:"700"}}>
                                        Contact Us
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <View style={{borderTopWidth:1,borderTopColor:"#CCC",paddingVertical:10}}>
                        <Text style={{fontSize:16,color:isDarkTheme?'#FFF':"#gray",fontWeight:"bold",textAlign:"center"}}>
                            V1.0.0
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
  );
};

export default SideBar;
