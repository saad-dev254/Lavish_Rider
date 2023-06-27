

import { Navigation } from "react-native-navigation";
import { AppScreens } from "./AppFloder/General/AppRoutes";
import CreateAccount from "./AppFloder/Screens/CreateAccount";
import Signin from "./AppFloder/Screens/Signin";
import SigninCreate from "./AppFloder/Screens/SigninCreate";
import Splash from "./AppFloder/Screens/Splash";
import Tutorial from "./AppFloder/Screens/Tutorial";
import Dashboard from "./AppFloder/Screens/Dashboard";
import QuesAnswer from "./AppFloder/Screens/QuesAnswer";
import AnswerDetail from "./AppFloder/Screens/AnswerDetail";
import OTP from "./AppFloder/Screens/OTP";
import PickupForm from "./AppFloder/Screens/PickupForm";
import DelieveryForm from "./AppFloder/Screens/DelieveryForm";
import Forgetpassword from "./AppFloder/Screens/Forgetpassword";
import Profile from "./AppFloder/Screens/Profile";
import OrderHistory from "./AppFloder/Screens/OrderHistory";
import Orders from "./AppFloder/Screens/Orders";
import ViewInvoice from "./AppFloder/Screens/ViewInvoice";
import Faqs from "./AppFloder/Screens/Faqs";
import Invoice from "./AppFloder/Screens/Invoice";
import AboutUs from "./AppFloder/Screens/AboutUs";
import PrivacyPolicy from "./AppFloder/Screens/PrivacyPolicy";




Navigation.registerComponent(AppScreens.splash, () => Splash);
Navigation.registerComponent(AppScreens.tutorial, () => Tutorial);
Navigation.registerComponent(AppScreens.signin, () => Signin);
Navigation.registerComponent(AppScreens.signincreate, () => SigninCreate);
Navigation.registerComponent(AppScreens.createaccount, () => CreateAccount);
Navigation.registerComponent(AppScreens.workshop, () => Dashboard);
Navigation.registerComponent(AppScreens.quesanswer, () => QuesAnswer);
Navigation.registerComponent(AppScreens.answerdetail, () => AnswerDetail);
Navigation.registerComponent(AppScreens.otp, () => OTP);

Navigation.registerComponent(AppScreens.pickupform, () => PickupForm);
Navigation.registerComponent(AppScreens.delieveryform, () => DelieveryForm);

Navigation.registerComponent(AppScreens.forgetpassword, () => Forgetpassword);
Navigation.registerComponent(AppScreens.profile, () => Profile);
Navigation.registerComponent(AppScreens.orders, () => Orders);
Navigation.registerComponent(AppScreens.approval, () => Approval);
Navigation.registerComponent(AppScreens.orderhistory, () => OrderHistory);
Navigation.registerComponent(AppScreens.viewInvoice, () => ViewInvoice);
Navigation.registerComponent(AppScreens.invoice, () => Invoice);
Navigation.registerComponent(AppScreens.faqs, () => Faqs);
Navigation.registerComponent(AppScreens.privacyPolicy, () => PrivacyPolicy);
Navigation.registerComponent(AppScreens.aboutUs, () => AboutUs);
Navigation.registerComponent(AppScreens.contactUs, () => ContactUs);
Navigation.registerComponent(AppScreens.verificationMethodSelector, () => VerificationMethodSelector);
Navigation.registerComponent(AppScreens.verifyOtp, () => VerifyOtp);
Navigation.registerComponent(AppScreens.newPassword, () => NewPassword);
Navigation.registerComponent(AppScreens.priceList, () => PriceList);
Navigation.registerComponent(AppScreens.addCard, () => AddCard);
Navigation.registerComponent(AppScreens.deliveryForm, () => DeliveryForm);
Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                id: "AppStack",
                children: [
                    {
                        component: {
                            name: AppScreens.splash,                            
                            // name: AppScreens.tutorial,
                            options: {
                                layout: {                                                                    
                                    orientation: ["portrait"]
                                },
                                window: {
                                    // backgroundColor: colors.darkPurple
                                },
                                topBar: {
                                    visible: false
                                },
                                statusBar: {
                                    drawBehind: 'true',
                                    backgroundColor: 'transparent',
                                    style: 'light'
                                }
                            }
                        }
                    }
                ]
            }
        }
    });
});

/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification'; //push notification
import messaging from '@react-native-firebase/messaging'; //firebase messaging
import ContactUs from "./AppFloder/Screens/ContactUs";
import VerificationMethodSelector from "./AppFloder/Screens/VerificationMethod";
import VerifyOtp from "./AppFloder/Screens/VerifyOtp";
import NewPassword from "./AppFloder/Screens/NewPassword";
import PriceList from "./AppFloder/Screens/PriceList";
import AddCard from "./AppFloder/Screens/AddCard";
import DeliveryForm from "./AppFloder/Screens/DeliveryForm";
import Approval from "./AppFloder/Screens/approvval";

PushNotification.createChannel(
    {
        channelId: 'products', // (required)
        channelName: 'Orders', // (required)
        channelDescription: 'Order related Notification', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 5, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

// AppRegistry.registerComponent(appName, () => App);
