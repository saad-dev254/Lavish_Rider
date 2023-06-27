import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {AppTheme} from '../AppTheme/AppTheme';
import {CardField, useStripe} from '@stripe/stripe-react-native';

const AddCard = () => {
    const {confirmPayment} = useStripe();

    useEffect(() => {
        initStripe({
            urlScheme: "your-url-scheme",
            merchantIdentifier: 'merchant.com.{{YOUR_APP_NAME}}',
            publishableKey: "pk_test_51M4FRuBmPYKY5Nu3jm8gdDK21EYH80zOHlxGuZwIKhi2lLF3EPMs4DsGzlkAzvze7VUCKL7iQ6bi0H6kIbcIKehp00osClaLmY",
        });
    }, []);
    const handleCardSubmission = async () => {
        const { paymentMethod, error } = await confirmPayment({
            type: 'Card',
            billingDetails: {
                // Provide billing details if needed
            },
        });
        
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Payment method:', paymentMethod);
            // Perform further actions with the obtained paymentMethod
        }
    };

    return(
        <View style={styles.container}>
            <CardField
                postalCodeEnabled={false}
                placeholder={{
                    number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#000000',
                    fontSize: 16,
                    placeholderColor: '#999999',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                }}
                style={styles.cardField}
                onCardChange={(cardDetails) => {
                    console.log('cardDetails', cardDetails);
                }}
                onFocus={(focusedField) => {
                    console.log('focusField', focusedField);
                }}
            />
            <TouchableOpacity
                activeOpacity={.7}
                style={styles.submitButton}
                onPress={handleCardSubmission}>
                <Text style={styles.submitButtonText}>
                    Submit Card
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    cardField: {
        width: '100%',
        height: 50,
        marginVertical: 10,
    },    
    submitButton: {
        backgroundColor: AppTheme.ButtonGreenColor,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 10,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});  

export default AddCard;