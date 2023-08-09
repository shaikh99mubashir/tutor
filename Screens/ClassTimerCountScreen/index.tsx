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


function ClassTimerCount({ navigation, route }: any) {

    const context = useContext(noteContext)
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const focus = useIsFocused()

    const { hour, minutes, seconds, cleanTime, update, setSeconds, setMinutes, setHour } = context



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

                    setHour(Number(hours))
                    setMinutes(Number(minutes))
                    setSeconds(Number(seconds))
                } else {
                    setHour(Number(hours))
                    setMinutes(Number(minutesDiff))
                }
            } else {
                setHour(Number(totalHourDiff))
            }

        } else {

            let time = new Date()
            let stringTime = JSON.stringify(time)
            AsyncStorage.setItem("timer", stringTime)
        }

    }

    // const handleAppStateChange = (newAppState) => {
    //     if (newAppState === 'active') {

    //         setClockInTime()
    //         // App is coming back from the background
    //         // Place your code here that you want to run
    //     }
    // };


    useEffect(() => {

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {

                setClockInTime()
            } else {
                setClockInTime()
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log('AppState', appState.current);
        });


        // setClockInTime()

        return () => subscription.remove()



        // AppState.addEventListener('change', handleAppStateChange);





    }, [focus])


    let startTime = route.params
    let item = route.params


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
                maxWidth: 500,
                maxHeight: 500,
                quality: 0.5,
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
                    if (startMinutes + minutes == 60) {
                        endMinutes = 0
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
                        uri: assets[0].uri,
                        type: assets[0].type,
                        filename: assets[0].fileName,
                        ticketID: item?.item?.ticketID,
                        classAttendedID: item?.data?.classAttendedID

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
        loading ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
            <ActivityIndicator size="large" color={"black"} />
        </View> : <View style={{ flex: 1, backgroundColor: Theme.white }} >


            <Header backBtn navigation={navigation} containerStyle={{ height: 50 }} />


            <Text style={{ textAlign: "center", color: Theme.black, marginTop: 20, fontSize: 16 }} >Class in progress...</Text>

            <TouchableOpacity onPress={() => { handleClockOut() }} >
                <ActivityIndicator size={220} color={Theme.darkGray} style={{ marginTop: 30 }} />

                <View style={{ alignItems: "center", position: "relative", top: -130 }} >
                    <Text style={{ textAlign: "center", fontSize: 14, color: Theme.lightGray }} >Timer</Text>
                    <Timer show={"true"} />
                </View>
            </TouchableOpacity>

            <View style={{ width: "100%", alignItems: "center", position: "absolute", bottom: 60 }} >
                <Text style={{ textAlign: "center", fontSize: 18, color: Theme.black, width: "50%" }} >Click on the timer to clock out</Text>

            </View>
        </View>
    )
}


export default ClassTimerCount

