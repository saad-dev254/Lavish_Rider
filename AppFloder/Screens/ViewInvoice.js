import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, useColorScheme} from "react-native";
import { Navigation } from "react-native-navigation";
import StripPaymentScreen, { checkout, ContainerStripe } from './StripePayment';
import { usePaymentSheet } from '@stripe/stripe-react-native';

const ViewInvoice = (props) => {
    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
    const {invoice_data} = props;
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const [loader, setLoader] = useState(false);
    const [invoiceData, setInvoiceData] = useState({});

    useEffect(() => {
        // getInvoiceHandle();
    },[]);
    const getInvoiceHandle = async () => {
        try {
            setLoader(true);
            var requestOptions = {
                method: 'GET',
                redirect: 'follow',
            };
              
            fetch(`https://www.lavishdxb.com/api/invoice/41`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
                if (result?.code === 200) {
                    console.log("result?.data =====> ", result?.data);
                    setInvoiceData(result?.data[0]);
                };
            }).catch((error) => {
                setLoader(false);
            });
        } catch (error) {
            setLoader(false);
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
                    <View style={{flexDirection:"row",marginHorizontal:16,marginTop:16}}>
                        <View style={{flex:1,justifyContent:"center"}}>
                            <Text style={[styles.heading,{fontSize:18,fontWeight:"bold",marginBottom:6}]}>
                                Invoice #: {invoice_data?.invoice_id}
                            </Text>
                        </View>
                        <View style={{
                                borderRadius: 8,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                alignSelf: "flex-end",
                                backgroundColor:invoice_data?.invoice_status?.toLowerCase()==="unpaid"?"#dc3545":"#28a745",
                            }}>
                            <Text style={styles.description}>
                                {invoice_data?.invoice_status}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.contentMain,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{fontSize:20,fontWeight:"bold"}]}>
                                Delivery Detail:
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Delivery Location:
                            </Text>
                            <Text style={styles.heading}>
                                {invoice_data?.delivery_location}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Aptt. #/ villa # / Office #
                            </Text>
                            <Text style={styles.heading}>
                                {invoice_data?.d_aptt_villa_office}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Delivery Building Name
                            </Text>
                            <Text style={styles.heading}>
                                {invoice_data?.d_building}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Delivery Area
                            </Text>
                            <Text style={styles.heading}>
                                {invoice_data?.d_area}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Delivery City
                            </Text>
                            <Text style={styles.heading}>
                                {"Dubai"}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Order Amount
                            </Text>
                            <Text style={[styles.heading,{textTransform:"uppercase"}]}>
                                {"AED: " + invoice_data?.amount}
                            </Text>
                        </View>
                        {invoice_data?.invoice_status?.toLowerCase() === "unpaid" &&
                            <ContainerStripe>
                                <TouchableOpacity 
                                    activeOpacity={.7}
                                    onPress={() => {
                                        checkout({
                                            amount: invoice_data?.amount,
                                            method: "card",
                                            initPaymentSheet,
                                            presentPaymentSheet
                                        });
                                    }}
                                    style={{justifyContent:"center",backgroundColor:"green",
                                    paddingVertical:12,paddingHorizontal:18,borderRadius:6}}>
                                    <Text style={{color:"#FFF",fontSize:12,fontWeight:"bold",textAlign:"center"}}>
                                        Pay Now
                                    </Text>
                                </TouchableOpacity>
                            </ContainerStripe>
                        }
                    </View>
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
    contentMain: {
        backgroundColor: "#FFF",
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 14,
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
        fontSize: 14,
        textTransform: "capitalize",
    },
    description: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "capitalize",
        textAlign: "center"
    },
    date: {
        color: "#000",
        fontSize: 10,
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
    }
})

export default ViewInvoice;