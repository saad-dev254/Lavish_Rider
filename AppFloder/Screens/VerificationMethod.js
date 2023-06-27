import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { AppTheme } from '../AppTheme/AppTheme';
import { Navigation } from 'react-native-navigation';

const VerificationMethodSelector = (props) => {
    const {routeName, userData} = props;
    const [selectedValue, setSelectedValue] = useState('phone');
    const [otpLoader, setOtpLoader] = useState(false);

    const handleRadioButtonPress = (value) => {
        setSelectedValue(value);
    };
    const sendOtpHandle = () => {
        try {
            setOtpLoader(true);
            var formdata = new FormData();

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            const receipient = selectedValue === "phone" ? userData?.mobile : userData?.email;
            fetch(`https://www.lavishdxb.com/api/sendotp?type=${selectedValue}&receipient=${receipient}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setOtpLoader(false);
                alert(result?.message);
                if (result?.code === 200) {
                    Navigation.push("AppStack", { component: 
                        {passProps: {
                            verifyMethod: selectedValue,
                            verifyData: receipient,
                            userData: userData,
                            routeName: routeName,
                        }, 
                        name: "VerifyOtp",
                        options: { 
                            topBar: {visible:false}
                        } 
                    }})
                }
            }).catch((error) => {
                setOtpLoader(false);
                alert(error?.message);
            });
        } catch (error) {
            setOtpLoader(false);
            alert(error?.message);
        }
    };

    return (
        <View style={{flex:1,backgroundColor:"white"}}>
            <View style={{height:210,width:"100%",alignItems:"center",justifyContent:"center"}}>
                <Image
                    blurRadius={1}
                    source={require('../Assets/signin.png')}
                    style={{height:"100%",width:"100%",resizeMode:"contain"}}
                />
                {/* <View style={{height:"100%",width:"100%",position:"absolute",top:0,left:0,right:0,bottom:0,alignItems:"center",justifyContent:"center",zIndex:99999}}>
                    <Image
                        source={require("../Assets/lavish-laoundry.png")}
                        style={{height:160,width:"100%",resizeMode:"contain"}}
                    />
                </View> */}
            </View>
            <View style={{paddingHorizontal:20}}>
                <Text style={{fontSize:28,marginTop:20,marginBottom:20,fontWeight:"bold"}}>
                    Select Verification Method
                </Text>
                <RadioButton.Group
                    value={selectedValue}
                    onValueChange={handleRadioButtonPress}>
                    <View>
                        <RadioButton.Item
                            label="Phone"
                            value="phone"
                            onPress={() => handleRadioButtonPress('phone')}
                        />
                    </View>
                    <View>
                        <RadioButton.Item
                            label="Email"
                            value="email"
                            onPress={() => handleRadioButtonPress('email')}
                        />
                    </View>
                </RadioButton.Group>
                <TouchableOpacity
                    activeOpacity={.7}
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
                    }} 
                    onPress={() => {
                        if (routeName === "Signin") {
                            Navigation.push("AppStack", { component: 
                                {passProps: {
                                    verifyMethod: selectedValue,
                                }, 
                                name: "Forgetpassword",
                                options: { 
                                    topBar: {visible:false}
                                } 
                            }})
                        } else {
                            sendOtpHandle();
                        }
                    }}>
                    {otpLoader ? 
                        <ActivityIndicator color={"#FFF"} />
                    :
                        <Text style={{ color: "white" }}>
                            {routeName === "Signin" ? "Confirm" : "Send Otp"}
                        </Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VerificationMethodSelector;