import React, { useEffect, useState } from 'react';
import {ActivityIndicator, ScrollView, Text, View, useColorScheme} from 'react-native';

const Faqs = () => {
    const theme = useColorScheme();
    const isDarkTheme = theme === 'dark';
    const [loader, setLoader] = useState(false);
    const [faqsData, setFaqsData] = useState([]);

    useEffect(() => {
        getFaqsDataHandle();
    }, []);
    const getFaqsDataHandle = () => {
        try {
            setLoader(true);
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("https://www.lavishdxb.com/api/Faqs", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
                if (result?.code === 200) {
                    setFaqsData(result?.faqs);
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

    if (loader) {
        return (
            <View style={{flex:1,backgroundColor:isDarkTheme?"#000":"#FFF",alignItems:"center",justifyContent:"center"}}>
                <ActivityIndicator size={"large"} />
            </View>
        )
    } else {
        return(
            <View style={{flex:1,backgroundColor:isDarkTheme?"#000":"#FFF"}}>
                <ScrollView>
                    <View style={{paddingVertical:16,paddingHorizontal:12}}>
                        {faqsData?.map((val, key) => {
                            return (
                                <>
                                    <View style={{
                                    flexDirection:"row",
                                    backgroundColor:"#CCC",
                                    marginTop:key===0?0:12,
                                    borderTopLeftRadius:12,
                                    borderTopRightRadius:12,
                                    paddingHorizontal:14,
                                    paddingVertical:12,
                                    shadowColor:"#000",
                                    shadowOffset: {
                                        width:0,
                                        height:5,
                                    },
                                    shadowOpacity:0.34,
                                    shadowRadius:6.27,
                                    elevation:10}}>
                                        <View style={{flex:1,justifyContent:"center"}}>
                                            <Text style={{color:"#000",fontSize:14,fontWeight:"bold",textTransform:"capitalize"}}>
                                                {val?.question}
                                            </Text>
                                        </View>
                                        <View style={{justifyContent:"center"}}>
                                            {/* <Text style={{color:"#000",fontSize:14,fontWeight:"bold"}}>
                                                {val?.answer}
                                            </Text> */}
                                        </View>
                                    </View>
                                    <View style={{backgroundColor:"#EEE",borderBottomLeftRadius:12,borderBottomRightRadius:12,paddingHorizontal:14,paddingVertical:12}}>
                                        <Text style={{color:"#000",fontSize:12}}>
                                            {val?.answer}
                                        </Text>
                                    </View>
                                </>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Faqs;