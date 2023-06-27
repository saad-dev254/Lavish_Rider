

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View ,Image, Dimensions, Text , TextInput , TouchableOpacity} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { AppTheme } from '../AppTheme/AppTheme';
import { SignIn } from '../Components/Api';
import { CustomTextfield, ShowToast } from '../Components/General';
import Loader from '../Components/Loader';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const OTP = () => {

    const [password, setPassword] = useState('')
    const [userName, setuserName] = useState('')
    const [loading, setLoading] = useState(false);
    const CELL_COUNT = 4;
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [codeField, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const apiPost = async (s) => {


        setLoading(true)
       const params = JSON.stringify({

       });

       let data = {
           email: userName,
           password: password
            
       }
       const formData = new FormData();
       for (var key of Object.keys(data)) {
           formData.append(key, data[key])
       }
       // console.log(JSON.stringify(data, null, 2));
       // const formData = new FormData();
       // formData.append(JSON.stringify(data));


       console.log(`params =`, formData)
       console.log(`SignUp Url =`, SignIn)

       

       axios.post(
           SignIn,
           // { ...data },
           formData,
            )
           .then(_data => {

               console.log("DATA");
               console.log(JSON.stringify(_data.data, null, 2));
               setLoading(false)

                if (_data.data.status == 400){
                   alert(_data.data.message)

                }
           })
           .catch(e => {
               console.log(`Error =`, JSON.stringify(e))
               setLoading(false)


           })
   }


    return(

        <View style={{ flex: 1 }}>
        {/* <Image style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height, position: "absolute", top: -90, right: 0, marginLeft: 10 }} resizeMode="stretch"  /> */}
        <View style={{ flex: 1, alignItems: "center" , backgroundColor : AppTheme.ButtonGreenColor}}>

 
            <View style={{width : '100%', alignItems: 'center' , backgroundColor : "white" , height : '70%' , paddingHorizontal : 50 , borderBottomRightRadius : 30 , borderBottomLeftRadius : 30}}>
            <Text style={{ alignSelf: "center", marginLeft: 20, fontSize: 28  , marginTop : 60}}>OTP</Text>

              <CodeField
        ref={ref}
        {...codeField}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={t => {
            setValue(t)
        }}
        cellCount={CELL_COUNT}
        rootStyle={{backgroundColor:"white" , width:250 , height:50 , alignItems : "center" , marginTop : 80}}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
            <Text
                key={index}
                style={{backgroundColor:"red" , width : 50 , height:50 , borderRadius : 5 , fontSize : 24 , padding : 10}}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
        )}
    />
                <CustomTextfield value={userName} setValue={setuserName} style={{ marginTop: 20  } } placeholder="Email address"   />
                <CustomTextfield value={password} setValue={setPassword} style={{ marginTop: 20 }} placeholder="Password" isSecure={true}  />

                <TouchableOpacity style={{ alignSelf: "flex-start", marginTop: 10 }}>
                    {/* <Text style={{ color: "#F5B644" }}>
                        Forget Password?
                    </Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={{ width: "90%", backgroundColor: AppTheme.ButtonGreenColor, marginTop: 20, height: 42, borderRadius: 20, alignItems: "center", justifyContent: "center" }} onPress={() => {

                    // if (userName.length == 0) {
                    //     console.log("userName.length")

                    //     ShowToast("Please enter company Name")

                    // }
                    // else if (password.length == 0) {
                    //     console.log("password.length")

                    //     ShowToast("Please enter Password")
                    // }
                    // else {
 
                    // }
                    //apiPost()
                     Navigation.push("AppStack",{component:{name:"Workshop" , options: {  topBar: { backButton:{ visible: false}, visible: true , title : { text : ""} } } } })
                }}>
                    <Text style={{ color: "white" }}>
                        Sign In
                    </Text>
                </TouchableOpacity>

            </View>
 
       <Loader  loading={loading}/>
        </View>
    </View>

    )
}


export default OTP