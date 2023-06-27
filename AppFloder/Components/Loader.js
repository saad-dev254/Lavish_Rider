import React from 'react';
import { View, Text, ActivityIndicator, Platform, Modal } from 'react-native';
import { AppTheme } from '../AppTheme/AppTheme';
const Loader = ({
    color = AppTheme.PrimaryColor,
    style,
    size = 80,
    name = "",
    loading,
    setLoading
}) => {
    return (
        <Modal
            style={{}}
            visible={loading}
            transparent={true}
            >
            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <ActivityIndicator
                    style={{width : 100 , height : 100}}
                    size={size}
                    color={color}
                />
            </View>
        </Modal>

    )
}
export default Loader;






