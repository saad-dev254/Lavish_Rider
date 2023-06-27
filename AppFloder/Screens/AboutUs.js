import React, { useState } from 'react';
import {View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';

const AboutUs = () => {
    const [isLoading, setIsLoading] = useState(false);

    return(
        <View style={{flex:1,backgroundColor:"#FFF"}}>
            <WebView
                style={{flex:1}}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                source={{uri: 'https://lavishdxb.com/about'}}
            />
            {isLoading && (
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}
        </View>
    )
}

export default AboutUs;