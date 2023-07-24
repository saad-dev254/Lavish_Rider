import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, useColorScheme, Image, ToastAndroid, Modal, Linking, Platform, Alert, PermissionsAndroid} from "react-native";
import {AppTheme} from "../AppTheme/AppTheme";
import {Navigation} from "react-native-navigation";
import SideBar from "../Components/SideBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomTextfield } from "../Components/General";
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';

const statusData = [
    {id: 1, status: "Pending"},
    {id: 2, status: "Order Pickedup"},
    {id: 3, status: "Ready to Deliver"},
    {id: 5, status: "Delivered"},
];

const Orders = () => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const [loader, setLoader] = useState(false);
    const [userData, setUserData] = useState({});
    const [allOrders, setAllOrders] = useState([]);
    const [orderId, setOrderId] = useState("");
    const [orderStatus, setOrderStatus] = useState("Pending");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orderStatusModal, setOrderStatusModal] = useState(false);
    const [invoiceModal, setInvoiceModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [deliveryCharges, setDeliveryCharges] = useState("");
    const [invoiceId, setInvoiceId] = useState("");
    const [invoiceLoader, setInvoiceLoader] = useState(false);
    const [itemImage, setItemImage] = useState("");
    const [pictureModal, setPictureModal] = useState(false);
    const [currentLatitude, setCurrentLatitude] = useState("");
    const [currentLongitude, setCurrentLongitude] = useState("");

    useEffect(() => {
        getLocation();
        getUserData();
        getOrdersHandle();
    },[]);
    const getUserData = async () => {
        const user_data = JSON.parse(await AsyncStorage.getItem("userData"));
        setUserData(user_data);
    };
    const getOrdersHandle = async () => {
        try {
            const user_data = JSON.parse(await AsyncStorage.getItem("userData"));
            setLoader(true);

            var formdata = new FormData();
            formdata.append("id", user_data?.id);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
              
            fetch('https://www.lavishdxb.com/api/get/rider-orders', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
                if (result?.code === 200) {
                    setAllOrders(result?.RiderOrders);
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
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const updateOrderHandle = (order_status) => {
        try {
            setLoader(true);
            var formdata = new FormData();
            formdata.append("order_id", orderId);
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
                    getOrdersHandle();
                    setTimeout(() => {
                        ToastAndroid.show(result?.msg, ToastAndroid.LONG);
                    }, 1000);
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
    const generateInvoiceHandle = () => {
        try {
            setInvoiceLoader(true);
            var formdata = new FormData();
            formdata.append("pick_id", orderId);
            formdata.append("amount", amount);
            formdata.append("delivery_charges", deliveryCharges);
            formdata.append("invoice_id", invoiceId);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://www.lavishdxb.com/api/generate-invoice", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setInvoiceLoader(false);
                setInvoiceModal(false);
                ToastAndroid.show(result?.msg, ToastAndroid.LONG);
            }).catch((error) => {
                setInvoiceLoader(false);
                console.log(error?.message);
            });
        } catch (error) {
            setInvoiceLoader(false);
            console.log(error?.message);
        }
    };
    const selectImageFromGallery = () => {
        try {
            setPictureModal(false);
            setInvoiceModal(true);
            ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
            }).then(response => {
                setItemImage(response?.path);
                // setImageObject({
                //   name: 'image.jpg',
                //   uri: response?.path,
                //   type: response?.mime,
                // });
            }).catch((error) => {
                setPictureModal(false);
                setInvoiceModal(true);
                alert(error?.message);
            })
        } catch (error) {
            setPictureModal(false);
            setInvoiceModal(true);
            alert(error?.message);
        }
    };
    const selectImageFromCamera = () => {
        try {
            setPictureModal(false);
            setInvoiceModal(true);
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
            }).then((response) => {
                setItemImage(response?.path);
                // setImageObject({
                //   name: 'image.jpg',
                //   uri: response?.path,
                //   type: response?.mime,
                // });
            }).catch((error) => {
                setPictureModal(false);
                setInvoiceModal(true);
                alert(error?.message);
            })
        } catch (error) {
            setPictureModal(false);
            setInvoiceModal(true);
            alert(error?.message);
        }
    };
    const routingHandle = (lat, lng) => {
        try {
            const coordinates = [
                // { latitude: currentLatitude, longitude: currentLongitude }, // Example coordinate 1
                { latitude: lat, longitude: lng }, // Example coordinate 2
                // Add more coordinates as needed
            ];
            
            const encodedPolyline = coordinates
            .map(({ latitude, longitude }) => `${latitude},${longitude}`)
            .join('|');
        
            const url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${encodedPolyline}`;
        
            Linking.openURL(url);            
        } catch (error) {
            console.log("ERROR", error?.message);
        }
    };
    const getLocation = async () => {
        const hasLocationPermission = await hasLocationPermissions();
        if (!hasLocationPermission) {
          return;
        };
        Geolocation.getCurrentPosition(
          (position) => {
            console.log("current lat =====> ", position.coords.latitude);
            console.log("current lng =====> ", position.coords.longitude);
            setCurrentLatitude(position.coords.latitude);            
            setCurrentLongitude(position.coords.longitude);
        },
          (error) => {},
          {
            accuracy: {
              ios: 'best',
              android: 'high',
            },
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 0,
            enableHighAccuracy: true,
            showLocationDialog: true,
            forceRequestLocation: true,
          },
        );
    };
    const hasLocationPermissions = async () => {
        if (Platform.OS === 'ios') {
          const hasPermission = await hasLocationPermissionIOS();
          return hasPermission;
        }
    
        if (Platform.OS === 'android' && Platform.Version < 23) {
          return true;
        }
    
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
    
        if (hasPermission) {
          return true;
        }
    
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
    
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }
    
        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show(
            'Location permission denied by user.',
            ToastAndroid.LONG,
          );
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show(
            'Location permission revoked by user.',
            ToastAndroid.LONG,
          );
        }
        return false;
    };
    const hasLocationPermissionIOS = async () => {
        const openSetting = () => {
          Linking.openSettings().catch(() => {
            Alert.alert('Unable to open settings');
          });
        };
        const status = await Geolocation.requestAuthorization('whenInUse');
      
        if (status === 'granted') {
          return true;
        }
      
        if (status === 'denied') {
          Alert.alert('Location permission denied');
        }
      
        if (status === 'disabled') {
          Alert.alert(
            `Turn on Location Services to allow Bakery App to determine your location.`,
            '',
            [
              { text: 'Go to Settings', onPress: openSetting },
              { text: "Don't Use Location", onPress: () => { } },
            ],
          );
        }
        return false;
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
                <View style={{flexDirection:"row",paddingVertical:12,borderBottomColor:"#CCC",borderBottomWidth:1}}>
                    <View style={{justifyContent:"center"}}>
                        <TouchableOpacity
                            activeOpacity={.7}
                            onPress={toggleModal}
                            style={{paddingLeft:20}}>
                            <Image
                                source={require("../Assets/menu.png")}
                                style={{height:25,width:25,resizeMode:"cover",tintColor:isDarkTheme?"#FFF":"#000"}}
                            />
                        </TouchableOpacity>
                        <SideBar
                            userData={userData}
                            toggleModal={toggleModal}
                            isModalVisible={isModalVisible}
                            termsModalToggle={() => setTermsModal(!termsModal)}
                        />
                    </View>
                    <View style={{flex:1,justifyContent:"center"}}>
                        <Text style={{fontSize:22,color:isDarkTheme?"#FFF":"#000",fontWeight:"bold",textAlign:"center"}}>
                            My Orders
                        </Text>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"flex-end"}}>
                        <TouchableOpacity
                            activeOpacity={.7}
                            style={{paddingRight:8}}
                            onPress={() => console.log("NOTIFICATION PRESS")}>
                            <Image
                                source={require("../Assets/bell.png")}
                                style={{height:25,width:25,resizeMode:"cover",tintColor:isDarkTheme?"#FFF":"#000"}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginBottom:6}}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {statusData?.map((val, key) => {
                            return (
                                <TouchableOpacity
                                    key={key}
                                    activeOpacity={.7}
                                    onPress={() => setOrderStatus(val?.status)}
                                    style={{backgroundColor:val?.status?.toLowerCase()===orderStatus?.toLowerCase()?AppTheme?.ButtonGreenColor:"#FFF",
                                    borderColor:val?.status?.toLowerCase()===orderStatus?.toLowerCase()?AppTheme?.ButtonGreenColor:isDarkTheme?"#000":"#FFF",
                                    borderRadius:8,paddingVertical:12,paddingHorizontal:14,marginTop:16,marginRight:12,marginLeft:key===0?12:0}}>
                                    <Text style={{color:val?.status?.toLowerCase()===orderStatus?.toLowerCase()?"#FFF":AppTheme?.ButtonGreenColor,fontSize:13,fontWeight:"bold"}}>
                                        {val?.status}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
                <ScrollView>
                    {allOrders?.map((val, key) => {
                        if (val?.order_status?.toLowerCase()===orderStatus?.toLowerCase()) {
                            return (
                                <TouchableOpacity
                                    key={key}
                                    activeOpacity={.7}
                                    style={[styles.contentMain,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}
                                    onPress={() => {
                                        Navigation.push("AppStack",{component: 
                                            {passProps: {order_id: val?.id},
                                            name: "OrderHistory",
                                            options: {topBar:
                                                {backButton: {visible: true},
                                                visible: true ,
                                                title : {text: "Order Detail"}}
                                            }
                                        }});
                                    }}>
                                    <View style={{flex:1,justifyContent:"center",paddingHorizontal:8,paddingVertical:4}}>
                                        <View style={{flexDirection:"row"}}>
                                            <View style={{flex:1}}>
                                                <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700"}]}>
                                                    {val?.name}
                                                </Text>
                                                <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginTop:8}]}>
                                                    {`${val?.aptt_villa_office}, ${val?.building}`}
                                                </Text>
                                            </View>
                                            {orderStatus?.toLowerCase()==="delivered" ? 
                                                <TouchableOpacity 
                                                    activeOpacity={.7}
                                                    onPress={() => {
                                                        setOrderId(val?.id);
                                                        setInvoiceModal(!invoiceModal);
                                                    }}
                                                    style={{
                                                        height: 40,
                                                        marginLeft: 20,
                                                        borderRadius: 6,
                                                        alignItems: "center",
                                                        flexDirection: "row",
                                                        justifyContent: "flex-start",
                                                        paddingHorizontal: 14,
                                                        backgroundColor: "#28a745",
                                                    }}>
                                                    <Text style={styles.statusText}>
                                                        Generate Invoice
                                                    </Text>
                                                </TouchableOpacity>
                                            :
                                                <TouchableOpacity 
                                                    activeOpacity={.7}
                                                    onPress={() => {
                                                        setOrderId(val?.id);
                                                        setOrderStatusModal(!orderStatusModal);
                                                    }}
                                                    style={{
                                                        height: 40,
                                                        marginLeft: 20,
                                                        borderRadius: 6,
                                                        alignItems: "center",
                                                        flexDirection: "row",
                                                        justifyContent: "flex-start",
                                                        paddingHorizontal: 14,
                                                        backgroundColor: AppTheme.ButtonGreenColor,
                                                    }}>
                                                    <Text style={styles.statusText}>
                                                        Update Status
                                                    </Text>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                        <View style={{flexDirection:"row",marginTop:12}}>
                                            <View style={{flex:1,justifyContent:"center"}}>
                                                {orderStatus === "Ready to Deliver" ? 
                                                    <>
                                                        <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginTop:8}]}>
                                                            Delivery Date and Time
                                                        </Text>
                                                        <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                                            {val?.delivery_date === null ? "-----" : val?.delivery_date}, {val?.delivery_time === null ? "-----" : val?.delivery_time}
                                                        </Text>
                                                    </>
                                                : orderStatus === "Delivered" ? null :
                                                    <>
                                                        <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000",fontSize:14,fontWeight:"700",marginTop:8}]}>
                                                            Pickup Date and Time
                                                        </Text>
                                                        <Text style={[styles.heading,{color:isDarkTheme?"#FFF":"#000"}]}>
                                                            {val?.pick_date}, {val?.pick_time}
                                                        </Text>
                                                    </>
                                                }
                                            </View>
                                            <TouchableOpacity 
                                                activeOpacity={.7}
                                                onPress={() => {
                                                    if (orderStatus === "Pending") {
                                                        routingHandle(val?.lat, val?.long);
                                                    } else {
                                                        routingHandle(val?.d_lat, val?.d_long);
                                                    }
                                                }}
                                                style={{justifyContent:"center",paddingLeft:12}}>
                                                <Image
                                                    source={require('../Assets/route-icon.png')}
                                                    style={{height:50,width:50,resizeMode:"contain"}}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    })}
                </ScrollView>
                {/* ORDER STATUS MODAL */}
                <Modal
                    transparent={true}
                    statusBarTranslucent
                    animationType={"fade"}
                    visible={orderStatusModal}>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView,{backgroundColor:isDarkTheme?"#000":"#FFF",height:Dimensions.get("window").height/2.8}]}>
                            <Text style={[styles.modalHeading,{color:isDarkTheme?"#FFF":"#000",}]}>
                                Select Your Order Status
                            </Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {orderStatus === "Pending" ? 
                                    <>
                                        <TouchableOpacity
                                            style={[styles.listStyle,{borderBottomWidth:0}]}>
                                            <Text style={[styles.listText,{color:isDarkTheme?"#FFF":"#000"}]}>
                                                Order Pickedup
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            onPress={() => {
                                                updateOrderHandle("Ready to Delivery");
                                                setOrderStatusModal(false);
                                            }}
                                            style={[styles.listStyle,{borderBottomWidth:0}]}>
                                            <Text style={[styles.listText,{color:isDarkTheme?"#FFF":"#000"}]}>
                                                Ready to Delivery
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            onPress={() => {
                                                updateOrderHandle("Delivered");
                                                setOrderStatusModal(false);
                                            }}
                                            style={[styles.listStyle,{borderBottomWidth:1}]}>
                                            <Text style={[styles.listText,{color:isDarkTheme?"#FFF":"#000"}]}>
                                                Delivered
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                : orderStatus === "Order Pickedup" ? 
                                    <>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            onPress={() => {
                                                updateOrderHandle("Ready to Delivery");
                                                setOrderStatusModal(false);
                                            }}
                                            style={[styles.listStyle,{borderBottomWidth:0}]}>
                                            <Text style={[styles.listText,{color:isDarkTheme?"#FFF":"#000"}]}>
                                                Ready to Delivery
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.listStyle,{borderBottomWidth:1}]}>
                                            <Text style={[styles.listText,{color:isDarkTheme?"#FFF":"#000"}]}>
                                                Delivered
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                : orderStatus === "Ready to Deliver" ? 
                                    <>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            onPress={() => {
                                                updateOrderHandle("Delivered");
                                                setOrderStatusModal(false);
                                            }}
                                            style={[styles.listStyle,{borderBottomWidth:0}]}>
                                            <Text style={[styles.listText,{color:isDarkTheme?"#FFF":"#000"}]}>
                                                Delivered
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                :null}
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
                {/* GENERATE INVOICE MODAL */}
                <Modal
                    transparent={true}
                    statusBarTranslucent
                    animationType={"fade"}
                    visible={invoiceModal}>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView,{backgroundColor:isDarkTheme?"#000":"#FFF",height:Dimensions.get("window").height/1.6}]}>
                            <Text style={[styles.modalHeading,{color:isDarkTheme?"#FFF":"#000",}]}>
                                Generate Invoice
                            </Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{marginTop:16}}>
                                    {/* <Text style={{fontSize:16,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}}>Order Number</Text>
                                    <CustomTextfield
                                        value={orderId.toString()}
                                        editable={false}
                                        // setValue={setuserName}
                                        style={{marginTop:10}}
                                        placeholder="Enter Order Number"
                                    /> */}
                                    <Text style={{fontSize:16,marginTop:12,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}}>Amount</Text>
                                    <CustomTextfield
                                        value={amount.toString()}
                                        setValue={setAmount}
                                        style={{marginTop:10}}
                                        keyboardType={"number-pad"}
                                        placeholder="Enter Order Amount"
                                    />
                                    <Text style={{fontSize:16,marginTop:12,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}}>Delivery Charges</Text>
                                    <CustomTextfield
                                        value={deliveryCharges.toString()}
                                        setValue={setDeliveryCharges}
                                        style={{marginTop:10}}
                                        keyboardType={"number-pad"}
                                        placeholder="Enter Delivery Charges"
                                    />
                                    <Text style={{fontSize:16,marginTop:12,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}}>Invoice Number</Text>
                                    <CustomTextfield
                                        value={invoiceId.toString()}
                                        setValue={setInvoiceId}
                                        style={{marginTop:10}}
                                        placeholder="Enter Invoice Number"
                                    />
                                    <Text style={{fontSize:16,marginTop:12,fontWeight:"bold",color:isDarkTheme?"#FFF":"#000"}}>Add Item Picture</Text>
                                    <TouchableOpacity
                                        activeOpacity={.7}
                                        style={styles.imageBgStyle}
                                        onPress={() => {
                                            setInvoiceModal(false);
                                            setPictureModal(!pictureModal);
                                        }}>
                                        <Image
                                            style={{height:"100%",width:"100%",resizeMode:"cover",borderRadius:8}}
                                            source={itemImage === "" ? require('../Assets/no-image-found.jpeg') : {uri: itemImage}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                            <View style={{flexDirection:"row"}}>
                                <TouchableOpacity
                                    activeOpacity={.7}
                                    onPress={() => setInvoiceModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: 15,
                                        marginRight: 6,
                                        borderRadius: 6,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 20,
                                        borderWidth: 1,
                                        borderColor: AppTheme.ButtonGreenColor,
                                        backgroundColor: "#FFF",
                                    }}>
                                    <Text 
                                        style={{
                                            fontSize: 16,
                                            textAlign: 'center',
                                            color: AppTheme.ButtonGreenColor,
                                            backgroundColor: 'transparent',
                                            fontWeight: '700',
                                        }}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={.7}
                                    onPress={() => {
                                        if (amount === "") {
                                            ToastAndroid.show("Enter Order Amount*", ToastAndroid.LONG);
                                        } else if (deliveryCharges === "") {
                                            ToastAndroid.show("Enter Delivery Charges*", ToastAndroid.LONG);
                                        } else if (invoiceId === "") {
                                            ToastAndroid.show("Enter Invoice Number*", ToastAndroid.LONG);
                                        } else {
                                            generateInvoiceHandle();
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: 15,
                                        marginLeft: 6,
                                        borderRadius: 6,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 20,
                                        borderWidth: 1,
                                        borderColor: AppTheme.ButtonGreenColor,
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
                                        Generate
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* PICTURE SELECT MODAL */}
                <Modal
                    transparent={true}
                    animationType={"fade"}
                    visible={pictureModal}
                    statusBarTranslucent>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView,{backgroundColor:isDarkTheme?"#000":"#FFF",height:Dimensions.get("window").height/2.8}]}>
                            <Text style={styles.modalHeading}>
                                Add Photo
                            </Text>
                            <TouchableOpacity
                                activeOpacity={.7}
                                onPress={selectImageFromGallery}
                                style={{flexDirection:"row",borderTopColor:"#CCC",borderTopWidth:0,marginTop:20,paddingTop:12}}>
                                <View style={{justifyContent:"center",marginRight:12}}>
                                    <Image
                                        style={{height:40,width:40,resizeMode:"contain"}}
                                        source={require('../Assets/gallery.png')}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center"}}>
                                    <Text style={styles.listText}>
                                        Gallery
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={.7}
                                onPress={selectImageFromCamera}
                                style={{flexDirection:"row",borderTopColor:"#CCC",borderTopWidth:1,marginTop:20,paddingTop:12}}>
                                <View style={{justifyContent:"center",marginRight:12}}>
                                    <Image
                                        style={{height:40,width:40,resizeMode:"contain"}}
                                        source={require('../Assets/camera.png')}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center"}}>
                                    <Text style={styles.listText}>
                                        Camera
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={.7}
                                style={styles.buttonMain}
                                onPress={() => setPictureModal(false)}>
                                <Text style={styles.buttonText}>
                                    close
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
        textTransform: "capitalize",
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

export default Orders;