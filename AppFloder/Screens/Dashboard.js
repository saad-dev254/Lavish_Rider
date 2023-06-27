import React, {useEffect, useState} from "react";
import {View, Text, Image, TouchableOpacity, Dimensions, Linking, ScrollView, Modal, StyleSheet, useColorScheme} from "react-native";
import {AppTheme} from "../AppTheme/AppTheme";
import {Navigation } from "react-native-navigation";
import SideBar from "../Components/SideBar";
import BottomBar from "../Components/BottomBar";
import Carousel from "react-native-banner-carousel";
import ImageLoad from 'react-native-image-placeholder';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = () => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const {width, height} = Dimensions.get('window');
    const [userData, setUserData] = useState({});
    const [sliderList, setSliderList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState("+971589152400");
    const [termsModal, setTermsModal] = useState(false);

    useEffect(() => {
        getUserData();
        getSlidersdHandle();
    }, []);
    const getUserData = async () => {
        const user_data = JSON.parse(await AsyncStorage.getItem("userData"));
        setUserData(user_data);
        const termsStatus = await AsyncStorage.getItem("termsStatus");
        if (termsStatus === null || termsStatus === "0") {
            setTermsModal(true);
        } else {
            setTermsModal(false);
        };
    };
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const getSlidersdHandle = () => {
        try {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            fetch("https://www.lavishdxb.com/api/get_slider", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result?.status === 200) {
                    setSliderList(result?.data);
                }
            }).catch((error) => {
                console.log("ERROR =====> ", error?.message);
            });
        } catch (error) {
            console.log("ERROR =====> ", error?.message);
        }
    };

    return (
        <View style={{flex:1,backgroundColor:isDarkTheme?"#000":"#FFFFFF"}}>
            <View style={{flexDirection:"row",paddingVertical:12,borderBottomColor:"#CCC",borderBottomWidth:1}}>
                <View style={{justifyContent:"center"}}>
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={toggleModal}
                        style={{paddingLeft:20}}>
                        <Image
                            source={require("../Assets/menu.png")}
                            style={{height:25,width:25,resizeMode:"cover",tintColor:isDarkTheme?"#FFF":"#000"}}
                        />
                    </TouchableOpacity>
                    <SideBar
                        userData={userData}
                        toggleModal={toggleModal}
                        isModalVisible={isModalVisible}
                        termsModalToggle={() => setTermsModal(!termsModal)}
                    />
                </View>
                <View style={{flex:1,justifyContent:"center"}}>
                    <Text style={{fontSize:22,color:isDarkTheme?"#FFF":"#000",fontWeight:"bold",textAlign:"center"}}>
                        Home
                    </Text>
                </View>
                <View style={{justifyContent:"center",alignItems:"flex-end"}}>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={{paddingRight:8}}
                        onPress={() => {
                            console.log("NOTIFICATION PRESS");
                            // Navigation.push("AppStack",{component:{name:"PrivacyPolicy", options: { topBar: { backButton:{ visible: true}, visible: true , title : { text : "PrivacyPolicy"} } } } })
                        }}>
                        <Image
                            source={require("../Assets/bell.png")}
                            style={{height:25,width:25,resizeMode:"cover",tintColor:isDarkTheme?"#FFF":"#000"}}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent:"center",alignItems:"flex-end"}}>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={{paddingRight:8}}
                        onPress={() => {
                            setTermsModal(!termsModal);
                            // Navigation.push("AppStack",{component:{name:"PrivacyPolicy", options: {topBar: { backButton:{ visible: true}, visible: true , title : { text : "PrivacyPolicy"} } } } })
                        }}>
                        <Image
                            source={require("../Assets/three-dot-menu.png")}
                            style={{height:25,width:25,resizeMode:"cover",tintColor:isDarkTheme?"#FFF":"#000"}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <View style={{marginBottom:30,marginTop:20}}>
                    <Carousel
                        index={0}
                        loop={false}
                        autoplay={false}
                        pageSize={width}>
                        {sliderList?.map((val, key) => {
                            return (
                                <ImageLoad
                                    key={key}
                                    blurRadius={1}
                                    borderRadius={16}
                                    resizeMode={"cover"}
                                    source={{uri: val?.photo}}
                                    style={{height:200,borderRadius:16,marginHorizontal:20}}
                                />
                            )
                        })}
                    </Carousel>
                </View>
                <View style={{flexDirection:"row",marginTop:30}}>
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={() => {
                            Navigation.push("AppStack",{component:{name:"PickupForm" , options: { topBar: { backButton:{ visible: true}, visible: true , title : { text : "Pickup Form"} } } } })
                        }}
                        style={{
                            flex: 1,
                            shadowRadius: 4,
                            shadowOpacity: 1.0,
                            borderColor: "#CCC",
                            alignItems: "center",
                            shadowColor: isDarkTheme?"#FFF":"#000",
                            flexDirection: "column",
                            shadowOffset: {width: 0, height: 5},
                            borderRightWidth: 1,
                        }}>
                        <View style={{alignItems:"center",padding:20}}>
                            <Image
                                source={require("../Assets/parcels.png")}
                                style={{width:45,height:45,resizeMode:"contain",marginBottom:12}}
                            />
                            <Text style={{fontSize:15,color:isDarkTheme?"#FFF":"#000"}}>
                                New Order / Pick Up
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        // onPress={handleDelettePressed}
                        style={{
                            flex: 1,
                            shadowRadius: 4,
                            shadowOpacity: 1.0,
                            alignItems: "center",
                            shadowColor: isDarkTheme?"#FFF":"#000",
                            flexDirection: "column",
                            shadowOffset: {width: 0, height: 5},
                        }}>
                        <View style={{alignItems:"center",padding:20}}>
                            <Image
                                source={require("../Assets/delivery-truck.png")}
                                style={{width:45,height:45,resizeMode:"contain",marginBottom:12}}
                            />
                            <Text style={{fontSize:15,color:isDarkTheme?"#FFF":"#000"}}>
                                Delievery
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:"row",marginVertical:12,marginHorizontal:24}}>
                    <View style={{flex:1,justifyContent:"center"}}>
                        <View style={{width:"92%",height:1.5,backgroundColor:"#CCC",alignSelf:"flex-start"}}></View>
                    </View>
                    <View style={{flex:1,justifyContent:"center"}}>
                        <View style={{width:"92%",height:1.5,backgroundColor:"#CCC",alignSelf:"flex-end"}}></View>
                    </View>
                </View>
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity
                        activeOpacity={.7}
                        // onPress={handleDelettePressed}
                        style={{
                            flex: 1,
                            shadowRadius: 4,
                            shadowOpacity: 1.0,
                            borderColor: "#CCC",
                            alignItems: "center",
                            shadowColor: isDarkTheme?"#FFF":"#000",
                            flexDirection: "column",
                            shadowOffset: {width: 0, height: 5},
                            borderRightWidth: 1,
                        }}>
                        <View style={{alignItems:"center",padding:20}}>
                            <Image
                                source={require("../Assets/cashless-payment.png")}
                                style={{width:45,height:45,resizeMode:"contain",marginBottom:12}}
                            />
                            <Text style={{fontSize:15,color:isDarkTheme?"#FFF":"#000"}}>
                                Payment
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={() => {
                            Linking.openURL(`whatsapp://send?text=&phone=${whatsappNumber}`);
                        }}
                        style={{
                            flex: 1,
                            shadowRadius: 4,
                            shadowOpacity: 1.0,
                            alignItems: "center",
                            shadowColor: isDarkTheme?"#FFF":"#000",
                            flexDirection: "column",
                            shadowOffset: {width: 0, height: 5},
                        }}>
                        <View style={{alignItems:"center",padding:20}}>
                            <Image
                                source={require("../Assets/whatsappp-logo.png")}
                                style={{width:45,height:45,resizeMode:"contain",marginBottom:12}}
                            />
                            <Text style={{fontSize:15,color:isDarkTheme?"#FFF":"#000"}}>
                                Customer Support
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomBar />
            {/* PRIVACY MODAL */}
            <Modal
                transparent={true}
                animationType="fade"
                statusBarTranslucent
                visible={termsModal}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeading}>
                            Terms & Condition
                        </Text>
                        <ScrollView>
                            <Text style={{fontSize:10,color:"gray"}}>
                                1: All delivery will be made in 48 hours.
                                {'\n'}{'\n'}
                                2: Customers are requested to examine garments at the time of delivery.
                                {'\n'}{'\n'}
                                3: We are not responsible for fastness/running of color/shrinkage/ damage to embellishments/ embroidery work on the garments during the process.
                                {'\n'}{'\n'}
                                3: Every effort will be made to remove stains, but LAVISH LAUNDRY will not be responsible for stubborn and unremovable stains.
                                {'\n'}{'\n'}
                                4: All articles are accepted at the customers' risk.
                                {'\n'}{'\n'}
                                5: Please note that we will not be responsible if the garments are not collected within 15 days from the date of scheduled delivery.
                                {'\n'}{'\n'}
                                6: We accept no liability for any loss or damage of the clothes arising due to fire, burglary, etc
                                {'\n'}{'\n'}
                                7. In case garment/ home linens get damaged in the process, we may consider payment of the compensation, which will be limited to 5 times the wash charge of the specific item.
                                {'\n'}{'\n'}
                                8: We may use the image of your clothes for promotional purpose.
                            </Text>
                        </ScrollView>
                        <TouchableOpacity
                            activeOpacity={.7}
                            onPress={() => {
                                setTermsModal(false);
                                AsyncStorage.setItem("termsStatus", "1");
                            }}
                            style={{
                                padding: 15,
                                marginTop: 20,
                                borderRadius: 6,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: AppTheme.ButtonGreenColor,
                            }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#ffffff',
                                fontWeight: '700',
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                            }}>
                                Accept
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: "#00000070",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    modalView: {
        backgroundColor: useColorScheme.theme==="dark"?"#FFF":"#FFF",
        borderRadius: 8,
        height: Dimensions.get("window").height/1.7,
        paddingVertical: 22,
        paddingHorizontal: 14,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeading: {
        fontSize: 22,
        color: useColorScheme.theme==="dark"?"#FFF":"#000",
        paddingBottom: 12,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "capitalize",
    },
})

export default Dashboard;