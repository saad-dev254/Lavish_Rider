import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Dimensions, ScrollView, ActivityIndicator, FlatList, Alert, Linking, ToastAndroid, PermissionsAndroid, Platform, Image } from 'react-native';
import { initStripe, StripeProvider } from '@stripe/stripe-react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppTheme } from '../AppTheme/AppTheme';
import Loader from '../Components/Loader';
import StripPaymentScreen, { checkout, ContainerStripe } from './StripePayment';
import { usePaymentSheet } from '@stripe/stripe-react-native';
import moment from 'moment';
import { RadioButton } from 'react-native-paper';
import { Navigation } from "react-native-navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import * as Animatable from 'react-native-animatable';
import Geocoder from 'react-native-geocoding';
import { CustomTextfield } from '../Components/General';

const PickupForm = () => {
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const [loader, setLoader] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupLatitude, setPickupLatitude] = useState(null);
  const [pickupLongitude, setPickupLongitude] = useState(null);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('Dubai');
  const [area, setArea] = useState("");
  const [nearestLand, setNearestLand] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState("");
  const [pickupTimeIndex, setPickupTimeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [cityModal, setCityModal] = useState(false);
  const [googleMapModal, setGoogleMapModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState('normal');
  const [delivertStatus, setDelivertStatus] = useState('yes');
  const [paymentModal, setPaymentModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [userLocationModal, setUserLocationModal] = useState(false);
  const [userLastLocation, setUserLastLocation] = useState({});
  
  useEffect(() => {
    getLocation();
    getCityHandle();
    getTimesHandle();
    getUserLastLocation();
    // initStripe({
    //   publishableKey: "pk_test_51M4FRuBmPYKY5Nu3jm8gdDK21EYH80zOHlxGuZwIKhi2lLF3EPMs4DsGzlkAzvze7VUCKL7iQ6bi0H6kIbcIKehp00osClaLmY",
    //   // merchantIdentifier: 'merchant.identifier',
    // });
  }, []);
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
        }
      }).catch((error) => {
        console.log(error?.message);
      });
    } catch (error) {
      console.log(error?.message);
    }
  };
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
  const getTimesHandle = () => {
    try {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("https://www.lavishdxb.com/api/time", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.code === 200) {
          setTimeData(result?.data);
          setPickupTime(result?.data[0]?.times);
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
    setPickupLocation(address);
    setPickupLatitude(latitude);
    setPickupLongitude(longitude);
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
      fetch(`https://www.lavishdxb.com/api/arrange/location?pickup_location=${pickupLocation}&building=${address1}&city=${address2}&area=${area}&aptt_villa_office=${nearestLand}&pick_date=${pickupDate}&pick_time=${pickupTime}&user_id=${user_data?.id}&lat=${pickupLatitude}&long=${pickupLongitude}&shipping_method=${shipping_method}&same_address=${delivertStatus}&delivery_location=&d_building=&d_city=&d_area=&d_aptt_villa_office=&d_lat=&d_long=`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("result =====> ", result);
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
  const handleDeliveryRadioButtonPress = (value) => {
    console.log(value)
    setDelivertStatus(value);
  };
  const getLocation = async () => {
    const hasLocationPermission = await hasLocationPermissions();
    if (!hasLocationPermission) {
      return;
    };
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLatitude = position.coords.latitude;
        setPickupLatitude(currentLatitude);
        
        const currentLongitude = position.coords.longitude;
        setPickupLongitude(currentLongitude);

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
        setPickupLocation(formatted_address);
        // setGoogleMapModal(false);
      }).catch((error) => {
        alert(error?.message);
      });
    } catch (error) {
      alert(error?.message);
    }
  };
  const renderItem = ({index, item}) => {
    const even = index % 2 == 0;
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={.8}
        onPress={() => {
          setPickupTimeIndex(index);
          setPickupTime(item?.times);
        }}
        style={{width:"48%",backgroundColor:index===pickupTimeIndex?AppTheme.ButtonGreenColor:"#FFF",marginBottom:12,
        borderColor:AppTheme.ButtonGreenColor,borderWidth:1,paddingVertical:14,marginRight:even?12:0,borderRadius:8}}>
        <Text style={{color:index===pickupTimeIndex?"#FFF":AppTheme.ButtonGreenColor,
        fontWeight:index===pickupTimeIndex?"bold":"normal",fontSize:14,textAlign:"center"}}>
          {item?.times}
        </Text>
      </TouchableOpacity>
    )
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{paddingVertical:"5%",paddingHorizontal:20}}>
          <Text style={styles.title}>
            Add Pickup Details
          </Text>
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => setUserLocationModal(true)}>
            <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"green"}}>
              Select Last Pickup Location
            </Text>
          </TouchableOpacity>
          <Text style={{fontSize:14,marginTop:6,marginBottom:8,fontWeight:"bold",color:"#000"}}>
            PickUp Location
          </Text>
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => setGoogleMapModal(!googleMapModal)}
            style={[styles.input,{paddingVertical:10}]}>
            <Text style={{color:pickupLocation===""?"#CCC":"#000"}}>
              {pickupLocation === "" ? "PickUp Location" : pickupLocation}
            </Text>
          </TouchableOpacity>
          <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
            Aptt. #/ villa # / Office #
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Aptt. #/ villa # / Office #"
            placeholderTextColor={"#CCC"}
            onChangeText={setNearestLand}
            value={nearestLand}
          />
          <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
            Building Name
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Building Name"
            placeholderTextColor={"#CCC"}
            onChangeText={(text) => setAddress1(text)}
            value={address1}
          />
          <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
            Area
          </Text>
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => setCityModal(!cityModal)}
            style={[styles.input,{paddingVertical:10}]}>
            <Text style={{color:area===""?"#CCC":"#000"}}>
              {area === "" ? "Area" : area}
            </Text>
          </TouchableOpacity>
          <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
            City
          </Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor={"#CCC"}
            onChangeText={setAddress2}
            value={address2}
            editable={false}
          />
          <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
            Pickup Date
          </Text>
          <TouchableOpacity
            activeOpacity={.7}
            style={styles.input}
            onPress={() => setIsDateOpen(!isDateOpen)}>
            <Text style={styles.label}>Pickup Date</Text>
            <Text style={[styles.label,{color:"#000"}]}>
              {moment(pickupDate).format("MMM Do YYYY")}
            </Text>
          </TouchableOpacity>
          <Text style={{fontSize:14,marginBottom:8,fontWeight:"bold",color:"#000"}}>
            Pickup Time
          </Text>
          <FlatList
            data={timeData}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
          <View style={{marginTop:8}}>
            <Text style={{color:'gray',fontWeight:'bold',textAlign:'left'}}>
              Is the delievery address same as pickup?
            </Text>
            <RadioButton.Group
              value={delivertStatus}
              onValueChange={handleDeliveryRadioButtonPress}>
              <View style={{flexDirection:"row"}}>
                <View style={{flex:1,justifyContent:"center"}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <RadioButton value={'yes'} color={AppTheme.ButtonGreenColor} />
                  <Text style={{color:"#000",fontSize:14}}>Yes</Text>
                </View>
                </View>
                <View style={{flex:1,justifyContent:"center"}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <RadioButton value={'no'} color={AppTheme.ButtonGreenColor} />
                    <Text style={{color:"#000",fontSize:14}}>No</Text>
                  </View>
                </View>
              </View>
            </RadioButton.Group>
            <TouchableOpacity
              activeOpacity={.7}
              style={styles.button}
              onPress={() => {
                if (pickupLocation === '') {
                  alert("Enter pickup location");
                } else if (address1 === '') {
                  alert("Enter pickup Address 1");
                } else if (area === '') {
                  alert("Enter pickup city");
                } else if (nearestLand === "") {
                  alert("Enter pickup nearest land");
                } else if (pickupTime === "") {
                  alert("Enter pickup time");
                } else {
                  if (delivertStatus === "yes") {
                    setPaymentModal(!paymentModal);
                  } else {
                    Navigation.push("AppStack", { component: 
                      {passProps: {
                        pickupLocation: pickupLocation,
                        pickupLatitude: pickupLatitude,
                        pickupLongitude: pickupLongitude,
                        pickupAddress1: address1,
                        pickupAddress2: address2,
                        pickupArea: area,
                        pickupNearestLand: nearestLand,
                        pickupDate: pickupDate,
                        pickupTime: pickupTime,
                      },
                      name: "DeliveryForm",
                      options: {topBar: 
                        {backButton: {visible: true}, 
                        visible: true , 
                        title : {text: "Delivery Form"}}
                      }
                    }})
                  }
                }
              }}>
              <Text style={styles.buttonText}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {isDateOpen ?
        <DateTimePicker
          mode={"date"}
          value={pickupDate}
          style={styles.datePicker}
          onDateChange={setPickupDate}
        />
      :null}
      {/* <View style={{flexDirection:"row"}}>
        <CheckBox
          disabled={false}
          value={toggleCheckBox}
          tintColor={AppTheme.PrimaryColor}
          onTintColor={AppTheme.PrimaryColor}
          onCheckColor={AppTheme.PrimaryColor}
          onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
        />
        <Text style={{
          color: 'gray',
          fontWeight: 'bold',
          alignSelf: 'center',
        }}>Is the delievery address same as pickup?</Text>
      </View> */}
      {/* <ContainerStripe> */}
      {/* </ContainerStripe> */}
      {/* <StripPaymentScreen /> */}
      <Loader loading={loading} />
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
            <ScrollView showsVerticalScrollIndicator={false}>
              {cityData?.map((val, key) => {
                if(val?.city_name?.toLowerCase().includes(searchText?.toLowerCase())) {
                  return (
                    <TouchableOpacity
                      key={key}
                      activeOpacity={.8}
                      onPress={() => {
                        setArea(val?.city_name);
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
              Select Your PickUp Location
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {userLastLocation?.pickup_address?.map((val, key) => {
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={.8}
                    onPress={() => {
                      setPickupLocation(val?.pickup_location);
                      setNearestLand(val?.pickup_appartment);
                      setAddress1(val?.pickup_building);
                      setArea(val?.pickup_area);
                      setPickupLatitude(val?.lat);
                      setPickupLongitude(val?.long);
                      setUserLocationModal(false);
                    }}
                    style={[styles.listStyle,{borderBottomWidth:
                    userLastLocation?.pickup_address?.length-1===key?0:1}]}>
                    <Text style={styles.listText}>
                      {val?.pickup_location}
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
            {pickupLatitude === null || 
            pickupLongitude === null ? null : 
              <MapView
                style={styles.mapStyle}
                provider={PROVIDER_GOOGLE}
                region={{
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                  latitude: Number(pickupLatitude),
                  longitude: Number(pickupLongitude),
                }}
                onRegionChange={(region) => {
                  if(region?.latitude.toFixed(5) === Number(pickupLatitude).toFixed(5)
                    && region?.longitude.toFixed(5) === Number(pickupLongitude).toFixed(5)) {
                    return;
                  } else {}
                }}
                onRegionChangeComplete = {(region) => {
                  if(region?.latitude.toFixed(5) === Number(pickupLatitude).toFixed(5)
                    && region?.longitude.toFixed(5) === Number(pickupLongitude).toFixed(5)) {
                    return;
                  } else {
                    setPickupLatitude(region?.latitude);
                    setPickupLongitude(region?.longitude);
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
                alignItems: "center",
                paddingHorizontal: 25,
                justifyContent: 'center',
                backgroundColor: AppTheme.ButtonGreenColor}}
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
                  borderRadius: 6,
                  marginLeft: 6,
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
      {/* TIME MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isTimeOpen}
        statusBarTranslucent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeading}>
              Select Pickup Time
            </Text>
            <ScrollView>
              {timeData?.map((val, key) => {
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={.8}
                    onPress={() => {
                      setPickupTime(val?.times);
                      setIsTimeOpen(false);
                    }}
                    style={[styles.listStyle,{borderBottomWidth:timeData?.length-1===key?0:1}]}>
                    <Text style={styles.listText}>
                      {val?.times}
                    </Text>
                  </TouchableOpacity>
                )
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
              onPress={() => setIsTimeOpen(false)}>
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
                </View>
                <View>
                    <RadioButton.Item
                      label="Express Delivery"
                      value="express"
                      color={AppTheme.ButtonGreenColor}
                      onPress={() => handleRadioButtonPress('express')}
                    />
                </View>
              </RadioButton.Group>
              <View style={{marginHorizontal:14}}>
                <Text style={[styles.modalHeading,{fontSize:18,textAlign:"left",paddingBottom:6,color:AppTheme.ButtonGreenColor}]}>
                  Normal Delivery:
                </Text>
                <Text style={[styles.listText,{opacity:.6,fontSize:12}]}>
                  1) It will be deliver the day after tomorrow.{'\n'}
                </Text>
              </View>
              <View style={{marginTop:12,marginHorizontal:14}}>
                <Text style={[styles.modalHeading,{fontSize:18,textAlign:"left",paddingBottom:6,color:AppTheme.ButtonGreenColor}]}>
                  Express Delivery:
                </Text>
                <Text style={[styles.listText,{opacity:.6,fontSize:12}]}>
                  1) The price of express delivery is double the price of normal charges.{'\n'}
                </Text>
                <Text style={[styles.listText,{opacity:.6,fontSize:12}]}>
                  2) Delivery will be next working day morning 10am - 11:59 am.
                </Text>
              </View>
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
                  {loader ? 
                    <ActivityIndicator color={"#FFF"} />
                  :
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
                  }
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
  radioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  radioButtonLabel: {
    marginLeft: 'auto',
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
    color:"#fff",
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

export default PickupForm;