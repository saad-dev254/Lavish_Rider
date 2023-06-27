import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, useColorScheme, Image, ToastAndroid, Modal} from "react-native";
import {AppTheme} from "../AppTheme/AppTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Approval = () => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const [loader, setLoader] = useState(false);
    const [approveLoader, setApproveLoader] = useState(false);
    const [allApprovals, setAllApprovals] = useState([]);

    useEffect(() => {
        getApprovalsHandle();
    },[]);
    const getApprovalsHandle = async () => {
        try {
            setLoader(true);
            var requestOptions = {
                method: 'GET',
                redirect: 'follow',
            };
              
            fetch('https://www.lavishdxb.com/api/approval', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
                if (result?.code === 200) {
                    setAllApprovals(result?.data);
                };
            }).catch((error) => {
                setLoader(false);
                console.log("ERROR =====> ", error?.message);
            });
        } catch (error) {
            setLoader(false);
            console.log("ERROR =====> ", error?.message);
        }
    };
    const approvedPaymentHandle = (invoice_id) => {
        try {
            console.log("invoice_id =====> ", invoice_id);
            setLoader(true);
            var formdata = new FormData();
            formdata.append("invoice_id", invoice_id);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://www.lavishdxb.com/api/approved", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
                if (result?.code === 200) {
                    getApprovalsHandle();
                    ToastAndroid.show(result?.msg, ToastAndroid.LONG);
                } else {
                    ToastAndroid.show(result?.msg, ToastAndroid.LONG);
                }
            }).catch((error) => {
                setLoader(false);
                console.log('error', error)
            });
        } catch (error) {
            setLoader(false);
            console.log('error', error);
        }
    };

    if (loader) {
        return (
            <View style={{flex:1,backgroundColor:"#FFF",alignItems:"center",justifyContent:"center"}}>
                <ActivityIndicator size={"large"} />
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {allApprovals?.map((val, key) => {
                        return (
                            <View
                                key={key}
                                style={[styles.contentMain,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}>
                                <View style={{flex:1,justifyContent:"center",paddingHorizontal:8,paddingVertical:4}}>
                                    <View style={{flexDirection:"row"}}>
                                        <View style={{flex:1}}>
                                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginTop:8}]}>
                                                Customer Name
                                            </Text>
                                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700"}]}>
                                                {val?.user_name}
                                            </Text>
                                        </View>
                                        <TouchableOpacity 
                                            activeOpacity={.7}
                                            onPress={() => {
                                                approvedPaymentHandle(val?.id);
                                            }}
                                            style={{
                                                height: 40,
                                                marginLeft: 20,
                                                borderRadius: 6,
                                                alignItems: "center",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                paddingHorizontal: 14,
                                                backgroundColor: AppTheme.ButtonGreenColor,
                                            }}>
                                            <Text style={styles.statusText}>
                                                Approve a Payment
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginTop:8}]}>
                                            Payment Method
                                        </Text>
                                        <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                            {val?.payment_method}
                                        </Text>
                                        <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginTop:8}]}>
                                            Amount
                                        </Text>
                                        <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",textTransform:"uppercase"}]}>
                                            AED: {val?.amount}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4c7",
    },
    imageBgStyle: {
        backgroundColor: "#dddddd",
        height: 120,
        width: "100%",
        marginBottom: 12,
        borderRadius: 8,
        borderColor: "lightgray",
        borderWidth: 1,
        marginTop:10,
    },
    contentMain: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginTop: 14,
        marginHorizontal: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 0.5,
        elevation: 0.5,
    },
    orderImage: {
        height: 80,
        width: 80,
        resizeMode: "cover",
        borderRadius: 8,
    },
    heading: {
        color: "#000",
        fontSize: 16,
        textTransform: "capitalize",
    },
    description: {
        color: "#9e9e9e",
        fontSize: 12,
        textTransform: "capitalize",
    },
    date: {
        color: "#000",
        fontSize: 14,
    },
    statusText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center"
    },
    amount: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "right",
    },
    orderBlank: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: Dimensions.get("window").height - 300,
    },
    orderBlankText: {
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "capitalize",
    },
    centeredView: {
        flex: 1,
        backgroundColor: "#00000070",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    modalView: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        height: Dimensions.get("window").height/1.5,
        paddingVertical: 22,
        paddingHorizontal: 14,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeading: {
        fontSize: 22,
        color: "#000",
        paddingBottom: 12,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "capitalize",
    },
    listStyle: {
        paddingVertical: 12,
        borderBottomWidth: .7,
        alignItems: "flex-start",
        borderBottomColor: "#E0E0E0",
    },
    listText: {
        fontSize: 14,
        color: "#000",
        fontWeight: "bold",
    },
    buttonMain: {
        width: "30%",
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 0,
        paddingVertical: 10,
        alignSelf: "flex-end",
        borderColor: AppTheme.ButtonGreenColor,
        backgroundColor: AppTheme.ButtonGreenColor,
    },
    buttonText: {
        fontSize: 15,
        color: "#FFF",
        textAlign: "center",
        textTransform: "capitalize",
        fontWeight: "bold",
    }
})

export default Approval;