import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Dimensions, ScrollView, Image, Alert, Linking, ToastAndroid, PermissionsAndroid, Platform } from 'react-native';
import { initStripe, StripeProvider } from '@stripe/stripe-react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { AppTheme } from '../AppTheme/AppTheme';
import StripPaymentScreen, { checkout, ContainerStripe } from './StripePayment';
import { usePaymentSheet } from '@stripe/stripe-react-native';
import { RadioButton } from 'react-native-paper';
import { Navigation } from "react-native-navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import * as Animatable from 'react-native-animatable';
import Geocoder from 'react-native-geocoding';
import { CustomTextfield } from '../Components/General';

const DeliveryForm = (props) => {
    const {pickupLocation, pickupLatitude, pickupLongitude, pickupAddress1, pickupAddress2, pickupArea, pickupNearestLand, pickupDate, pickupTime} = props;
    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
    const [loader, setLoader] = useState(false);
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [deliveryLatitude, setDeliveryLatitude] = useState(null);
    const [deliveryLongitude, setDeliveryLongitude] = useState(null);
    const [deliveryAddress1, setDeliveryAddress1] = useState('');
    const [deliveryAddress2, setDeliveryAddress2] = useState('Dubai');
    const [deliveryArea, setDeliveryArea] = useState("");
    const [deliveryNearestLand, setDeliveryNearestLand] = useState('');
    const [cityData, setCityData] = useState([]);
    const [cityModal, setCityModal] = useState(false);
    const [googleMapModal, setGoogleMapModal] = useState(false);
    const [selectedValue, setSelectedValue] = useState('normal');
    const [paymentModal, setPaymentModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [userLocationModal, setUserLocationModal] = useState(false);
    const [userLastLocation, setUserLastLocation] = useState({});

    useEffect(() => {
        getLocation();
        getCityHandle();
        getUserLastLocation();
        // initStripe({
        //   publishableKey: "pk_test_51M4FRuBmPYKY5Nu3jm8gdDK21EYH80zOHlxGuZwIKhi2lLF3EPMs4DsGzlkAzvze7VUCKL7iQ6bi0H6kIbcIKehp00osClaLmY",
        //   // merchantIdentifier: 'merchant.identifier',
        // });
    }, [])
    const getCityHandle = () => {
        try {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        fetch("https://www.lavishdxb.com/api/city", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if (result?.code === 200) {
                setCityData(result?.data);
            }
        }).catch((error) => {
            console.log("ERROR =====> ", error?.message);
        });
        } catch (error) {
            console.log("ERROR =====> ", error?.message);
        }
    };
    const setUserAddressHandle = (data, details) => {
        const address = data?.description;
        const latitude = details?.geometry?.location?.lat;
        const longitude = details?.geometry?.location?.lng;
        setDeliveryLocation(address);
        setDeliveryLatitude(latitude);
        setDeliveryLongitude(longitude);
        // setGoogleMapModal(false);
    };
    const addPickUpLocation = async () => {
        try {
            const user_data = JSON.parse(await AsyncStorage.getItem("userData"));
            setLoader(true);
            var requestOptions = {
                method: 'POST',
                redirect: 'follow'
            };
            
            const shipping_method = selectedValue === "normal" ? 0 : 1;
            fetch(`https://www.lavishdxb.com/api/arrange/location?pickup_location=${pickupLocation}&building=${pickupAddress1}&city=${pickupAddress2}&area=${pickupArea}&aptt_villa_office=${pickupNearestLand}&pick_date=${pickupDate}&pick_time=${pickupTime}&user_id=${user_data?.id}&lat=${pickupLatitude}&long=${pickupLongitude}&shipping_method=${shipping_method}&same_address=no&delivery_location=${deliveryLocation}&d_building=${deliveryAddress1}&d_city=${deliveryAddress2}&d_area=${deliveryArea}&d_aptt_villa_office=${deliveryNearestLand}&d_lat=${deliveryLatitude}&d_long=${deliveryLongitude}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
                if (result?.code === 200) {
                    alert(result?.msg);
                    Navigation.push("AppStack",{component:{name:"Orders" , options: { topBar: { backButton:{ visible: true}, visible: true , title : { text : "Orders"} } } } })
                } else {
                    alert(result?.msg);
                }
            }).catch((error) => {
                setLoader(false);
                alert(error?.message);
            });
        } catch (error) {
            setLoader(false);
            alert(error?.message);
        }
    };
    const handleRadioButtonPress = (value) => {
        setSelectedValue(value);
    };
    const getLocation = async () => {
        const hasLocationPermission = await hasLocationPermissions();
        if (!hasLocationPermission) {
          return;
        };
        Geolocation.getCurrentPosition(
          (position) => {
            const currentLatitude = position.coords.latitude;
            setDeliveryLatitude(currentLatitude);
            
            const currentLongitude = position.coords.longitude;
            setDeliveryLongitude(currentLongitude);

            getLocationName(position.coords.latitude, position.coords.longitude);
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
    const getLocationName = async (lat, lng) => {
        try {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            Geocoder.init("AIzaSyA0C1LPhGrh_jgCTNU0blCVCFfeJmRZCbo");
            Geocoder.from(latitude, longitude)
            .then((response) => {
                const formatted_address = response?.results[0]?.formatted_address;
                setDeliveryLocation(formatted_address);
                // setGoogleMapModal(false);
            }).catch((error) => {
                alert(error?.message);
            });
        } catch (error) {
            alert(error?.message);
        }
    };
    const getUserLastLocation = async () => {
        try {
            const user_data = JSON.parse(await AsyncStorage.getItem("userData"));
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            
            fetch(`https://www.lavishdxb.com/api/user-address/${user_data?.id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result?.code === 200) {
                    setUserLastLocation(result?.address);
                };
            }).catch((error) => {
                console.log(error?.message);
            });
        } catch (error) {
            console.log(error?.message);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{paddingVertical:'5%',paddingHorizontal:20}}>
                    <View style={{marginTop:12}}>
                        <Text style={styles.title}>
                            Add Delivery details
                        </Text>
                        <TouchableOpacity
                            activeOpacity={.7}
                            onPress={() => setUserLocationModal(true)}>
                            <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"green"}}>
                                Select Last Delivery Location
                            </Text>
                        </TouchableOpacity>
                        <Text style={{fontSize:14,marginTop:6,marginBottom:8,fontWeight:"bold",color:"#000"}}>
                            Delivery Location
                        </Text>
                        <TouchableOpacity 
                            activeOpacity={.7}
                            style={[styles.input,{paddingVertical:10}]}
                            onPress={() => setGoogleMapModal(!googleMapModal)}>
                            <Text style={{color:deliveryLocation===""?"#CCC":"#000"}}>
                                {deliveryLocation === "" ? "Delivery Location" : deliveryLocation}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
                            Delivery Aptt. #/ villa # / Office #
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={deliveryNearestLand}
                            placeholderTextColor={"#CCC"}
                            placeholder="Delivery Aptt. #/ villa # / Office #"
                            onChangeText={setDeliveryNearestLand}
                        />
                        <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
                            Delivery Building Name
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Delivery Building Name "
                            value={deliveryAddress1}
                            placeholderTextColor={"#CCC"}
                            onChangeText={setDeliveryAddress1}
                        />
                        <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
                            Delivery Area
                        </Text>
                        <TouchableOpacity 
                            activeOpacity={.7}
                            onPress={() => setCityModal(!cityModal)}
                            style={[styles.input,{paddingVertical:10}]}>
                            <Text style={{color:deliveryArea===""?"#CCC":"#000"}}>
                                {deliveryArea === "" ? "Delivery Area" : deliveryArea}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
                            Delivery City
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Delivery City"
                            value={deliveryAddress2}
                            placeholderTextColor={"#CCC"}
                            onChangeText={setDeliveryAddress2}
                            editable={false}
                        />
                    </View>
                    <ContainerStripe>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => {
                                // checkout({
                                //     amount: "70.00$",
                                //     method: "card",
                                //     initPaymentSheet,
                                //     presentPaymentSheet
                                // });
                                if (deliveryLocation === '') {
                                    alert("Enter delivery location");
                                } else if (deliveryAddress1 === '') {
                                    alert("Enter delivery Address 1");
                                } else if (deliveryArea === '') {
                                    alert("Enter delivery city");
                                } else {
                                    setPaymentModal(!paymentModal);
                                }
                            }}>
                            <Text style={styles.buttonText}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </ContainerStripe>
                </View>
            </ScrollView>
            {/* CITY MODAL */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={cityModal}
                statusBarTranslucent>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeading}>
                            Select Area
                        </Text>
                        <View style={{marginBottom:8}}>
                            <CustomTextfield
                                value={searchText}
                                setValue={setSearchText}
                                placeholder="Search area"
                            />
                        </View>
                        <ScrollView>
                            {cityData?.map((val, key) => {
                                if(val?.city_name?.toLowerCase().includes(searchText?.toLowerCase())) {
                                    return (
                                        <TouchableOpacity
                                            key={key}
                                            activeOpacity={.8}
                                            onPress={() => {
                                                setDeliveryArea(val?.city_name);
                                                setCityModal(false);
                                            }}
                                            style={[styles.listStyle,{borderBottomWidth:cityData?.length-1===key?0:1}]}>
                                            <Text style={styles.listText}>
                                                {val?.city_name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }
                            })}
                        </ScrollView>
                        <TouchableOpacity
                            activeOpacity={.7}
                            style={{
                                padding: 15,
                                borderRadius: 6,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20,
                                backgroundColor: AppTheme.ButtonGreenColor,
                            }}
                            onPress={() => setCityModal(false)}>
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
            {/* SAVE ADDRESS MODAL */}
            <Modal
                transparent={true}
                statusBarTranslucent
                animationType={"fade"}
                visible={userLocationModal}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView,{height:Dimensions.get("window").height/2.2}]}>
                        <Text style={styles.modalHeading}>
                            Select Your Delivery Location
                        </Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {userLastLocation?.delivery_address?.map((val, key) => {
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        activeOpacity={.8}
                                        style={[styles.listStyle,{borderBottomWidth:
                                        userLastLocation?.delivery_address?.length-1===key?0:1}]}
                                        onPress={() => {
                                            setDeliveryLocation(val?.delivery_location);
                                            setDeliveryNearestLand(val?.delivery_appartment);
                                            setDeliveryAddress1(val?.delivery_building);
                                            setDeliveryArea(val?.delivery_area);
                                            setDeliveryLatitude(val?.delivery_lat);
                                            setDeliveryLongitude(val?.delivery_long);
                                            setUserLocationModal(false);
                                        }}>
                                        <Text style={styles.listText}>
                                            {val?.delivery_location}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                        <TouchableOpacity
                            activeOpacity={.7}
                            onPress={() => setUserLocationModal(false)}
                            style={{
                                padding: 15,
                                marginTop: 20,
                                borderRadius: 6,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: AppTheme.ButtonGreenColor,
                            }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#ffffff',
                                fontWeight: '700',
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                            }}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* LOCATION MODAL */}
            <Modal
                transparent={true}
                animationType={"slide"}
                visible={googleMapModal}
                statusBarTranslucent>
                <View style={styles.mapModalView}>
                    <View style={styles.mapViewInput}>
                        <GooglePlacesAutocomplete
                            placeholder='Enter Location'
                            placeholderTextColor="#000"
                            autoFocus={true}
                            returnKeyType={'default'}
                            fetchDetails={true}
                            onPress={(data, details = null) => setUserAddressHandle(data, details)}
                            query={{
                                language: 'en',
                                key: 'AIzaSyA0C1LPhGrh_jgCTNU0blCVCFfeJmRZCbo',
                            }}
                        />
                    </View>
                    <View style={{position:"relative",height:"100%",justifyContent:"center"}}>
                        {deliveryLatitude === null || 
                        deliveryLongitude === null ? null : 
                            <MapView
                                style={styles.mapStyle}
                                provider={PROVIDER_GOOGLE}
                                region={{
                                    latitudeDelta: 0.015,
                                    longitudeDelta: 0.0121,
                                    latitude: Number(deliveryLatitude),
                                    longitude: Number(deliveryLongitude),
                                }}
                                onRegionChange={(region) => {
                                    if(region?.latitude.toFixed(5) === Number(deliveryLatitude).toFixed(5)
                                        && region?.longitude.toFixed(5) === Number(deliveryLongitude).toFixed(5)) {
                                        return;
                                    } else {}
                                }}
                                onRegionChangeComplete = {(region) => {
                                    if(region?.latitude.toFixed(5) === Number(deliveryLatitude).toFixed(5)
                                        && region?.longitude.toFixed(5) === Number(deliveryLongitude).toFixed(5)) {
                                        return;
                                    } else {
                                        setDeliveryLatitude(region?.latitude);
                                        setDeliveryLongitude(region?.longitude);
                                        getLocationName(region?.latitude, region?.longitude);
                                    }
                                }}>
                            </MapView>
                        }
                        <View style={styles.userPinMain}>
                        <Animatable.View
                            duration={3000}
                            animation="fadeIn">
                            <Image
                            source={require('../Assets/pin.png')}
                            style={{height:50,width:50,resizeMode:"cover"}}
                            />
                        </Animatable.View>
                        </View>
                    </View>
                    <View style={{position:"relative",height:"100%",justifyContent:"center"}}>
                        {deliveryLatitude === null || deliveryLongitude === null ? null : 
                            <MapView
                                style={styles.mapStyle}
                                provider={PROVIDER_GOOGLE}
                                region={{
                                    latitudeDelta: 0.015,
                                    longitudeDelta: 0.0121,
                                    latitude: Number(deliveryLatitude),
                                    longitude: Number(deliveryLongitude),
                                }}
                                onRegionChange={(region) => {
                                    if(region?.latitude.toFixed(5) === Number(deliveryLatitude).toFixed(5)
                                        && region?.longitude.toFixed(5) === Number(deliveryLongitude).toFixed(5)) {
                                        return;
                                    } else {}
                                }}
                                onRegionChangeComplete = {(region) => {
                                    if(region?.latitude.toFixed(5) === Number(deliveryLatitude).toFixed(5)
                                        && region?.longitude.toFixed(5) === Number(deliveryLongitude).toFixed(5)) {
                                        return;
                                    } else {
                                        setDeliveryLatitude(region?.latitude);
                                        setDeliveryLongitude(region?.longitude);
                                        getLocationName(region?.latitude, region?.longitude);
                                    }
                                }}>
                            </MapView>
                        }
                        <View style={styles.userPinMain}>
                            <Animatable.View
                                duration={3000}
                                animation="fadeIn">
                                <Image
                                    source={require('../Assets/pin.png')}
                                    style={{height:50,width:50,resizeMode:"cover"}}
                                />
                            </Animatable.View>
                        </View>
                    </View>
                    <View style={{position:"absolute",bottom:20,right:20,left:20}}>
                        <View style={{flexDirection:"row"}}>
                            <TouchableOpacity
                                activeOpacity={.7}
                                style={{
                                flex: 1,
                                marginRight: 6,
                                borderRadius: 6,
                                paddingVertical: 15,
                                paddingHorizontal: 25,
                                justifyContent: 'center',
                                alignItems: "center",
                                backgroundColor: AppTheme.ButtonGreenColor,}}
                                onPress={() => setGoogleMapModal(false)}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#ffffff',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    backgroundColor: 'transparent',
                                }}>
                                    Done
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={.7}
                                onPress={getLocation}
                                style={{
                                    marginLeft: 6,
                                    borderRadius: 6,
                                    paddingVertical: 15,
                                    alignItems: "center",
                                    paddingHorizontal: 25,
                                    backgroundColor: "#FFF",
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={require('../Assets/my-location.png')}
                                    style={{height:25,width:25,resizeMode:"contain"}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* PAYMENT DELIVERY MODAL */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={paymentModal}
                statusBarTranslucent>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, {height:"auto"}]}>
                        <View style={{marginBottom:12}}>
                            <Text style={[styles.modalHeading,{textAlign:"center",paddingBottom:6,color:AppTheme.ButtonGreenColor}]}>
                                Choose your delivery method
                            </Text>
                            <RadioButton.Group
                                value={selectedValue}
                                onValueChange={handleRadioButtonPress}>
                                <View>
                                    <RadioButton.Item
                                        label="Normal Delivery"
                                        value="normal"
                                        color={AppTheme.ButtonGreenColor}
                                        onPress={() => handleRadioButtonPress('normal')}
                                    />
                                    <View style={{marginHorizontal:18}}>
                                        <Text style={[styles.listText,{opacity:.6,fontSize:12}]}>
                                            1) It will be deliver the day after tomorrow.{'\n'}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <RadioButton.Item
                                        label="Express Delivery"
                                        value="express"
                                        color={AppTheme.ButtonGreenColor}
                                        onPress={() => handleRadioButtonPress('express')}
                                    />
                                    <View style={{marginHorizontal:18}}>
                                        <Text style={[styles.listText,{opacity:.6,fontSize:12}]}>
                                            1) The price of express delivery is double the price of normal charges.{'\n'}
                                        </Text>
                                        <Text style={[styles.listText,{opacity:.6,fontSize:12}]}>
                                            2) Delivery will be next working day morning 10am - 11:59 am.
                                        </Text>
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </View>
                        <View style={{marginHorizontal:14}}>
                            <Text style={{color:"red"}}>
                                Delivery charges applicable *
                            </Text>
                            <View style={{flexDirection:"row"}}>
                                <TouchableOpacity
                                    activeOpacity={.7}
                                    style={{
                                        flex:1,
                                        padding: 15,
                                        marginRight:6,
                                        borderRadius: 6,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 20,
                                        backgroundColor: AppTheme.ButtonGreenColor,
                                    }}
                                    onPress={addPickUpLocation}>
                                    <Text 
                                        style={{
                                            fontSize: 16,
                                            textAlign: 'center',
                                            color: '#ffffff',
                                            backgroundColor: 'transparent',
                                            fontWeight: '700',
                                        }}>
                                        Done
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={.7}
                                    style={{
                                        flex:1,
                                        padding: 15,
                                        borderRadius: 6,
                                        marginLeft:6,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 20,
                                        backgroundColor: "#FFF",
                                        borderWidth:1,
                                        borderColor:AppTheme.ButtonGreenColor,
                                    }}
                                    onPress={() => setPaymentModal(false)}>
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
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 22,
        textAlign: 'left',
        fontWeight: "700",
        marginBottom: 20,
        color:"#000"
    },
    input: {
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 14,
        width: '100%',
        alignSelf: "center",
        color: 'black'
    },
    label: {
        marginBottom: 5,
        color: 'gray',
        fontSize: 12
    },
    datePicker: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
        alignSelf: "center"
    },
    button: {
        backgroundColor: AppTheme.PrimaryColor,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
        color:"#fff"
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
    mapModalView: {
        flex: 1,
        width: "100%",
        backgroundColor: "#FFF",
        height: Dimensions.get('window').height,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    mapViewInput: {
        position: "absolute",
        top: 20,
        right: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginVertical: 20,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    mapViewButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: AppTheme.ButtonGreenColor,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 20,
        marginVertical: 20,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    mapStyle: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    userPinMain: {
        alignSelf: "center",
        position: "absolute",
        alignContent: "center",
    },
    userPinDot: {
        width: 12,
        height: 12,
        borderRadius: 100,
        backgroundColor: "#dd342e",
    },
});

export default DeliveryForm;