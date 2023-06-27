import React, { useState } from "react";

import {
    CardField,
    CardFieldInput,
    useStripe,
    StripeProvider,
    presentPaymentSheet,
    usePaymentSheet
    // initPaymentSheet
} from '@stripe/stripe-react-native';
// import { apiPost } from "../../ApiManager";
// import { API } from "../../ApiManager/Api";
import { TouchableOpacity, Text } from "react-native";
import axios from "axios";

const StripPaymentScreen = () => {

    const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();

    // useEffect(() => {
    //     // initializePaymentSheet();
    // }, []);    
    const fetchPaymentSheetParams = async () => {
        // // const { error, data } = await apiPost({
        // //     url: API.PROCEED_PAYMENT,
        // //     isBearer: true,
        // //     isLocal: true,
        // //     body: {
        // //         "currency": "usd",
        // //         "amount": 40,
        // //         "method": "card",
        // //     }
        // // })
        // console.log(JSON.stringify(data, null, 2));
        // if (error) {
        //     return { serverError: error }
        // }
        return {};

    }

    const initializePaymentSheet = async () => {

        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
            serverError
        } = await fetchPaymentSheetParams();
        if (serverError) return;

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Digipax",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,

            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: false,
            defaultBillingDetails: {
                name: 'Jane Doe',
            },
            googlePay: {
                merchantCountryCode: "us",
                testEnv: true,
                currencyCode: "usd"
            }
        });

        if (!error) {
            // await presentPaymentSheet();
            const { error } = await presentPaymentSheet();

            if (error) {
                alert(`Error code: ${error.code}`, error.message);
            } else {
                alert('1) Success Your payment method is successfully set up for future payments!');
            }
            // setLoading(true);
        }
    };

    return (
        <StripeProvider
            publishableKey="pk_test_51M4FRuBmPYKY5Nu3jm8gdDK21EYH80zOHlxGuZwIKhi2lLF3EPMs4DsGzlkAzvze7VUCKL7iQ6bi0H6kIbcIKehp00osClaLmY"
        // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
            <TouchableOpacity
                onPress={() => initializePaymentSheet()}
                style={{ paddingHorizontal: 15, paddingVertical: 7, backgroundColor: 'red' }}
            >
                <Text style={{}}>Pay</Text>
            </TouchableOpacity>
        </StripeProvider >
    )
}

// interface PaymentOptions {
//     amount: number,
//     method: "paynow" | "card",
//     initPaymentSheet: any,
//     presentPaymentSheet: any
// }

const ContainerStripe = ({ children }) => {
    return (
        <StripeProvider
            publishableKey="pk_test_51M4FRuBmPYKY5Nu3jm8gdDK21EYH80zOHlxGuZwIKhi2lLF3EPMs4DsGzlkAzvze7VUCKL7iQ6bi0H6kIbcIKehp00osClaLmY"
            // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
            {children}
        </StripeProvider >
    )
}

const fetchPaymentSheetParams = async (options) => {
    const { error, data } = await axios.post(
        `https://megalithic.world/questioner/public/api/payment?amount=${options?.amount}`,
        {
            "amount": options?.amount,
            "method": options?.method,
        }
    )
    console.log(JSON.stringify(data, null, 2));
    if (error) {
        return { serverError: error }
    }
    return { ...data };
}

const checkout = async (options) => {
    const { initPaymentSheet, presentPaymentSheet } = options;
    const {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
        serverError
    } = await fetchPaymentSheetParams(options);
    if (serverError) return;

    const initialize = async () => {

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Digipax",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,

            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: false,
            defaultBillingDetails: {
                name: 'Jane Doe',
            },
            googlePay: {
                merchantCountryCode: "us",
                testEnv: true,
                currencyCode: "usd"
            }
        });
        if (!error) {
            // await presentPaymentSheet();
            const { error } = await presentPaymentSheet();

            if (error) {
                alert(`Error code: ${error.code}`, error.message);
            } else {
                alert('2) Success Your payment method is successfully set up for future payments!');
            }   
        }
    }

    initialize();

}

export { checkout, ContainerStripe }
export default StripPaymentScreen;