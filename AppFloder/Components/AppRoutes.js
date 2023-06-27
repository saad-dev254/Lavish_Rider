import { Navigation } from 'react-native-navigation'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { AppTheme } from '../AppTheme/AppTheme'
// import IoIcon from 'react-native-vector-icons/Ionicons'


export function toHome() {
    const unSelectedTabColor = "grey"
    const selectedTabColor = "#FFF"
    const customFont = 'papyrus'
    const textFontSize = 12
    const selectedText = 12
    const isIOS = Platform.OS == "ios"
    Promise.all([
        //IoIcon.getImageSource('md-home', 25, colors.darkPurple),
        //   IoIcon.getImageSource('logo-youtube', 25, colors.darkPurple),
        //   IoIcon.getImageSource('tv-outline', 25, colors.darkPurple),
        //   IoIcon.getImageSource('tv-outline', 25, colors.darkPurple),
        //   IoIcon.getImageSource('menu-sharp', 25, colors.darkPurple),
    ]).then(
        ([
            firstTabIcon,
            secondTabIcon,
            thirdTabIcon,
            fouthTabIcon,
            fifthTabIcon
        ]) => {
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
                                            name: "SigninCreate",
                                            options: {
                                                topBar: {
                                                    visible: false,
                                                    title : "SigninCreate"
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
                                        icon: isIOS ? require('../Assets/home.png') : require('../Assets/home.png'),
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
                                            icon: isIOS ? require('../Assets/box.png') : require('../Assets/box.png'),
                                        // icon: secondTabIcon,
                                        // icon: isAndroid ? require('../Assets/btSearch.png') : require('../Assets/btSearch-40.png'),
                                        text: 'PickUp',
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
                                           icon: isIOS ? require('../Assets/wallet.png') : require('../Assets/wallet.png'),
                                        //   selectedIcon: isIOS ? require('../Assets/live_tv_24px.png') : require('../Assets/ic_bcg_fab.png'),
                                        disableIconTint: true,
                                        // iconHeight: 45,
                                        // iconWidth: 45,
                                        // icon: thirdTabIcon,
                                        // icon: isAndroid ? require('../Assets/btProfile.png') : require('../Assets/btProfile-40.png'),
                                        text: 'Wallet',
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
                                          icon: isIOS ? require('../Assets/info.png') : require('../Assets/info.png'),
                                        // icon: isAndroid ? require('../Assets/btMenu.png') : require('../Assets/btMenu-40.png'),
                                        text: 'Info',
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
                                            name: "Profile",
                                            options: {
                                                topBar: {
                                                    visible: false,
                                                },
                                                passProps: {
                                                    tabMainScreen: false,
                                                },
                                                statusBar: {
                                                    drawBehind: true,
                                                    backgroundColor: 'transparent',
                                                    style: "light",
                                                },
                                            },
                                        },
                                    },
                                ],
                                options: {
                                    bottomTab: {
                                        // icon: fifthTabIcon,
                                         icon: isIOS ? require('../Assets/user.png') : require('../Assets/user.png'),
                                        // icon: isAndroid ? require('../Assets/btMenu.png') : require('../Assets/btMenu-40.png'),
                                        text: 'Profile',
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
            }); //SET STACK ...
        }
    )
}









