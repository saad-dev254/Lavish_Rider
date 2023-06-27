import { AppState, Platform } from "react-native"
import { Navigation } from "react-native-navigation"
import { AppTheme } from "../AppTheme/AppTheme"

export const APP_STACK = "AppStack"

export const AppScreens = {

  splash: "Splash",
  tutorial: "Tutorial",
  signin: "Signin",

  signincreate: "SigninCreate",
  createaccount: "CreateAccount",
  workshop: "Workshop",
  quesanswer: "QuesAnswer",
  answerdetail: "AnswerDetail",
  otp: "OTP",
  pickupform: "PickupForm",

  delieveryform: "DelieveryForm",
  forgetpassword : "Forgetpassword",
  profile : "Profile",
  orderhistory : "OrderHistory",
  orders: "Orders",
  approval: "Approval",
  viewInvoice: "ViewInvoice",
  invoice: "Invoice",
  faqs: "Faqs",
  privacyPolicy: "PrivacyPolicy",
  aboutUs: "AboutUs",
  contactUs: "ContactUs",
  verificationMethodSelector: 'VerificationMethodSelector',
  verifyOtp: 'VerifyOtp',
  newPassword: 'NewPassword',
  priceList: 'PriceList',
  addCard: 'AddCard',
  deliveryForm: 'DeliveryForm',
}

export const pushScreen = (_options) => {

  let { toScreen } = _options
  let _passProps = { prevProps: _options?.props || {}, passedProps: _options?.passedProps || {} }
  Navigation.push(APP_STACK, {
    component: {
      name: toScreen, passProps: { ..._passProps },
      options: {
        layout: {


        },
        window: {

        },
        topBar: { visible: false },
        statusBar: { drawBehind: true, backgroundColor: 'transparent' }
      }
    }
  })
}

export const pushScreenShared = (_options) => {
  let { toScreen } = _options
  Navigation.push(APP_STACK, {
    component: {
      name: toScreen, passProps: { ..._passProps },
      options: {
        layout: {

        },
        window: {

        },
        topBar: {
          visible: false
        },
        statusBar: {
          drawBehind: true, backgroundColor: 'transparent'
        },
        animations: {
          push: {
            sharedElementTransitions: [{
              fromId: `view${_options?.passedProps?.sharedId || "0"}`,
              toId: `view${_options?.passedProps?.sharedId || "0"}Destination`,
              interpolation: { type: 'spring' },
              duration: 200
            }]
          },
          pop: {
            sharedElementTransitions: [{
              fromId: `view${_options?.passedProps?.sharedId || 0}Destination`,
              toId: `view${_options?.passedProps?.sharedId || 0}`,
              interpolation: { type: 'spring' },
              duration: 200
            }]
          }
        }
      }
    }
  })
}

export const pushScreenOverlay = (_options) => {
  let { toScreen } = _options


  _options?.props?.viewWillDisappear != undefined && _options.props.viewWillDisappear()
  let _passProps = { prevProps: _options?.props || {}, passedProps: _options?.passedProps || {} }


  Navigation.showOverlay({
    component: {
      name: toScreen,
      passProps: {
        ..._passProps
      },
      options: {
        topBar: { visible: false },
        statusBar: { drawBehind: true, backgroundColor: 'transparent' },
        overlay: {
          interceptTouchOutside: false,
        },
        window: {

        },
        layout: {
          componentBackgroundColor: 'transparent',
          fitSystemWindows: true,
          backgroundColor: 'transparent',
          orientation: ['portrait'],
        },
        // animations: {
        //   push: {
        //     sharedElementTransitions: [{
        //       fromId: `view${_options?.passedProps?.sharedId || 0}`,
        //       toId: `view${_options?.passedProps?.sharedId || 0}Destination`,
        //       interpolation: { type: 'linear' }
        //     }]
        //   },
        //   pop: {
        //     sharedElementTransitions: [{
        //       fromId: `view${_options?.passedProps?.sharedId || 0}Destination`,
        //       toId: `view${_options?.passedProps?.sharedId || 0}`,
        //       interpolation: { type: 'linear' }
        //     }]
        //   }
        // }
      }
    }
  });
}

export const popScreen = (_options) => {
  Navigation.pop(_options.componentId)
}

export const popToRoot = (_options) => {
  // DebugConsole(`Pop Screen Options => ${_options}`  )
  // _options?.prevProps?.viewWillAppear != undefined && _options.prevProps.viewWillAppear()
  Navigation.popToRoot(_options.componentId)
}


// options

export const setStackRoot = ({ toScreen }) => {


  // Navigation.setStackRoot(APP_STACK, {
  //   component: {
  //     name: toScreen,
  //     options: {
  //       layout: {
  //         // backgroundColor: colors.darkPurple,
  //         // componentBackgroundColor: colors.darkPurple,
  //       },
  //       window: {
  //         // backgroundColor: colors.darkPurple
  //       },
  //       topBar: { visible: false },
  //       statusBar: { drawBehind: true, style: 'light', backgroundColor: 'transparent' }
  //     }
  //   }
  // })

  // NEW 
  const isIOS = Platform.OS == "ios"
  Navigation.setStackRoot("AppStack", {
  bottomTabs: {
      id: 'Bottom_Tabs',
        options: {
            layout: {
                // backgroundColor: colors.darkPurple,
                // componentBackgroundColor: colors.darkPurple,
            },
            window: {
                //   backgroundColor: colors.darkPurple
            },
            blurOnUnmount: true,
            bottomTabs: {
                borderWidth: 0,
                // borderColor: colors.bgPurple,
                // backgroundColor: colors.darkPurple,
                elevation: 2,
                currentTabIndex: 0,
                // fontFamily: customFont,
                animate: true,
                titleDisplayMode: 'alwaysShow',
                preferLargeIcons: false,
                tabsAttachMode: "onSwitchToTab",
                animateTabSelection: true,
            },
            bottomTab: {
            },
        },
        children: [
            // 1-
            {
                stack: {
                    id: 'AppStack_Home',
                    children: [
                        {
                            component: {
                                id: 'Bottom_Tab_Discover',
                                name: "Dashboard",
                                options: {
                                    topBar: {
                                        visible: false,
                                    },
                                    // passProps: {
                                    //   tabMainScreen: true,
                                    // },
                                    // hardwareBackButton: {
                                    //   popStackOnPress: true,
                                    //   // bottomTabsOnPress: backAction
                                    // },
                                    statusBar: {
                                        drawBehind: true,
                                        backgroundColor: 'transparent',
                                        style: "light",
                                        // visible: false,
                                    },
                                    // bottomTab: {
                                    //     icon: isIOS ? require('../Assets/ic_timesheet.png') : require('../Assets/ic_timesheet.png'),
                                    //     // icon: firstTabIcon,
                                    //     //   icon: isAndroid ? require('../Assets/ic_timesheet.png') : require('../Assets/ic_timesheet.png'),
                                    //     text: 'TimeSheets',
                                    //     fontSize: textFontSize,
                                    //     selectedFontSize: selectedText,
                                    //     textColor: unSelectedTabColor,
                                    //     iconColor: unSelectedTabColor,
                                    //     // fontFamily: customFont,
                                       //  selectedTextColor: AppTheme.PrimaryColor,
                                       //  selectedIconColor: AppTheme.yellowButtonColor,
                                    // },
                                },
                            },
                        },
                    ],
                    options: {
                        bottomTab: {
                            icon: isIOS ? require('../Assets/ic_home.png') : require('../Assets/ic_home.png'),
                            // icon: firstTabIcon,
                            //   icon: isAndroid ? require('../Assets/ic_timesheet.png') : require('../Assets/ic_timesheet.png'),
                            text: 'Home',
                            // fontSize: textFontSize,
                            // selectedFontSize: selectedText,
                            textColor: "#000000",
                              iconColor: "#000000",
                            // fontFamily: customFont,
                            selectedTextColor:  AppTheme.PrimaryColor,
                            selectedIconColor:  AppTheme.PrimaryColor,
                        },
                    },
                },
            },
            //2-
            {
                stack: {
                    id: 'AppStack_Search',
                    children: [
                        {
                            component: {
                                // id: 'Bottom_Tab_Library',
                                name: "Todo",
                                options: {
                                    topBar: {
                                        visible: false,
                                    },
                                    passProps: {
                                        tabMainScreen: true,
                                    },
                                    // hardwareBackButton: {
                                    //   popStackOnPress: true,
                                    //   bottomTabsOnPress: 'previous'
                                    // },
                                    statusBar: {
                                        drawBehind: true,
                                        backgroundColor: "transparent",
                                        style: "light",
                                        // visible: false,
                                    },
                                },
                            },
                        },
                    ],
                    options: {
                        bottomTab: {
                                icon: isIOS ? require('../Assets/ic_todo_ios.png') : require('../Assets/ic_todo_ios.png'),
                            // icon: secondTabIcon,
                            // icon: isAndroid ? require('../Assets/btSearch.png') : require('../Assets/btSearch-40.png'),
                            text: 'Todo Items',
                            // selectedFontSize: selectedText,
                            // fontSize: textFontSize,
                            textColor: "#000000",
                              iconColor: "#000000",
                            selectedTextColor:  AppTheme.PrimaryColor,
                            selectedIconColor:  AppTheme.PrimaryColor,
                            // fontFamily: customFont,
                            // iconInsets: _iconInsets,
                            // iconHeight: _iconHeight,
                            // iconWidth: _iconWidth,
                        },
                    },
                },
            },
            // 3-
            {
                stack: {
                    id: 'AppStack_Profile',
                    children: [
                        {
                            component: {
                                // id: 'Bottom_Tab_Profile',
                                name: "ShareADoc",
                                options: {
                                    topBar: {
                                        visible: false,
                                    },
                                    passProps: {
                                        tabMainScreen: true,
                                    },
                                    // hardwareBackButton: {
                                    //   popStackOnPress: true,
                                    //   bottomTabsOnPress: 'previous'
                                    // }
                                    statusBar: {
                                        drawBehind: true,
                                        backgroundColor: 'transparent',
                                        style: "light",
                                        // visible: false,
                                    },
                                },
                            },
                        },
                    ],
                    options: {
                        bottomTab: {
                               icon: isIOS ? require('../Assets/ic_share_ios.png') : require('../Assets/ic_share_ios.png'),
                            //   selectedIcon: isIOS ? require('../Assets/live_tv_24px.png') : require('../Assets/ic_bcg_fab.png'),
                            disableIconTint: true,
                            // iconHeight: 45,
                            // iconWidth: 45,
                            // icon: thirdTabIcon,
                            // icon: isAndroid ? require('../Assets/btProfile.png') : require('../Assets/btProfile-40.png'),
                            text: 'Share Doc',
                        //    selectedFontSize: selectedText,
                            // fontSize: textFontSize,
                            textColor: "#000000",
                              iconColor: "#000000",
                            // fontFamily: customFont,
                            selectedTextColor:  AppTheme.PrimaryColor,
                            selectedIconColor:  AppTheme.PrimaryColor,
                            // iconInsets: _iconInsets,
                            // iconHeight: _iconHeight,
                            // iconWidth: _iconWidth,
                        },
                    },
                },
            },
            // 4-
            {
                stack: {
                    id: 'AppStack_TVGUIDE',
                    children: [
                        {
                            component: {
                                // id: 'Bottom_Tab_Profile',
                                name: "Dashboard",
                                options: {
                                    topBar: {
                                        visible: false,
                                    },
                                    passProps: {
                                        tabMainScreen: true,
                                    },
                                    statusBar: {
                                        drawBehind: true,
                                        backgroundColor: 'transparent',
                                        style: "light",
                                        // visible: false,
                                    },
                                },
                            },
                        },
                    ],
                    options: {
                        bottomTab: {
                            // icon: fouthTabIcon,
                              icon: isIOS ? require('../Assets/ic_status_ios.png') : require('../Assets/ic_status_ios.png'),
                            // icon: isAndroid ? require('../Assets/btMenu.png') : require('../Assets/btMenu-40.png'),
                            text: 'Chat Status',
                            // selectedFontSize: selectedText,
                            // fontSize: textFontSize,
                            textColor: "#000000",
                              iconColor: "#000000",
                            // fontFamily: customFont,
                            selectedTextColor:  AppTheme.PrimaryColor,
                            selectedIconColor:  AppTheme.PrimaryColor,
                            // iconInsets: _iconInsets,
                            // iconHeight: _iconHeight,
                            // iconWidth: _iconWidth,
                        },
                    },
                },
            },
            // 5-
            {
                stack: {
                    id: 'AppStack_TVGUIDE',
                    children: [
                        {
                            component: {
                                // id: 'Bottom_Tab_Profile',
                                name: "Dashboard",
                                options: {
                                    topBar: {
                                        visible: false,
                                    },
                                    passProps: {
                                        tabMainScreen: false,
                                    },
                                    statusBar: {
                                        style: "light",
                                        drawBehind: true,
                                        backgroundColor: 'transparent',
                                    },
                                },
                            },
                        },
                    ],
                    options: {
                        bottomTab: {
                            // icon: fifthTabIcon,
                             icon: isIOS ? require('../Assets/ic_timesheet_ios.png') : require('../Assets/ic_timesheet_ios.png'),
                            // icon: isAndroid ? require('../Assets/btMenu.png') : require('../Assets/btMenu-40.png'),
                            text: 'Timesheet',
                            // selectedFontSize: selectedText,
                            // fontSize: textFontSize,
                            textColor: "#000000",
                              iconColor: "#000000",
                            // fontFamily: customFont,
                            selectedTextColor:  AppTheme.PrimaryColor,
                            selectedIconColor:  AppTheme.PrimaryColor,
                            // iconInsets: _iconInsets,
                            // iconHeight: _iconHeight,
                            // iconWidth: _iconWidth,
                        },
                    },
                },
            },
        ],
    },
});
}





