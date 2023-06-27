import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, Image, TextInput, TouchableOpacity, ToastAndroid, Button } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Navigation } from "react-native-navigation";
import { SimpleSurvey } from "react-native-simple-survey";
import { AppTheme } from "../AppTheme/AppTheme";
import { DeleteCustomer, GetAllContacts, GetAllCustomer, GetAllStaffs, GetAllWorkshop } from "../Components/Api";
import { GoToNextController, ShowToast } from "../Components/General";
import Loader from "../Components/Loader";
import QuesAnswer from "./QuesAnswer";
import Icon from 'react-native-vector-icons/Ionicons'



const AnswerDetail = (props) => {

    const survey = [
        {
            questionType: 'Info',
            questionText: 'Welcome to the React Native Simple Survey Example app! Tap next to continue'
        },
        {
            questionType: 'TextInput',
            questionText: 'Simple Survey supports free form text input',
            questionId: 'favoriteColor',
            placeholderText: 'Tell me your favorite color!',
        },
        {
            questionType: 'NumericInput',
            questionText: 'It also supports numeric input. Enter your favorite number here!',
            questionId: 'favoriteNumber',
            placeholderText: '',
        },
        {
            questionType: 'SelectionGroup',
            questionText: 'Simple Survey also has multiple choice questions. What is your favorite pet?',
            questionId: 'favoritePet',
            options: [
                {
                    optionText: 'Dogs',
                    value: 'dog'
                },
                {
                    optionText: 'Cats',
                    value: 'cat'
                },
                {
                    optionText: 'Ferrets',
                    value: 'ferret'
                },
            ]
        },
    ];
    const [dataAllStaffs, setDataAllStaffs] = useState([]);
    const [sortedDataAllStaff, setSortedDataAllStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    const wID = props?.item?.id || 0

    const question = props?.item?.question || ""
    const answer = props?.item?.question || ""

    console.log("question", question)

    useEffect(() => {
        // apiPost()
    }, [])



    const apiPost = async (s) => {

        // console.log(`check func =`, MyTasks)
        setLoading(true)

        axios.get(GetAllWorkshop)
            .then(data => {
                console.log(`Staff DATA = ${JSON.stringify(data.data, null, 2)}`)
                setLoading(false)

                setDataAllStaffs(data?.data.data || []);
                setSortedDataAllStaff(data?.data.data || [])
            })
            .catch(e => {
                console.log(`Error =`, e);
                setLoading(false)

            })


    }




    const onSearch = (text) => {
        if (text.length > 0) {
            let sorted = dataAllStaffs.filter(function (item) {
                console.log(item.workshop_name)
                console.log(item.workshop_name.toLowerCase().includes(text.toLowerCase()))
                return item.workshop_name.toLowerCase().includes(text.toLowerCase());
            })
            setSortedDataAllStaff(sorted);
            return;
        }

        setSortedDataAllStaff(dataAllStaffs);
    }
    const renderNext = (onPress, enabled) => {
        return (<Button
            color={"green"}
            onPress={() => { }}
            disabled={false}
            backgroundColor={"blue"}
            title={'Next'}
        />);
    }
    const renderQuestionText = (questionText) => {
        return (<Text>{questionText}</Text>);
    }
    const renderSelector = (data, index, isSelected, onPress) => {
        return (<Button
            title={data.optionText}
            onPress={onPress}
            color={isSelected ? GREEN : PURPLE}
            key={`button_${index}`}
        />);
    }
    const renderTextInput = (onChange, placeholder, value) => {
        return (<TextInput
            onChangeText={text => onChange(text)}
            placeholder={placeholder}
            value={value}
        />);
    }
    const renderInfoText = (infoText) => {
        return (<Text style={{}}>{infoText}</Text>);
    }


    var questions = [
        {
            question: "His Heigh ",
            options: [
                "Do you like men who are taller than you",
                "Do you like men who are shorter than you ",
                "I don’t mind whit his height is  ",
            ]
        },
        {
            question: "What kind of build do you like ",
            options: [
                "Do you him to be big & strong ",
                "Do you like men who are slimmer",
                "Do you like me who are athletic & fit",
                "Do you like men with a little padding – all the ore to cuddle",
            ]
        }, 
    ]


    const ViewQuestionaire = ({ style, question, data, questions }) => {

        const [selectedIndex, setSelectedIndex] = React.useState(0)
        const [answers, setAnswers] = React.useState([])
        // const [questionsCount, setQuesionsCount] = React.useState(0)
        // const [questionData, setQuestionData] = React.useState([])
        const [page, setPage] = React.useState(0)
        let questionsCount = questions?.length || 0;

        const Cell = ({ _cellIndex, title = "Some Title", _selectedIndex, setSelectedIndex }) => {
            const getColor = () => {
                // '#BF1E2E'
                if (title == "Red (poor)") {
                    return '#BF1E2E'
                } else if (title == "Amber (good)") {
                    return 'rgb(191,102,0)'
                } else if (title == "Green (excellent)") {
                    return 'rgb(0,191,7)'
                } else {
                    return 'rgb(0,191,7)'
                }
            }
            // '#7D4B50' TEXT
            const getCirclecBgColor = () => {
                if (title == "Red (poor)") {
                    return 'rgba(191,30,46,0.4)'
                } else if (title == "Amber (good)") {
                    return 'rgba(191,102,0,0.4)'
                } else if (title == "Green (excellent)") {
                    return 'rgba(0,191,7,0.4)'
                }
                else {
                    return 'rgba(0,191,7,0.4)'
                }
            }

            const getBgColor = () => {
                if (title == "Red (poor)") {
                    return 'rgba(191,30,46,0.11)'
                } else if (title == "Amber (good)") {
                    return 'rgba(191,102,0,0.11)'
                } else if (title == "Green (excellent)") {
                    return 'rgba(0,191,7,0.22)'
                } else {
                    return 'rgba(0,191,7,0.22)'
                }
            }


            return (
                <View style={{ backgroundColor: getBgColor(), flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 7, marginTop: 5 }}>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', padding: 2, borderRadius: 30, backgroundColor: getCirclecBgColor() }} onPress={() => { setSelectedIndex(_cellIndex); }}>
                        <Icon color={getColor()} size={30} name={'ellipse-outline'} />
                        {_selectedIndex == _cellIndex && <Icon color={getColor()} size={20} name={'ellipse'} style={{ position: 'absolute' }} />}
                    </TouchableOpacity>
                    <Text style={{ color: getColor(), marginStart: 10 }}>{title}</Text>
                </View>
            )
        }

        const ViewBottomButtons = () => {

            const _funcNext = () => {
                // answers.splice(page, 1, { "question_id": questionData[page].id, "answer": selectedIndex })
                setPage(page + 1)
                // setSelectedIndex(0)
                // console.log(`NEXT ---> ${page}`)
                // answers.splice(page,1,{"question_id":questionData[page].id,"answer":selectedIndex})
                // _updateData().then( opt =>  setData(opt) )
            }
            const _funcBack = () => {
                setPage(page - 1)
                // setSelectedIndex(answers[page-1].answer)

                // setSelectedIndex(answers[_prevPage-1].answer ) // BECAUSE ITS STILLE NOT UPDATED ..
                // console.log(`BACK --> PREVIOUS --> ${page}`)
                // _updateData().then( opt =>  setData(opt) )
            }
            return (
                <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'center', marginTop: 10, marginBottom: 30 }}>
                    {page != 0 &&
                        <TouchableOpacity onPress={() => { _funcBack() }} style={{ backgroundColor: "orange", flexDirection: 'row', paddingTop: 5, paddingBottom: 5, paddingStart: 10, paddingEnd: 10, borderRadius: 5, alignItems: 'flex-start' }}>
                            <Icon name={'arrow-back-outline'} size={20} color={'white'} />
                            <Text style={{ color: 'white' }}>Back</Text>
                        </TouchableOpacity>
                    }
                    {page != questionsCount - 1 &&
                        <TouchableOpacity onPress={() => { _funcNext() }} style={{ backgroundColor: "orange", flexDirection: 'row', paddingTop: 5, paddingBottom: 5, paddingStart: 10, paddingEnd: 10, borderRadius: 5, alignItems: 'flex-start', position: 'absolute', right: 0 }}>
                            <Text style={{ color: 'white' }}>Next</Text>
                            <Icon name={'arrow-forward-outline'} size={20} color={'white'} />
                        </TouchableOpacity>
                    }
                </View>
            )
        }

        return (
            <View style={{ width: '85%', alignSelf: 'center', ...style }}>
                <Text style={{ fontSize: 22, color: "red", marginTop: 15 }}>{questions != undefined && questions[page] != undefined && questions[page].question != undefined && questions[page].question}</Text>
                {questions != undefined && questions[page] != undefined && questions[page].options != undefined && questions[page].options.map((item, index) => (<Cell title={item} key={String(index)} _cellIndex={index} _selectedIndex={answers[page] != undefined ? answers[page] : 0} setSelectedIndex={i => { console.log(i); var _answers = [...answers]; _answers[page] = i; setAnswers([..._answers]) }} />))}
                <ViewBottomButtons page={page} questionsCount={questionsCount} />
            </View>
        )
    }




    return (
        <LinearGradient style={{ flex: 1 }} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} colors={['#D1C1FD', '#FFFFFF', '#FFFFFF']}>
            {/* <Text style={{ fontSize: 22, marginLeft: 16, marginTop: 20 }}>{props.item?.workshop_name}</Text> */}

            <ViewQuestionaire
                question="Hows you day going"
                data={["Good", "Bad", "Normal"]}
                questions={questions}
            />
            {/* <SimpleSurvey
                survey={survey}
                // containerStyle={styles.surveyContainer}
                // selectionGroupContainerStyle={styles.selectionGroupContainer}
                // navButtonContainerStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}
                // renderPrevious={this.renderPreviousButton.bind(this)}
                renderNext={renderNext}
                // renderFinished={this.renderFinishedButton.bind(this)}
                renderQuestionText={renderQuestionText}
                // renderSelector={this.renderButton.bind(this)}
                // onSurveyFinished={(answers) => this.onSurveyFinished(answers)}
                // onAnswerSubmitted={(answer) => this.onAnswerSubmitted(answer)}
                // renderTextInput={renderTextBox}
                // renderNumericInput={this.renderNumericInput}
                renderInfo={renderInfoText}
            /> */}

            {/* <Text style={{ fontSize: 22, marginLeft: 16, marginTop: 20 }}>{question}</Text>
            <Text style={{ fontSize: 22, marginLeft: 16, marginTop: 20 }}>{answer}</Text> */}

            {/* <FlatList
                style={{ marginTop: 20 }}
                renderItem={ContactsView}
                data={sortedDataAllStaff}
            /> */}

            <Loader loading={loading} />

        </LinearGradient>


    )
}


const apiDeletePost = async (id) => {

    console.log(`delte data func =`, DeleteCustomer + id)

    axios.delete(DeleteCustomer + id)
        .then(data => {
            console.log(`Staff DATA = ${JSON.stringify(data.data, null, 2)}`)
            //  console.log(`delte data func =`, DeleteCustomer + item.id)



            // alert(data.data.message)

            // setDataAllStaffs(data?.data || []);
            // setSortedDataAllStaff(data?.data || [])
        })
        .catch(e => {
            console.log(`Error =`, e);

        })


}


const ContactsView = ({ item }) => {


    // console.log ("id is idd" , item.userid)

    const handleDelettePressed = () => {


        console.log("itemitem", item)

        Navigation.push("AppStack", { component: { passProps: { item }, name: "AnswerDetail", options: { topBar: { visible: true } } } })



        // apiDeletePost(item.userid)


    }

    return (


        <View style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity style={{
                backgroundColor: "white", width: '90%', alignSelf: "center", shadowColor: '#000000', shadowOffset: {
                    width: 0,
                    height: 5
                },
                shadowRadius: 4,
                shadowOpacity: 1.0,
                marginBottom: 20
                , alignItems: "center",
                flexDirection: "row",
                borderRadius: 10

            }} onPress={handleDelettePressed}>


                <Image style={{ width: 45, height: 45, marginTop: 0, marginLeft: 10 }} source={require("../Assets/Button.png")} resizeMode="contain" />

                <Text style={{ fontSize: 15, marginLeft: 10, paddingVertical: 20 }}>{item.workshop_name}</Text>


                <Image style={{ width: 15, height: 15, marginTop: 0, position: "absolute", right: 20 }} source={require("../Assets/chevron-right.png")} resizeMode="contain" />

                {/* </TouchableOpacity> */}
                {/* <View style={{  flexDirection: "row", marginLeft: 5 }}>
                    <Text style={{color: "blue"}}>View | </Text>
                    <Text style={{color: "red"}}>Delete | </Text>
                    <Text style={{color: "#FFD21F"}}>Create Appointment</Text>
                </View> */}

            </TouchableOpacity>

        </View>


    )
}

export default AnswerDetail