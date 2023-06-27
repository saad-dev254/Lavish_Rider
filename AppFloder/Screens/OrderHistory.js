import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator, useColorScheme, Image, Modal, TouchableOpacity, ToastAndroid} from "react-native";
import {Navigation} from "react-native-navigation";
import { AppTheme } from "../AppTheme/AppTheme";

const orderStatusData = [
    {id: 1, status: "Pending"},
    {id: 2, status: "Order Pickedup"},
    {id: 3, status: "Ready to Deliver"},
    {id: 5, status: "Delivered"},
];

const OrderHistory = (props) => {
    const {order_id} = props;
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const [loader, setLoader] = useState(true);
    const [orderDetail, setOrderDetail] = useState({});
    const [orderStatus, setOrderStatus] = useState("");
    const [orderStatusModal, setOrderStatusModal] = useState(false);

    useEffect(() => {
        getOrderDetailHandle();
    },[]);
    const getOrderDetailHandle = async () => {
        try {
            setLoader(true);
            var requestOptions = {
                method: 'GET',
                redirect: 'follow',
            };

            fetch(`https://www.lavishdxb.com/api/get/orders/${order_id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log("orderDetail =====> ", orderDetail);
                setLoader(false);
                if (result?.code === 200) {
                    setOrderDetail(result?.data);
                };
            }).catch((error) => {
                setLoader(false);
            });
        } catch (error) {
            setLoader(false);
        }
    };
    const updateOrderHandle = (order_status) => {
        try {
            setLoader(true);

            var formdata = new FormData();
            formdata.append("order_id", orderDetail?.id);
            formdata.append("order_status", order_status);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://www.lavishdxb.com/api/order-update", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result?.code === 200) {
                    getOrderDetailHandle();
                    ToastAndroid.show(result?.msg, ToastAndroid.LONG);
                } else {
                    setLoader(false);
                    setOrderStatus("");
                    ToastAndroid.show(result?.msg, ToastAndroid.LONG);
                }
            }).catch((error) => {
                setLoader(false);
                console.log(error?.message);
            });
        } catch (error) {
            setLoader(false);
            console.log(error?.message);
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
                    <View style={{backgroundColor:"#cce5ff",borderColor:"#b8daff",borderWidth:1,marginHorizontal:16,paddingVertical:10,paddingHorizontal:14,alignSelf:"flex-end",borderRadius:50,marginVertical:12}}>
                        <Text style={{color:"#004085",fontSize:14,fontWeight:"bold"}}>
                            #{orderDetail?.order_id}
                        </Text>
                    </View>
                    <View style={[styles.contentMain,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}>
                        <View style={{flexDirection:"row",marginBottom:12}}>
                            <View style={{flex:1,justifyContent:"center"}}>
                                <Text style={[styles.heading,{fontSize:20,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}]}>
                                    Pickup Detail:
                                </Text>
                            </View>
                            <View 
                                // activeOpacity={.7}
                                // onPress={() => setOrderStatusModal(!orderStatusModal)}
                                style={{
                                    height: 40,
                                    marginLeft: 20,
                                    borderRadius: 6,
                                    alignItems: "center",
                                    flexDirection: "row",
                                    paddingHorizontal: 14,
                                    justifyContent: "center",
                                    backgroundColor:
                                    orderDetail?.order_status?.toLowerCase()==="pending"?"#dc3545":
                                    orderDetail?.order_status?.toLowerCase()==="order pickedup"?"#ffc107":
                                    orderDetail?.order_status?.toLowerCase()==="ready to deliver"?"#007bff":
                                    orderDetail?.order_status?.toLowerCase()==="delivered"?"#28a745":"#ffc107",
                                }}>
                                <Text style={styles.statusText}>
                                    {orderStatus === "" ? orderDetail?.order_status : orderStatus}
                                </Text>
                                {/* <Image 
                                    source={require('../Assets/down-arrow.png')} 
                                    style={{height:24,width:24,resizeMode:"contain",tintColor:"#FFF",marginLeft:6}}
                                /> */}
                            </View>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Customer Name
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.user_name}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Pickup Location
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.pickup_location}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Aptt. #/ villa # / Office #
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.aptt_villa_office}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Building Name
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.building}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Area
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.area}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                City
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.city}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Pickup Date
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.pick_date}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Pickup Time
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.pick_time}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:20,fontWeight:"bold"}]}>
                                Delivery Detail:
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Delivery Location:
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.delivery_location}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Aptt. #/ villa # / Office #
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.d_aptt_villa_office}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Delivery Building Name
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.d_building}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Delivery Area
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.d_area}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginBottom:6}]}>
                                Delivery City
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.d_city}
                            </Text>
                        </View>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginTop:8}]}>
                                Shipping Method
                            </Text>
                            <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                {orderDetail?.shipping_method === "0" ? "Normal Shipping" : "Express Shipping"}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                {/* ORDER STATUS MODAL */}
                <Modal
                    transparent={true}
                    statusBarTranslucent
                    animationType={"fade"}
                    visible={orderStatusModal}>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView,{backgroundColor:isDarkTheme?"#000":"#FFF",height:Dimensions.get("window").height/2.4}]}>
                            <Text style={[styles.modalHeading,{color:isDarkTheme?"#FFF":"#000",}]}>
                                Select Your Order Status
                            </Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {orderStatusData?.map((val, key) => {
                                    return (
                                        <TouchableOpacity
                                            key={key}
                                            activeOpacity={.8}
                                            onPress={() => {
                                                updateOrderHandle(val?.status);
                                                setOrderStatus(val?.status);
                                                setOrderStatusModal(false);
                                            }}
                                            style={[styles.listStyle,{borderBottomWidth:
                                            orderStatusData?.length-1===key?0:1}]}>
                                            <Text style={[styles.listText,{color:isDarkTheme?"#FFF":"#000"}]}>
                                                {val?.status}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                            <TouchableOpacity
                                activeOpacity={.7}
                                onPress={() => setOrderStatusModal(false)}
                                style={{
                                    padding: 15,
                                    borderRadius: 6,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 20,
                                    backgroundColor: AppTheme.ButtonGreenColor,
                                }}>
                                <Text 
                                    style={{
                                        fontSize: 16,
                                        textAlign: 'center',
                                        color: '#ffffff',
                                        backgroundColor: 'transparent',
                                        fontWeight: '700',
                                    }}>
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
        marginBottom: 20,
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
    statusText: {
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
})

export default OrderHistory;