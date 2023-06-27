import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, Image, TextInput, TouchableOpacity, ToastAndroid } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Navigation } from "react-native-navigation";
import { AppTheme } from "../AppTheme/AppTheme";
import { DeleteCustomer, GetAllContacts, GetAllCustomer, GetAllStaffs, GetAllWorkshop, GetQuestions } from "../Components/Api";
import { GoToNextController, ShowToast } from "../Components/General";
import Loader from "../Components/Loader";
 


const QuesAnswer = (props) => {


    const wID = props?.item?.id || 0

    const wName = props?.item?.question || ""

    const [dataAllStaffs, setDataAllStaffs] = useState([]);
    const [sortedDataAllStaff, setSortedDataAllStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiPost()
    }, [])



    const apiPost = async (s) => {

        console.log(`check func =`, GetQuestions + 1)
        setLoading(true)

        axios.get(GetQuestions + 1)
            .then(data => {
                console.log(`Staff DATA = ${JSON.stringify(data.data, null, 2)}`)
                setLoading(false)

                setDataAllStaffs(data?.data.data || []);
                setSortedDataAllStaff(data?.data.data || [])
            })
            .catch(e => {
                console.log(`Error =`, e);
                setLoading(false)

            })


    }




    const onSearch = (text) => {
        if (text.length > 0) {
            let sorted = dataAllStaffs.filter(function (item) {
                console.log(item.workshop_name)
                console.log(item.workshop_name.toLowerCase().includes(text.toLowerCase()))
                return item.workshop_name.toLowerCase().includes(text.toLowerCase());
            })
            setSortedDataAllStaff(sorted);
            return;
        }

        setSortedDataAllStaff(dataAllStaffs);
    }


    return (
        <LinearGradient style={{ flex: 1  }} start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#D1C1FD', '#FFFFFF', '#FFFFFF']}>
            <Text style={{ fontSize: 22, marginLeft: 16, marginTop: 20 }}> {"Q&A’s " + wName} </Text>

            <View style={{ alignItems: "center", flexDirection: "row", height: 40, borderRadius: 5, borderColor: "black", borderWidth: 1, marginTop: 20, marginLeft: 15, marginRight: 15 }} >
                <Image style={{ width: 20, height: 20, marginLeft: 10 }} source={require("../Assets/ic_search.png")} />

                <TextInput
                    style={{ flex: 1, marginLeft: 10 }}
                    placeholder={"Search"}
                    onChangeText={onSearch}
                />


                {/* <Image style={{ width: 50, height: 25, marginRight: 10, alignItems: "flex-end" }} source={require("../Assets/filter.png")} /> */}
            </View>



            <FlatList
                style={{ marginTop: 20 }}
                renderItem={ContactsView}
                data={sortedDataAllStaff}
            />

            <Loader loading={loading} />

        </LinearGradient>


    )
}


const apiDeletePost = async (id) => {

    console.log(`delte data func =`, DeleteCustomer + id)

    axios.delete(DeleteCustomer + id)
        .then(data => {
            console.log(`Staff DATA = ${JSON.stringify(data.data, null, 2)}`)
            //  console.log(`delte data func =`, DeleteCustomer + item.id)



            // alert(data.data.message)

            // setDataAllStaffs(data?.data || []);
            // setSortedDataAllStaff(data?.data || [])
        })
        .catch(e => {
            console.log(`Error =`, e);

        })


}


const ContactsView = ({ item }) => {


    // console.log ("id is idd" , item.userid)

    const handleDelettePressed = () => {


      console.log("itemitem" , item)

        Navigation.push("AppStack", { component: { passProps: { item }, name: "AnswerDetail", options: { topBar: { visible: true } } } })

        

        // apiDeletePost(item.userid)


    }

    return (


        <View style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <TouchableOpacity style={{
                backgroundColor: "#FFF", width: '90%', alignSelf: "center" , shadowColor: '#000000', shadowOffset: {
                    width: 0,
                    height: 5
                },
                shadowRadius: 4,
                shadowOpacity: 1.0,
                marginBottom: 20
                , alignItems: "center",
                  flexDirection: "row",
                 borderRadius: 10

            }} onPress={handleDelettePressed}> 

 
                <Image style={{ width: 45, height: 45, marginTop: 0 ,  marginLeft : 10  }} source={require("../Assets/Button.png")} resizeMode="contain" />

                <Text style={{ fontSize: 15, marginLeft: 10 , paddingVertical : 20}}>{item.question}</Text>


                <Image style={{ width: 15, height: 15, marginTop: 0  , position  : "absolute" , right :20 }} source={require("../Assets/chevron-right.png")} resizeMode="contain" />

                 {/* </TouchableOpacity> */}
                {/* <View style={{  flexDirection: "row", marginLeft: 5 }}>
                    <Text style={{color: "blue"}}>View | </Text>
                    <Text style={{color: "red"}}>Delete | </Text>
                    <Text style={{color: "#FFD21F"}}>Create Appointment</Text>
                </View> */}

             </TouchableOpacity>

        </View>


    )
}

export default QuesAnswer