import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  DatePickerIOS,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { AppTheme } from '../AppTheme/AppTheme';

const DelieveryForm = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [area, setArea] = useState('');
  const [nearestLand, setNearestLand] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());

  const handleSubmit = () => {
    // Add your form submission logic here (e.g., send data to your server)

    console.log('Form submitted:', {
      pickupLocation,
      address1,
      address2,
      area,
      nearestLand,
      pickupDate,
      pickupTime,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please add Delivery details</Text>
      <TextInput
        style={styles.input}
        placeholder="Delivery Location"
        onChangeText={setPickupLocation}
        value={pickupLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Address 1"
        onChangeText={setAddress1}
        value={address1}
      />
      <TextInput
        style={styles.input}
        placeholder="Address 2"
        onChangeText={setAddress2}
        value={address2}
      />
      <TextInput
        style={styles.input}
        placeholder="Area"
        onChangeText={setArea}
        value={area}
      />
      <TextInput
 style={styles.input}
        placeholder="Nearest Land"
        onChangeText={setNearestLand}
        value={nearestLand}
      />

      <View style = {styles.input}>
      <Text style={styles.label}>Delivery Date</Text>
      <DateTimePicker
        value={pickupDate}
        onDateChange={setPickupDate}
        mode={"date"}
        style={styles.datePicker}
      />
      </View>
      <View style = {styles.input}>

      <Text style={styles.label}>Delivery Time</Text>

       <DateTimePicker
        // date={pickupTime}
        value = {pickupTime}
        onDateChange={setPickupTime}
        mode={"time"}
        style={styles.datePicker}
      />
             </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginTop : '10%'
     
    

  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    width:'80%',
    alignSelf: "center",
    height : 44 
    , color : 'black'
  },
  label: {
     marginBottom: 5,
    color : 'gray',
    fontSize : 12
  },
  datePicker: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
     
    width:'80%',
    alignSelf: "center"
    
  },
  button: {
    backgroundColor: AppTheme.PrimaryColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    width:'80%',
   },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',

  },
});
 
export default DelieveryForm