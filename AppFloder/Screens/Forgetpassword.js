import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View ,Image, Dimensions, Text , TextInput , TouchableOpacity, Keyboard, ActivityIndicator} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { AppTheme } from '../AppTheme/AppTheme';
import { SignIn } from '../Components/Api';
import { CustomTextfield } from '../Components/General';
import Loader from '../Components/Loader';

const Forgetpassword = (props) => {
    const {verifyMethod} = props;
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhonenumber] = useState("");
    const [phoneNumberValid, setPhonenumberValid] = useState("");

    const sendOtpHandle = () => {
        try {
            setLoading(true);
            Keyboard.dismiss();

            var requestOptions = {
                method: 'POST',
                redirect: 'follow'
            };

            fetch(`https://www.lavishdxb.com/api/sendotp?type=phone&number=${phoneNumber}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoading(false);
                console.log(result);
                Navigation.push("AppStack", { component: 
                    {passProps: {
                        routeName: "Signin",
                        phoneNumber: phoneNumber,
                        userData: {},
                    }, 
                    name: "VerifyOtp",
                    options: { 
                        topBar: {visible:false}
                    } 
                }})
            }).catch((error) => {
                setLoading(false);
                alert(error?.message);
            });
        } catch (error) {
            setLoading(false);
            alert(error?.message);
        }
    };

    return(
        <View style={{ flex: 1 }}>
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
            <View style={{ flex: 1, backgroundColor: "#FFF", paddingHorizontal: 20 }}>
                <Text style={{fontSize:28,marginTop:10,fontWeight:"bold",color:"#000"}}>Forgot your Password?</Text>
                <Text style={{fontSize:14,marginTop:30,color:"#000"}}>Enter your Phone Number to retrieve your password.</Text>
                <CustomTextfield
                    value={phoneNumber}
                    style={{marginTop:10}}
                    setValue={setPhonenumber}
                    keyboardType={"number-pad"}
                    placeholder={"Phone Number"}
                />
                {phoneNumberValid === "" ? null : 
                    <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{phoneNumberValid}</Text>
                }
                <TouchableOpacity 
                    style={{ 
                        marginTop: 30,
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
                    }} 
                    onPress={() => {
                        setPhonenumberValid('');
                        if (phoneNumber === "") {
                            setPhonenumberValid("Phone Numeber Required*");
                        } else {
                            sendOtpHandle();
                        }
                    }}>
                    {loading ? 
                        <ActivityIndicator color={"#FFF"} />
                    :    
                        <Text style={{ color: "white" }}>
                            Reset Password
                        </Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default Forgetpassword;