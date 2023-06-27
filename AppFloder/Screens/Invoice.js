import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, useColorScheme} from "react-native";
import { Navigation } from "react-native-navigation";
import { AppTheme } from "../AppTheme/AppTheme";
import StripPaymentScreen, { checkout, ContainerStripe } from './StripePayment';
import { usePaymentSheet } from '@stripe/stripe-react-native';
import BottomBar from "../Components/BottomBar";

const Invoice = (props) => {
    const {routeName} = props;
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
    const [loader, setLoader] = useState(false);    
    const [activeTab, setActiveTab] = useState(0);
    const [invoiceData, setInvoiceData] = useState([]);
    const [invoiceStatus, setInvoiceStatus] = useState("paid");

    useEffect(() => {
        getInvoiceHandle();
    },[]);
    const getInvoiceHandle = async () => {
        try {
            const user_data = JSON.parse(await AsyncStorage.getItem("userData"));
            setLoader(true);
            var requestOptions = {
                method: 'GET',
                redirect: 'follow',
            };

            fetch(`https://www.lavishdxb.com/api/invoice/${user_data?.id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
                if (result?.code === 200) {
                    setInvoiceData(result?.data);
                }
            }).catch((error) => {
                setLoader(false);
                console.log("ERROR =====> ", error?.message);
            });
        } catch (error) {
            setLoader(false);
            console.log("ERROR =====> ", error?.message);
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
                <View style={[styles.shadowStyle,{flexDirection:"row",marginTop:16,marginHorizontal:12}]}>
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={() => setInvoiceStatus("paid")}
                        style={{flex:1,backgroundColor:"#FFF",borderTopLeftRadius:8,borderBottomLeftRadius:8,paddingVertical:12,
                        paddingHorizontal:14,borderBottomWidth:invoiceStatus==="paid"?3:0,borderBottomColor:AppTheme?.ButtonGreenColor}}>
                        <Text style={{color:AppTheme?.ButtonGreenColor,fontSize:13,textAlign:"center",fontWeight:"bold"}}>
                            Paid
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={() => setInvoiceStatus("unpaid")}
                        style={{flex:1,backgroundColor:"#FFF",borderTopRightRadius:8,borderBottomRightRadius:8,paddingVertical:12,
                        paddingHorizontal:14,borderBottomWidth:invoiceStatus==="unpaid"?3:0,borderBottomColor:AppTheme?.ButtonGreenColor}}>
                        <Text style={{color:AppTheme?.ButtonGreenColor,fontSize:13,textAlign:"center",fontWeight:"bold"}}>
                            Un Paid
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {invoiceData?.map((val, key) => {
                        if (val?.invoice_status?.toLowerCase() === invoiceStatus)
                        return (
                            <TouchableOpacity
                                key={key}
                                activeOpacity={.7}
                                style={[styles.contentMain,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}
                                onPress={() => {
                                    Navigation.push("AppStack", {component: 
                                        {passProps: {invoice_data: val},
                                        name: "ViewInvoice",
                                        options: {topBar:
                                            {backButton: {visible: true},
                                            visible: true ,
                                            title : {text: "Invoice Detail"}}
                                        }
                                    }})
                                }}>
                                <View style={{flex:1,justifyContent:"center",paddingHorizontal:8,paddingVertical:4}}>
                                    <View style={{flexDirection:"row"}}>
                                        <View style={{flex:1,justifyContent:"center"}}>
                                            <Text numberOfLines={1} style={styles.heading}>
                                                {val?.invoice_id}
                                            </Text>
                                        </View>
                                        {val?.invoice_status?.toLowerCase() === "unpaid" &&
                                            <ContainerStripe>
                                                <TouchableOpacity 
                                                    activeOpacity={.7}
                                                    onPress={() => {
                                                        checkout({
                                                            amount: val?.amount,
                                                            method: "card",
                                                            initPaymentSheet,
                                                            presentPaymentSheet
                                                        });
                                                    }}
                                                    style={{justifyContent:"center",backgroundColor:"green",
                                                    paddingVertical:8,paddingHorizontal:18,borderRadius:6}}>
                                                    <Text style={{color:"#FFF",fontSize:12,fontWeight:"bold",textAlign:"center"}}>
                                                        Pay Now
                                                    </Text>
                                                </TouchableOpacity>
                                            </ContainerStripe>
                                        }
                                    </View>
                                    <Text style={styles.description}>
                                        <Text>User Name: </Text>
                                        <Text style={{color:"#000"}}>{val?.user_name}</Text>
                                    </Text>
                                    <Text style={styles.description}>
                                        <Text>Delivery Address: </Text>
                                        <Text style={{color:"#000"}}>{val?.d_address_1}</Text>
                                    </Text>
                                    <Text style={styles.description}>
                                        <Text>Payment Method: </Text>
                                        <Text style={{color:"#000"}}>{val?.payment_method}</Text>
                                    </Text>
                                    <View style={{flexDirection:"row",marginTop:20}}>
                                        <View style={{flex:1,justifyContent:"center"}}>
                                            <Text style={styles.description}>
                                                <Text>Order #: </Text>
                                                <Text style={{color:"#000"}}>{val?.order_id}</Text>
                                            </Text>
                                        </View>
                                        <View style={{justifyContent:"center"}}>
                                            <Text style={styles.amount}>
                                                {`AED: ${val?.amount}`}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                {routeName === "sidebar" ? null :
                    <BottomBar />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4c7",
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
        fontSize: 18,
        textTransform: "capitalize",
    },
    description: {
        color: "#9e9e9e",
        fontSize: 13,
        textTransform: "capitalize",
        paddingTop: 4,
    },
    date: {
        color: "#000",
        fontSize: 10,
        paddingLeft: 16,
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
    shadowStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    }
})

export default Invoice;