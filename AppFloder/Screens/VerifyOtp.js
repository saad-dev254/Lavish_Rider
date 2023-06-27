import React, {useState, useEffect, useRef} from "react";
import {StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard, ActivityIndicator, Image, Platform, ToastAndroid, useColorScheme} from "react-native";
import { AppTheme } from "../AppTheme/AppTheme";
import Loader from "../Components/Loader";
import { Navigation } from 'react-native-navigation';
import auth from '@react-native-firebase/auth';

const VerifyOtp = (props) => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const {phoneNumber, userData, routeName, verificationId} = props;
    const [loader, setLoader] = useState(false);
    const [otpLoader, setOtpLoader] = useState(false);
    const [userNumber, setUserNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [codeValid, setCodeValid] = useState("");
    const [verifyID, setVerifyID] = useState(verificationId);

    useEffect(() => {
        setLoader(false);
        const userMobileNo = phoneNumber;
        const result = userMobileNo === null || userMobileNo === undefined ? null : 
        userMobileNo.substring(0, 3) + "******" + userMobileNo.substring(10);
        setUserNumber(result);
    }, []);
    const validateField = () => {
        setCodeValid("");
        if (verificationCode === "") {
            setCodeValid("Enter your verification code");
            return false
        }
        return true
    };
    const verifyOtpHandle = async () => {
        try {
            if (validateField()) {
                setLoader(true);
                Keyboard.dismiss();

                const credential = auth.PhoneAuthProvider.credential(verifyID, verificationCode);
                const userCredential = await auth().signInWithCredential(credential);
                const user = userCredential.user;
                console.log('User', user);
                if (routeName === "Signin") { 
                    setLoader(false);
                    Navigation.push("AppStack", { component: 
                        {passProps: {
                            phoneNumber: phoneNumber,
                        }, 
                        name: "NewPassword",
                        options: { 
                            topBar: {visible:false}
                        } 
                    }})
                } else {
                    signUpHandle();
                }
            };
        } catch(error) {
            setLoader(false);
            alert(error?.message);
        }
    };
    const sendOtpHandle = () => {
        try {
            setOtpLoader(true);
            Keyboard.dismiss();

            auth().signInWithPhoneNumber(phoneNumber)
            .then((response) => {
                setOtpLoader(false);
                setVerifyID(response?.verificationId);
                ToastAndroid.show("Otp has been successfully send", ToastAndroid.SHORT);
            }).catch((error) => {
                setOtpLoader(false);
                alert(error?.message);
            });
        } catch (error) {
            setOtpLoader(false);
            alert(error?.message);
        }
    };
    const signUpHandle = async () => {
        try {
            var requestOptions = {
                method: 'POST',
                redirect: 'follow'
            };
            
            fetch(`https://www.lavishdxb.com/api/register?name=${userData?.userName}&email=${userData?.email}&password=${userData?.password}&country code=${userData?.postCode}&mobile=${userData?.mobile}&fcm_token${userData?.fcmToken}&smartphone=${Platform.OS}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
               if (result?.status == 200) {
                    Navigation.push("AppStack", { component: { name: "Signin", options: { topBar: { visible: false } } } });
                    // const userData = {...result?.userdata, token: result?.token};
                    // AsyncStorage.setItem("userData", JSON.stringify(userData));
                    // Navigation.push("AppStack",{component:{name:"Workshop" , options: {  topBar: { backButton:{ visible: false}, visible: false , title : { text : ""} } } } })
                } else if (result?.status == 400) {
                    alert(result?.error);
                } else if (result?.error == 400) {
                    alert(result?.error);
                }
            }).catch((error) => {
                setLoader(false);
                alert(error?.message);
            });
        } catch (error) {
            setLoader(false);
            alert(error?.message);
        }
    };

    return (
        <View style={[styles.continer,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}>
            <View style={{height:210,width:"100%",alignItems:"center",justifyContent:"center"}}>
                {/* <Image
                    blurRadius={1}
                    source={require('../Assets/signin.png')}
                    style={{height:"100%",width:"100%",resizeMode:"contain"}}
                /> */}
                <View style={{height:"100%",width:"100%",position:"absolute",top:0,left:0,right:0,bottom:0,alignItems:"center",justifyContent:"center",zIndex:99999}}>
                    <Image
                        source={require("../Assets/lavish-laoundry.png")}
                        style={{height:160,width:"100%",resizeMode:"contain"}}
                    />
                </View>
            </View>
            <View style={styles.contentSection}>
                <Text style={{fontSize:28,marginTop:10,marginBottom:20,fontWeight:"bold",textAlign:"center",color:isDarkTheme?"#FFF":"#000"}}>
                    We have sent an OTP to
                    your Phone Number
                </Text>
                <Text style={[styles.detail,{color:isDarkTheme?"#7C7D7E":"#000"}]}>
                    Please check your Phone Number {`${userNumber} `}
                    continue to reset your password
                </Text>
            </View>
            <View style={styles.formSection}>
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <TextInput
                        value={verificationCode}
                        style={styles.inputStyle}
                        placeholderTextColor={"#CCC"}
                        onChangeText={(val) => setVerificationCode(val)}
                    />
                </View>
                {codeValid === "" ? null : 
                    <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{codeValid}</Text>
                }
                <TouchableOpacity
                    activeOpacity={.7}
                    onPress={verifyOtpHandle}
                    style={styles.verifyButtonStyle}>
                    {loader ?
                        <ActivityIndicator color={"#FFF"} />
                    :
                        <Text style={{color:"#FFF"}}>
                            Verify
                        </Text>
                    }
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                activeOpacity={.5}
                onPress={sendOtpHandle} 
                style={{flexDirection:"row",marginTop:30}}>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                    <Text style={{color:"#7C7D7E"}}>
                        Didn't Receive?
                    </Text>
                </View>
                <View style={{flex:.9,alignItems:"flex-start",justifyContent:"center"}}>
                    <Text style={{color:"red",fontWeight:"bold"}}>
                        {"  Click Here"}
                    </Text>
                </View>
            </TouchableOpacity>
            <Loader loading={otpLoader} />
        </View>
    )
}

const styles = StyleSheet.create({
    continer: {
        flex: 1,
    },
    contentSection: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    backButtonStyle: {
        backgroundColor: "#FFF",
        borderRadius: 100,
        height: 30,
        width: 30,
        marginLeft:20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    loginHeading: {
        fontSize: 22,
        lineHeight: 30,
        textAlign: "center",
        textTransform: "capitalize",
        color: "#000",
    },
    detail: {
        fontSize: 14,
        marginTop: 14,
        color: "#7C7D7E",
        textAlign: "center",
        marginHorizontal: 70,
    },
    formSection: {
        marginTop: 30,
        marginHorizontal: 20,
    },
    inputStyle: {
        width: "100%",
        height: 60,
        fontSize: 26,
        borderRadius: 10,
        fontWeight: "800",
        alignSelf: "center",
        textAlign: "center",
        alignItems: "center",
        paddingHorizontal: 18,
        color: "#000",
        justifyContent: "center",
        backgroundColor: "#F2F2F2",
        borderColor: useColorScheme.theme ? "#FFF" : "#FFF",
        borderWidth: 1,
    },
    otpBoxMain: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 20,
        backgroundColor: "#F2F2F2",
    },
    otpInputStyle: {
        fontSize: 25,
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
    },
    verifyButtonStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        width:"100%",
        backgroundColor:AppTheme.ButtonGreenColor,
        marginTop:20,
        height:42,
        borderRadius:12,
        alignItems:"center",
        justifyContent:"center"
    }
})

export default VerifyOtp;