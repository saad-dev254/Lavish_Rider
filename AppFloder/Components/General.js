import React from "react";
import { Dimensions, View , Image , TextInput, Text, TouchableOpacity } from "react-native";
import { Navigation } from "react-native-navigation";

export const ScreenWidth = Dimensions.get("screen").width
export const Screenheight = Dimensions.get("screen").height
 
import Toast from 'react-native-toast-message';



export const GoToNextController =(VcName) => {

   Navigation.push("AppStack", { component: { name: VcName, options: { topBar: { visible: true } } } })

  }


export const CustomTextfield = ({ style, placeholder, editable, isSecure , image , value, setValue, password, passPress, keyboardType }) => {

   return (

        <View style={{ alignItems: "center", flexDirection: "row", width: "100%", height: 40, borderRadius: 6, borderColor: "lightgray", borderWidth: 1, ...style }} >
            <View style={{flex:1}}>
                <TextInput 
                    value={value} 
                    onChangeText = {(t)=>{setValue(t)}} 
                    style={{width:"100%",marginLeft:10}} 
                    placeholder={placeholder} 
                    secureTextEntry={isSecure}
                    keyboardType={keyboardType}
                    placeholderTextColor={"#CCC"}
                    editable={editable}
                />
            </View>
            {password ? 
                <TouchableOpacity
                    activeOpacity={.7}
                    onPress={passPress}
                    style={{marginRight:12}}
                >
                    {isSecure? 
                        <Image
                            source={require("../Assets/view.png")}
                            style={{height:18,width:18,resizeMode:"contain"}}
                        />
                    :
                        <Image
                            source={require("../Assets/hide.png")}
                            style={{height:18,width:18,resizeMode:"contain"}}
                        />
                    }
                </TouchableOpacity>
            :null}
       </View>
   )
}




export const CustomTextfieldWithRIcon = ({ style, placeholder , image , value, setValue }) => {

   return (

       <View style={{ alignItems: "center", flexDirection: "row", width: "100%", height: 40, borderRadius: 5, borderColor: "lightgray", borderWidth: 1, ...style }} >
           <TextInput value={value} onChangeText = {(t)=>{setValue(t)}} style={{ width: "85%", marginLeft: 10 }} placeholder={placeholder}/>
           <Image style={{ width: 20, height: 20, marginLeft: 10 }} source={image} />


       </View>
   )
}

export const CustomTextfieldBlank = ({ style, placeholder, isSecure  , value, setValue }) => {

   return (

       <View style={{ alignItems: "center", flexDirection: "row", width: "100%", height: 40, borderRadius: 5, borderColor: "lightgray", borderWidth: 1, ...style }} >
            <TextInput value={value} onChangeText = {(t)=>{setValue(t)}} style={{ width: "60%", marginLeft: 10 }} placeholder={placeholder} secureTextEntry={isSecure}/>


       </View>
   )
}

export const ShowToast = (message) =>{
   
    Toast.show({text1:message})
     
}