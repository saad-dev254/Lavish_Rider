import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, ToastAndroid, useColorScheme } from 'react-native';
import { AppTheme } from '../AppTheme/AppTheme';
import { CustomTextfield } from '../Components/General';
import { Navigation } from 'react-native-navigation';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import {CountryPicker} from "react-native-country-codes-picker";

const CreateAccount = () => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const [otpLoader, setOtpLoader] = useState(false);
    const [userName, setuserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setmobile] = useState('');
    const [postCode, setpostCode] = useState('');
    const [fcmToken, setFcmToken] = useState("");
    const [show, setShow] = useState(false);
    const [userNameValid, setuserNameValid] = useState('');
    const [emailValid, setEmailValid] = useState('');
    const [passwordValid, setPasswordValid] = useState('');
    const [confirmPasswordValid, setConfirmPasswordValid] = useState('');
    const [mobileValid, setmobileValid] = useState('');
    const [postCodeValid, setpostCodeValid] = useState('');
    const [passwordIsSecure, setPasswordIsSecure] = useState(true);
    const [confirmPasswordIsSecure, setConfirmPasswordIsSecure] = useState(true);

    useEffect(() => {
        getFCMToken();
    }, []);
    const getFCMToken = async () => {
        const token = await messaging().getToken();
        setFcmToken(token);
        console.log('FCM Token:', token);
    };
    const validateField = () => {
        setuserNameValid('');
        setEmailValid('');
        setPasswordValid('');
        setConfirmPasswordValid('');
        setmobileValid('');
        setpostCodeValid('');

        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/;
        
        if (userName === '') {
            setuserNameValid("Full Name Required*");
            return false;
        } else if (email === '') {
            setEmailValid("Email Required*");
            return false;
        } else if (emailValidation.test(email) === false) {
            setEmailValid("Enter Valid Email Address*");
            return false;
        } else if (password === '') {
            setPasswordValid("Password Required*");
            return false;
        } else if (confirmPassword === '') {
            setConfirmPasswordValid("Confirm Password Required*");
            return false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordValid("Password and Confirm Password does not match");
            return false;
        } else if (postCode === '') {
            setpostCodeValid("Country Code Required*");
            return false;
        } else if (mobile === '') {
            setmobileValid("Mobile No Required*");
            return false;
        }
        return true;
    };
    const sendOtpHandle = async () => {
        try {
            if (validateField()) {
                setOtpLoader(true);
                var number = mobile;
                if (number.charAt(0) === '0') {
                    number = number.slice(1);
                };
                const phoneNumber = `${postCode}${number}`;
                auth().signInWithPhoneNumber(phoneNumber)
                .then((response) => {
                    setOtpLoader(false);
                    ToastAndroid.show("Otp has been successfully send", ToastAndroid.SHORT);
                    const userData = {
                        userName: userName,
                        email: email,
                        password: password,
                        postCode: postCode,
                        mobile: mobile,
                        fcmToken: fcmToken,
                    };
                    Navigation.push("AppStack", { component: 
                        {passProps: {
                            routeName: "Signup",
                            phoneNumber: phoneNumber,
                            userData: userData,
                            verificationId: response?.verificationId,
                        }, 
                        name: "VerifyOtp",
                        options: { 
                            topBar: {visible:false}
                        } 
                    }});
                }).catch((error) => {
                    setOtpLoader(false);
                    alert(error?.message);
                });
            }
        } catch (error) {
            setOtpLoader(false);
            alert(error?.message);
        }
    };

    return (
        <View style={{flex:1,backgroundColor:isDarkTheme?"#000":"#FFF"}}>
            <ScrollView>
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
                <View style={{ width: '100%', backgroundColor: isDarkTheme?"#000":"#FFF", paddingHorizontal: 20, borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}>
                    <Text style={{fontSize:28,marginTop:10,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}}>Tell us about you</Text>
                    <Text style={{ alignSelf: "flex-start", fontSize: 14, marginTop: 20,color:isDarkTheme?"#FFF":"#000" }}>Full Name</Text>
                    <CustomTextfield value={userName} setValue={setuserName} style={{ marginTop: 10 }} placeholder="Full Name" />
                    {userNameValid === "" ? null : 
                        <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{userNameValid}</Text>
                    }
                    <Text style={{ alignSelf: "flex-start", fontSize: 14, marginTop: 20,color:isDarkTheme?"#FFF":"#000" }}>Email</Text>
                    <CustomTextfield value={email} setValue={setEmail} style={{ marginTop: 10 }} placeholder="Email" />
                    {emailValid === "" ? null : 
                        <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{emailValid}</Text>
                    }
                    <Text style={{ alignSelf: "flex-start", fontSize: 14, marginTop: 20, color:isDarkTheme?"#FFF":"#000" }}>Password</Text>
                    <CustomTextfield
                        password={true}
                        value={password}
                        placeholder="Password"
                        setValue={setPassword}
                        style={{marginTop:10}}
                        isSecure={passwordIsSecure}
                        passPress={() => setPasswordIsSecure(!passwordIsSecure)}
                    />
                    {passwordValid === "" ? null : 
                        <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{passwordValid}</Text>
                    }
                    <Text style={{ alignSelf: "flex-start", fontSize: 14, marginTop: 20, color:isDarkTheme?"#FFF":"#000" }}>Confirm Password</Text>
                    <CustomTextfield
                        password={true}
                        style={{marginTop:10}}
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        placeholder="Confirm Password"
                        isSecure={confirmPasswordIsSecure}
                        passPress={() => setConfirmPasswordIsSecure(!confirmPasswordIsSecure)}
                    />
                    {confirmPasswordValid === "" ? null : 
                        <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{confirmPasswordValid}</Text>
                    }
                    <View style={{flexDirection:"row",marginTop:20}}>
                        <View style={{flex:.5,justifyContent:"center",marginRight:6}}>
                            <Text style={{fontSize:14,color:isDarkTheme?"#FFF":"#000"}}>Country Code</Text>
                            <TouchableOpacity 
                                activeOpacity={.7}
                                onPress={() => setShow(!show)}
                                style={{
                                marginTop: 10,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 5,
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                paddingVertical:10}}>
                                <Text style={{color:postCode===""?"#CCC":"#000"}}>
                                {postCode === "" ? "Country Code" : postCode}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,justifyContent:"center",marginLeft:6}}>
                            <Text style={{fontSize:14,color:isDarkTheme?"#FFF":"#000"}}>Mobile No</Text>
                            <CustomTextfield
                                value={mobile}
                                setValue={setmobile}
                                style={{marginTop:10}}
                                placeholder="Mobile No"
                                keyboardType={"number-pad"}
                            />
                        </View>
                    </View>
                    {postCodeValid === "" ? null : 
                        <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{postCodeValid}</Text>
                    }
                    {mobileValid === "" ? null : 
                        <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{mobileValid}</Text>
                    }
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={sendOtpHandle}
                        style={{ 
                            marginTop: 20,
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
                            marginBottom:20,
                            height:42,
                            borderRadius:12,
                            alignItems:"center",
                            justifyContent:"center"
                        }}>
                        {otpLoader ? 
                            <ActivityIndicator color={"#FFF"} />
                        :
                            <Text style={{color:"#FFF"}}>
                                Register
                            </Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={{alignSelf:"center"}}
                        onPress={() => {
                            Navigation.push("AppStack", { component: { name: "Signin", options: { topBar: { visible: false } } } })
                        }}>
                        <Text>
                            <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"600"}}>
                                Already have an account? 
                            </Text>
                            <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:16,fontWeight:"bold"}}>
                                {" Sign In"}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* For showing picker just put show state to show prop */}
            <CountryPicker
                show={show}
                style={{
                modal: {
                    height: 500,
                },
                }}
                onBackdropPress={() => setShow(false)}
                // when picker button press you will get the country object with dial code
                pickerButtonOnPress={(item) => {
                    setpostCode(item.dial_code);
                    setShow(false);
                }}
            />
        </View>
    )
}

const SuccessPopup = ({ visible, setVisible }) => {

    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}

        >
            <View style={{ backgroundColor: "rgba(0,0,0,0.8)", flex: 1, alignItems: "center", justifyContent: "center" }}>


                <View style={{ width: "80%", height: "50%", borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: '#FFF' }}>

                    <Image style={{ width: 100, height: 100 }} source={require("../Assets/Vector.png")} resizeMode="contain" />


                    <Text style={{ alignSelf: "flex-start", fontSize: 14, marginTop: 50, fontWeight: "bold", fontSize: 18, textAlign: "center", alignSelf: "center" }}>Congratulations Account Created Successfully</Text>

                    <TouchableOpacity style={{ width: "70%", backgroundColor: AppTheme.ButtonGreenColor, marginTop: 50, height: 42, borderRadius: 20, alignItems: "center", justifyContent: "center" }} onPress={() => {

                        setVisible(false)

                        setTimeout(() => {

                            Navigation.push("AppStack", { component: { name: "Workshop", options: { topBar: { backButton: { visible: true }, visible: true, title: { text: "" } } } } })

                        }, 100);

                    }}>
                        <Text style={{ color: "#FFF", fontSize: 18 }}>
                            OK
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )

}

export default CreateAccount