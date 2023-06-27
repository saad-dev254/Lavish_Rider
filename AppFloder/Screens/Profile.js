import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, useColorScheme, ActivityIndicator, Image, Modal } from 'react-native';
import { editProfile, pickUP } from '../Components/Api';
import {CountryPicker} from "react-native-country-codes-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppTheme } from '../AppTheme/AppTheme';
import { Navigation } from 'react-native-navigation';
import { CustomTextfield } from '../Components/General';
import BottomBar from '../Components/BottomBar';
import ImagePicker from 'react-native-image-crop-picker';

const Profile = (props) => {
  const {routeName} = props;
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';
  const [loader, setLoader] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [pictureModal, setPictureModal] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    getUserDataHandle();
  }, []);
  const getUserDataHandle = async () => {
    try {
      const user_data = JSON.parse(await AsyncStorage.getItem("userData"));
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch(`https://www.lavishdxb.com/api/user/${user_data?.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result?.code === 200) {
          setUserName(result?.user?.name);
          setUserEmail(result?.user?.email);
          setUserNumber(result?.user?.mobile);
          setCountryCode(result?.user?.country_code);
          AsyncStorage.setItem("userData", JSON.stringify(result?.user));
        }
      }).catch((error) => {
        alert(error?.message);  
      });
    } catch (error) {
      alert(error?.message);
    }
  };
  function processNumber(number) {
    if (number.charAt(0) === '0') {
      return number.slice(1);
    } else {
      return number;
    }
  };
  const updateProfile = async () => {
    try {
      setLoader(true);
      const user_data = JSON.parse(await AsyncStorage.getItem("userData"));
      var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };
      
      var processedNumber = processNumber(userNumber);

      fetch(`https://www.lavishdxb.com/api/user/update/${user_data?.id}?name=${userName}&country_code=${countryCode}&mobile=${processedNumber}&profile=update`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setLoader(false);
        if (result.code === 200) {
          getUserDataHandle();
          alert(result?.msg);
        } else {
          alert(result?.msg);
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
  const selectImageFromGallery = () => {
    try {
      setPictureModal(false);
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(response => {
        setProfileImage(response?.path);
        // setImageObject({
        //   name: 'image.jpg',
        //   uri: response?.path,
        //   type: response?.mime,
        // });
      }).catch((error) => {
        setPictureModal(false);
        alert(error?.message);
      })
    } catch (error) {
      setPictureModal(false);
      alert(error?.message);
    }
  };
  const selectImageFromCamera = () => {
    try {
      setPictureModal(false);
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then((response) => {
        setProfileImage(response?.path);
        // setImageObject({
        //   name: 'image.jpg',
        //   uri: response?.path,
        //   type: response?.mime,
        // });
      }).catch((error) => {
        setPictureModal(false);
        alert(error?.message);
      })
    } catch (error) {
      setPictureModal(false);
      alert(error?.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Add Your Profile Picture</Text>
          <TouchableOpacity
            activeOpacity={.7}
            style={styles.imageBgStyle}
            onPress={() => setPictureModal(!pictureModal)}>
            <Image
              style={{height:"100%",width:"100%",resizeMode:"cover",borderRadius:8}}
              source={profileImage === "" ? require('../Assets/no-image-found.jpeg') : {uri: profileImage}}
            />
          </TouchableOpacity>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={userName}
            style={styles.input}
            placeholder="Enter your name"
            onChangeText={(text) => setUserName(text)}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            editable={false}
            value={userEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          <View style={{flexDirection:"row",marginBottom:20}}>
            <View style={{flex:.5,justifyContent:"center",marginRight:6}}>
              <Text style={styles.label}>Country Code</Text>
              <TouchableOpacity 
                activeOpacity={.7}
                onPress={() => setShow(!show)}
                style={{
                marginTop: 6,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 8,
                paddingVertical:10}}>
                <Text style={{color:countryCode===""?"#CCC":"#000"}}>
                  {countryCode === "" ? "Country Code" : countryCode}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex:1,justifyContent:"center",marginLeft:6}}>
              <Text style={styles.label}>Mobile No</Text>
              {/* <TextInput
                value={userNumber}
                style={[styles.input,{marginBottom:0}]}
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
                onChangeText={(text) => setUserNumber(text)}
              /> */}
              <CustomTextfield
                value={userNumber}
                setValue={setUserNumber}
                style={{marginTop:6}}
                placeholder="Mobile No" 
              />
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => {
              if (userName === "") {
                alert("Enter your name");
              } else if (countryCode === "") {
                alert("Select your country code");
              } else if (userNumber === "") {
                alert("Enter your number");
              } else {
                updateProfile();
              }
            }}
            style={styles.updateButton}>
            {loader ? 
              <ActivityIndicator color={"#FFF"} />
            :
              <Text style={styles.buttonText}>Update Profile</Text> 
            }
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => {
              AsyncStorage.removeItem("userData");
              Navigation.push("AppStack", { component: { name: "Signin", options: { topBar: { visible: false } } } })
            }}
            style={[styles.updateButton,{backgroundColor:"#FFF",borderWidth:1,borderColor:AppTheme.ButtonGreenColor}]}>
            <Text style={[styles.buttonText,{color:AppTheme.ButtonGreenColor}]}>Logout</Text> 
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* For showing picker just put show state to show prop */}
      <CountryPicker
        show={show}
        style={{
          modal: {
            height: 500,
          },
        }}
        onBackdropPress={() => setShow(false)}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
      />
      {/* PICTURE SELECT MODAL */}
      <Modal
        transparent={true}
        animationType={"fade"}
        visible={pictureModal}
        statusBarTranslucent>
        <View style={styles.centeredView}>
          <View style={[styles.modalView,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop : 150
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  imageBgStyle: {
    backgroundColor: "#dddddd",
    height: 200,
    width: "100%",
    marginBottom: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: AppTheme.ButtonGreenColor,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  changePasswordButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
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
    elevation: 5
  },   
  modalHeading: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
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
});
export default Profile;