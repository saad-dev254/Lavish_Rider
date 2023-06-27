import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, Text, TextInput, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { AppTheme } from '../AppTheme/AppTheme';
import { CustomTextfield } from '../Components/General';


const SigninCreate = () => {

    const [password, setPassword] = useState('')
    const [userName, setuserName] = useState('')

    return (

        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: AppTheme.ButtonGreenColor, alignItems: 'flex-end' }}>
                <View style={{ flex: 1 }} />
                <View style={{ width: '80%', marginBottom: 60, alignItems: 'center', backgroundColor: "white", paddingBottom: 30, paddingHorizontal: 50, borderRadius: 30, alignSelf: "center" }}>
                    <Text style={{ alignSelf: "center", marginLeft: 20, fontSize: 28, fontWeight: "bold", marginTop: 20 }}>Easy To Use</Text>
                    <TouchableOpacity 
                        activeOpacity={.7}
                        style={{ width: "100%", backgroundColor: AppTheme.ButtonGreenColor, marginTop: 20, height: 42, borderRadius: 20, alignItems: "center", justifyContent: "center" }} 
                        onPress={() => {
                            Navigation.push("AppStack",{component:{name:"Signin" , options: {  topBar: { backButton:{ visible: false}, visible: false , title : { text : ""} } } } })
                        }}>
                        <Text style={{ color: "white" }}>
                            Sign In
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={.7}
                        style={{ width: "100%", backgroundColor: "white" , borderWidth : 1 , borderColor : AppTheme.ButtonGreenColor, marginTop: 20, height: 42, borderRadius: 20, alignItems: "center", justifyContent: "center" }} 
                        onPress={() => {
                            Navigation.push("AppStack",{component:{name:"CreateAccount" , options: {  topBar: { backButton:{ visible: false}, visible: false , title : { text : ""} } } } })
                        }}>
                        <Text style={{ color: AppTheme.ButtonGreenColor }}>
                            Create an account
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>

    )
}


export default SigninCreate