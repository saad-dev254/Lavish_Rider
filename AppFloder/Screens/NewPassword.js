import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View ,Image, Dimensions, Text , TextInput , TouchableOpacity, Keyboard, ActivityIndicator} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { AppTheme } from '../AppTheme/AppTheme';
import { SignIn } from '../Components/Api';
import { CustomTextfield } from '../Components/General';
import Loader from '../Components/Loader';

const NewPassword = (props) => {
    const {phoneNumber} = props;
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordIsSecure, setPasswordIsSecure] = useState(true);
    const [confirmPasswordIsSecure, setConfirmPasswordIsSecure] = useState(true);
    const [passwordValid, setPasswordValid] = useState('');
    const [confirmPasswordValid, setConfirmPasswordValid] = useState('');

    const updatePassword = () => {
        try {
            setLoading(true);
            Keyboard.dismiss();

            var requestOptions = {
                method: 'POST',
                redirect: 'follow'
            };

            fetch(`https://www.lavishdxb.com/api/update_password?number=${phoneNumber}&new password=${password}&new confirm password=${confirmPassword}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoading(false);
                console.log(result);
                if (result?.code === 200) {
                    alert(result?.message);
                    Navigation.push("AppStack", { component: { name: "Signin", options: { topBar: { visible: false } } } })
                } else {
                    alert("Password does not changed")
                }
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
            <View style={{ flex: 1, backgroundColor: "#FFF", paddingHorizontal: 20 }}>
                <Text style={{fontSize:28,marginTop:20,fontWeight:"bold"}}>New Password</Text>
                <CustomTextfield
                    password={true}
                    value={password}
                    setValue={setPassword}
                    style={{marginTop:20}} 
                    placeholder={"Password"}
                    isSecure={passwordIsSecure}
                    passPress={() => setPasswordIsSecure(!passwordIsSecure)}
                />
                {passwordValid === "" ? null : 
                    <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{passwordValid}</Text>
                }
                <CustomTextfield
                    password={true}
                    style={{marginTop:20}}
                    value={confirmPassword}
                    placeholder={"Confirm Password"}
                    setValue={setConfirmPassword}
                    isSecure={confirmPasswordIsSecure}
                    passPress={() => setConfirmPasswordIsSecure(!confirmPasswordIsSecure)}
                />
                {confirmPasswordValid === "" ? null : 
                    <Text style={{alignSelf: "flex-start", fontSize: 14, color:"red",fontWeight:"600" }}>{confirmPasswordValid}</Text>
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
                        setPasswordValid("");
                        setConfirmPasswordValid("");
                        if (password === "") {
                            setPasswordValid("Please enter your Password");
                        } else if (confirmPassword === "") {
                            setConfirmPasswordValid("Please enter your Confirm Password");
                        } else if (password !== confirmPassword) {
                            setConfirmPasswordValid("Password and Confirm Password does not match");
                        } else {
                            updatePassword();
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


export default NewPassword;