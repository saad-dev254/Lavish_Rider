import React from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from "react-native";
import {Navigation} from "react-native-navigation";
import Carousel from 'react-native-banner-carousel';
import { AppTheme } from "../AppTheme/AppTheme";

export const {width, height} = Dimensions.get('screen');

const welcomeData = [
    {id: 1, heading: "Make Order", image: require("../Assets/welcome-01.png"), description: "Fast and Reliable Service: Our dedicated team ensures a quick turnaround time for your laundry needs. Quality Cleaning: We use high-quality detergents and follow industry-standard cleaning practices to keep your clothes looking their best. Convenient Pickup and Delivery: We offer flexible pickup and delivery options to fit your busy schedule."},
    {id: 2, heading: "Choose Payment", image: require("../Assets/welcome-02.png"), description: "Fast and Reliable Service: Our dedicated team ensures a quick turnaround time for your laundry needs. Quality Cleaning: We use high-quality detergents and follow industry-standard cleaning practices to keep your clothes looking their best. Convenient Pickup and Delivery: We offer flexible pickup and delivery options to fit your busy schedule."},
    {id: 3, heading: "Fast Delivery", image: require("../Assets/welcome-03.png"), description: "Fast and Reliable Service: Our dedicated team ensures a quick turnaround time for your laundry needs. Quality Cleaning: We use high-quality detergents and follow industry-standard cleaning practices to keep your clothes looking their best. Convenient Pickup and Delivery: We offer flexible pickup and delivery options to fit your busy schedule."},
];

const Tutorial = () => {
    return (
        <View style={[styles.mainStyle,{flex:1,justifyContent:"center",alignItems:"center"}]}>
            <Carousel
                index={0}
                loop={false}
                autoplay={false}
                pageSize={width}>
                {welcomeData?.map((val, key) => (
                    <View key={key} style={styles.contentContainer}>
                        <ScrollPages value={val} />
                    </View>
                ))}
            </Carousel>
        </View>
    )
};

const ScrollPages = ({value}) => {
    const {width, height} = Dimensions.get('screen');

    return (
        <View style={[styles.mainStyle,{alignItems:"center"}]}>
            <View style={{marginBottom:20}}>
                <Text style={{color:AppTheme.ButtonGreenColor,fontSize:28,fontWeight:"bold",textAlign:"center",textTransform:"uppercase"}}>
                    {value?.heading}
                </Text>
            </View>
            <Image
                source={value?.image}
                resizeMode={"contain"}
                style={{width:width*0.9,height:height*0.4,marginTop:0}}
            />
            <View style={{margin:20}}>
                <Text style={{fontSize:18,textAlign:"center"}}>
                    {value?.description}
                </Text>
            </View>
            <TouchableOpacity
                activeOpacity={.7}
                onPress={() => {
                    Navigation.push("AppStack", { component: { name: "Signin", options: { topBar: { visible: false } } } })
                }}
                style={{backgroundColor:AppTheme.ButtonGreenColor,borderRadius:100,paddingVertical:16,paddingHorizontal:60}}>
                <Text style={{color:"#FFF",fontSize:14,fontWeight:"700",textAlign:"center"}}>
                    Get Start
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainStyle: {
        marginTop: "2%"
    },
    container: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Tutorial;