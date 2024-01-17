import React, { useContext, useEffect, useRef, useState } from "react"
import { View, Text, Image, ActivityIndicator, TouchableOpacity, PermissionsAndroid, ToastAndroid, AppState } from "react-native"
import { Theme } from "../../constant/theme"
import Header from "../../Component/Header"
import { launchCamera } from "react-native-image-picker"
import { Base_Uri } from "../../constant/BaseUri"
import axios from "axios"
import Timer from "../../Component/Timer/timer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import noteContext from "../../context/noteContext"
import { useIsFocused } from "@react-navigation/native"
import moment from "moment"
import CustomLoader from "../../Component/CustomLoader"


function ClassTimerCount({ navigation, route }: any) {

    const context = useContext(noteContext)
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [backTime, setBackTime] = useState(false)

    const focus = useIsFocused()

    const { hour, minutes, seconds, cleanTime, update, setTime, time, setFirstTimeIn } = context



    const [appClosed, setAppClosed] = useState(false)

    const setClockInTime = async () => {


        let myData: any = await AsyncStorage.getItem("timer")
        let date = JSON.parse(myData)
        if (date) {

            let convertDate = moment(date)
            let convertGetTime = convertDate.toDate().getTime()
            let nowDate = new Date().getTime()
            let diff = nowDate - convertGetTime
            let totalHourDiff = diff / 1000 / 60 / 60
            if (totalHourDiff.toString().includes(".")) {
                let splitHours = totalHourDiff.toString().split(".")
                let hours = Number(splitHours[0])
                let remainingHours = splitHours[1]
                let minutesDiff = Number(`0.${remainingHours}`) * 60
                if (minutesDiff.toString().includes(".")) {
                    let minutesSplit = minutesDiff.toString().split(".")

                    let minutes = Number(minutesSplit[0])
                    let remainingMinutes = minutesSplit[1]
                    let secondsDiff = Number(`0.${remainingMinutes}`) * 60
                    let seconds = Number(Math.ceil(secondsDiff))


                    setTime({
                        ...time,
                        seconds: seconds,
                        minutes: minutes,
                        hour: hours
                    })
                } else {
                    setTime({
                        ...time,
                        minutes: minutesDiff,
                        hour: hours
                    })
                }
            } else {
                setTime({
                    ...time,
                    hour: totalHourDiff
                })
            }

        } else {

            let time = new Date()
            let stringTime = JSON.stringify(time)
            AsyncStorage.setItem("timer", stringTime)
        }

    }


    const handleAppStateChange = async (newAppState: any) => {
        if (newAppState === 'active') {
            setBackTime(true)
            setFirstTimeIn(true)
            let myData: any = await AsyncStorage.getItem("timer")
            let date = JSON.parse(myData)
            if (date) {

                let convertDate = moment(date)
                let convertGetTime = convertDate.toDate().getTime()
                let nowDate = new Date().getTime()
                let diff = nowDate - convertGetTime
                let totalHourDiff = diff / 1000 / 60 / 60
                if (totalHourDiff.toString().includes(".")) {
                    let splitHours = totalHourDiff.toString().split(".")
                    let hours = Number(splitHours[0])
                    let remainingHours = splitHours[1]
                    let minutesDiff = Number(`0.${remainingHours}`) * 60
                    if (minutesDiff.toString().includes(".")) {
                        let minutesSplit = minutesDiff.toString().split(".")

                        let myMinutes = Number(minutesSplit[0])
                        let remainingMinutes = minutesSplit[1]
                        let secondsDiff = Number(`0.${remainingMinutes}`) * 60
                        let Myseconds = Number(Math.ceil(secondsDiff))

                        setTime({
                            ...time,
                            seconds: Myseconds,
                            minutes: myMinutes,
                            hour: hours
                        })
                    } else {
                        setTime({
                            ...time,
                            minutes: minutesDiff,
                            hour: hours
                        })
                    }
                } else {
                    setTime({
                        ...time,
                        hour: totalHourDiff
                    })
                }

                setBackTime(false)

            } else {

                let time = new Date()
                let stringTime = JSON.stringify(time)
                AsyncStorage.setItem("timer", stringTime)
            }
        }
    };
    
    

    useEffect(() => {
        // ...



        setClockInTime()
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => subscription.remove();

    }, [focus]);

    let startTime = route.params
    let item = route.params
    console.log("item=======Class TimmerCount Screen",item);
    console.log('item?.data?.studentName',item?.item?.studentName);
    console.log('item?.item?.studentID',item?.item?.studentID);
    console.log('item?.item?.subjectID',item?.item?.subjectID);

    const [endTime, setEndTime] = useState("2:00 Pm")
    const [loading, setLoading] = useState(false)


    const handleClockOut = async () => {

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            const options: any = {
                title: 'Select Picture',
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
                maxWidth: 600,
                maxHeight: 200,
                quality: 1.0,
            };

            launchCamera(options, (res: any) => {

                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.error) {
                    console.log('ImagePicker Error:', res.error);
                } else {
                    let startHour = item.startMinutes
                    let startMinutes = item.startSeconds
                    let endHour = startHour + hour == 24 ? 0 : startHour + hour
                    let endMinutes = startMinutes + minutes
                    if (startMinutes + minutes >= 60) {
                        endMinutes = startMinutes + minutes - 60
                        endHour = endHour + 1
                    }

                    let { assets } = res


                    let data = {
                        id: item.id,
                        class_schedule_id: item?.class_schedule_id,
                        endHour: endHour,
                        endMinutes: endMinutes,
                        startMinutes: item?.startSeconds,
                        startHour: item?.startMinutes,
                        hasIncentive: item?.hasIncentive ? item?.hasIncentive : 0,
                        uri: assets[0]?.uri,
                        type: assets[0]?.type,
                        filename: assets[0]?.fileName,
                        ticketID: item?.item?.ticketID,
                        classAttendedID: item?.data?.classAttendedID,
                        minutes: time.minutes,
                        hour: time?.hour ? time.hour : 0,
                        studentName:item?.item?.studentName,
                        subjectName:item?.item?.subjectName,
                        subjectID:item?.item?.subjectID,
                        studentID:item?.item?.studentID,
                    }
                    cleanTime()
                    AsyncStorage.removeItem("classInProcess")
                    AsyncStorage.removeItem("timer")
                    navigation.replace("ClockOut", data)

                }
            })


        }


    }


    return (
        // loading ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
        //     <ActivityIndicator size="large" color={"black"} />
        // </View> : 
        <View style={{ flex: 1, backgroundColor: Theme.white,  }} >


            <Header backBtn navigation={navigation} title='Class In Progress' containerStyle={{ height: 60 }} />


           

            {/* <TouchableOpacity onPress={() => { handleClockOut() }} >
                <ActivityIndicator size={220} color={Theme.darkGray} style={{ marginTop: 30 }} />

                <View style={{ alignItems: "center", position: "relative", top: -130 }} >
                    <Text style={{ textAlign: "center", fontSize: 14, color: Theme.black,fontFamily: 'Circular Std Medium' }} >Timer</Text>
                    {!backTime && <Timer show={"true"} />}
                </View>
            </TouchableOpacity> */}
            {/* <Text style={{ textAlign: "center", color: Theme.black, marginTop: 20, fontSize: 18, fontFamily: 'Circular Std Medium'}} >Class in progress...</Text> */}


            <View style={{alignItems:'center', justifyContent:'center',flex:1,}}>       
                <Image source={require('../../Assets/Images/Timmmer1.png')} resizeMode="contain" style={{width:350, height:350 }}/>
                <View style={{ alignItems: 'center',position: 'absolute', top: '45%', left: '34%',justifyContent:'center'  }}>
                <>
            <TouchableOpacity onPress={() =>  handleClockOut()} activeOpacity={0.8} >
                <Text style={{ textAlign: "center", fontSize: 16, color: Theme.black,fontFamily: 'Circular Std Medium' }} >
                    Timer
                </Text>
                    {!backTime && <Timer show={"true"} />}
            </TouchableOpacity>
                </>
                </View>
            </View>     
            <View style={{ width: "100%", alignItems: "center", position: "absolute",  bottom: 60, left:'3%' }} >
                <Text style={{ textAlign: "center", fontSize: 20,fontWeight:'600', color: Theme.black ,fontFamily: 'Circular Std Medium', lineHeight:25}} >Click on the Timer to {'\n'} Clock Out</Text>
            </View>
            <CustomLoader visible={loading} />
        </View>
    )
}


export default ClassTimerCount

