import React from 'react';
import {View, Image, ScrollView, Dimensions, useColorScheme} from 'react-native';

const PriceList = () => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';

    return(
        <View style={{flex:1,backgroundColor:isDarkTheme?"#000":"#FFF"}}>
            <ScrollView>
                <Image
                    source={require('../Assets/price-list.jpeg')}
                    style={{height:Dimensions.get("window").height/1.1,width:"100%",resizeMode:"contain"}}
                />
            </ScrollView>
        </View>
    )
}

export default PriceList;