import React, {useEffect, useState} from 'react';
import { View, Image, Text, TouchableOpacity, useColorScheme} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { AppTheme } from '../AppTheme/AppTheme';
import { SignIn } from '../Components/Api';
import { CustomTextfield, GoToNextController } from '../Components/General';
import Loader from '../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const Signin = () => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    AsyncStorage.setItem("welcomeScreen", "1");
    const [password, setPassword] = useState('');
    const [userName, setuserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSecure, setIsSecure] = useState(true);
    const [fcmToken, setFcmToken] = useState("");
    const [passwordValid, setPasswordValid] = useState('');
    const [userNameValid, setuserNameValid] = useState('');
    const [passwordIsSecure, setPasswordIsSecure] = useState(true);

    useEffect(() => {
        getFCMToken();
    }, []);
    const validateField = () => {
        setuserNameValid('');
        setPasswordValid('');
        
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/;
        
        if (userName === "") {
            setuserNameValid("Email Required*");
            return false;
        } else if (emailValidation.test(userName) === false) {
            setuserNameValid("Enter Valid Email Address*");
            return false;
        } else if (password === "") {
            setPasswordValid("Password Required*");
            return false;
        }
        return true;
    };
    const signInHandle = async () => {
        try {
            if (validateField()) {
                setLoading(true);
                var requestOptions = {
                    method: 'POST',
                    redirect: 'follow'
                };
                
                fetch(`https://www.lavishdxb.com/api/login/rider?email=${userName}&password=${password}&fcm_token=${fcmToken}`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setLoading(false);
                    if (result?.code === 200) {
                        AsyncStorage.setItem("accessToken", JSON.stringify(result?.token));
                        AsyncStorage.setItem("userData", JSON.stringify(result?.userdata));
                        Navigation.push("AppStack", {component: 
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
                    } else if (result?.code === 401) {
                        alert(result?.error);
                    } else {
                        alert(result?.error);
                    }
                }).catch((error) => {
                    setLoading(false);
                    console.log("ERROR =====> ", error?.message);
                });
            }
        } catch (error) {
            setLoading(false);
            console.log("ERROR =====> ", error?.message);
        }
    };
    const getFCMToken = async () => {
        const token = await messaging().getToken();
        setFcmToken(token);
        console.log('FCM Token:', token);
    };

    return(
        <View style={{flex:1}}>
            <View style={{width:'100%',backgroundColor:isDarkTheme?"balck":"white",height:'70%',borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
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
                <View style={{paddingHorizontal:20}}>
                    <Text style={{fontSize:28,marginTop:10,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}}>Sign In</Text>
                    <Text style={{fontSize:16,marginTop:20,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}}>Email</Text>
                    <CustomTextfield
                        value={userName}
                        setValue={setuserName}
                        style={{marginTop:10}}
                        placeholder="Email address"
                    />
                    {userNameValid === "" ? null : 
                        <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{userNameValid}</Text>
                    }
                    <Text style={{fontSize:16,marginTop:20,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}}>Password</Text>
                    <CustomTextfield
                        value={password}
                        setValue={setPassword}
                        style={{marginTop:10}} 
                        placeholder="Password"
                        password={true}
                        isSecure={passwordIsSecure}
                        passPress={() => setPasswordIsSecure(!passwordIsSecure)}
                    />
                    {passwordValid === "" ? null : 
                        <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{passwordValid}</Text>
                    }
                    {/* <TouchableOpacity
                        activeOpacity={.7}
                        style={{alignSelf:"flex-start",marginTop:10}} 
                        onPress={() => {
                            Navigation.push("AppStack", { component: 
                                {passProps: { },
                                name: "Forgetpassword",
                                options: { 
                                    topBar: {visible:false}
                                } 
                            }})
                        }}>
                        <Text style={{color:"#F5B644"}}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={signInHandle}
                        style={{
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
                        }}>
                        <Text style={{ color: "white" }}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        activeOpacity={.7}
                        style={{alignSelf:"center",paddingVertical:20}}
                        onPress={() => {
                            Navigation.push("AppStack",{component:{name:"CreateAccount" , options: {  topBar: { backButton:{ visible: false}, visible: false , title : { text : ""} } } } })
                        }}>
                        <Text>
                            <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"600"}}>
                                Don’t have an account?
                            </Text>
                            <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:16,fontWeight:"bold"}}>
                                {" Sign Up"}
                            </Text>
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </View>
            <Loader loading={loading}/>
        </View>
    )
}


export default Signin