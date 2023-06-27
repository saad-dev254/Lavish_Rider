import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';

const ContactUs = () => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    return(
        <View style={{flex:1,backgroundColor:"#FFF"}}>
            <View style={[styles.boxStyle,{backgroundColor:isDarkTheme?"#000":"#FFF",marginTop:20}]}>
                <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:16,fontWeight:"bold",marginBottom:6}}>
                    Post Address
                </Text>
                <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:14}}>
                    Majestic Tower - Business Bay - Dubai - United Arab Emirates
                </Text>
            </View>
            <TouchableOpacity 
                activeOpacity={.7}
                style={[styles.boxStyle,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}
                onPress={() => Linking.openURL(`tel:+971589152400`)}>
                <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:16,fontWeight:"bold",marginBottom:6}}>
                    Phone
                </Text>
                <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:14}}>
                    +971589152400
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                activeOpacity={.7}
                style={[styles.boxStyle,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}
                onPress={() => Linking.openURL(`mailto:info@lavishdxb.com`)}>
                <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:16,fontWeight:"bold",marginBottom:6}}>
                    E-mail Address
                </Text>
                <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:14}}>
                    info@lavishdxb.com
                </Text>
            </TouchableOpacity>
            <View style={[styles.boxStyle,{backgroundColor:isDarkTheme?"#000":"#FFF"}]}>
                <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:16,fontWeight:"bold",marginBottom:6}}>
                    Opening Hours
                </Text>
                <Text style={{color:isDarkTheme?"#FFF":"#000",fontSize:14}}>
                    Mon-Fri 08:00 AM - 05:00 PM{'\n'}
                    Sat-Sun 10:00 AM - 5:00 PM
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    boxStyle: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
        marginTop: 14,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    }
})

export default ContactUs;