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
import messaging from '@react-native-firebase/messaging';


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
    const totalTime = item?.item?.totalTime;

    // const notificationTime = calculateNotificationTime(totalTime);
    function calculateNotificationTime(totalTime:any) {
        // Split totalTime into hours and minutes
        const [hours, minutes] = totalTime.split('.');
        
        // Convert hours and minutes to numbers
        const totalHours = parseInt(hours, 10);
        const totalMinutes = parseInt(minutes || 0, 10);
        
        // Calculate total minutes
        const total = totalHours * 60 + totalMinutes;
        
        // Subtract 5 minutes for notification time
        const notificationTotal = total - 5;
        
        // Calculate notification hours and minutes
        const notificationHours = Math.floor(notificationTotal / 60);
        const notificationMinutes = notificationTotal % 60;
        
        return { hours: notificationHours, minutes: notificationMinutes };
      }
      
    //   sendNotification(notificationTime)
      function sendNotification() {
        messaging()
        .requestPermission()
        .then(() => {
          // Retrieve the FCM token
          return messaging().getToken();
        })
        .then(token => {
          messaging()
            .subscribeToTopic('all_devices')
            .then(() => {
              let formData = new FormData();
  
              formData.append('title', 'Clock Out Time');
              formData.append('message', 'Few Minutes Left in your Ongoining Class');
              formData.append('deviceToken', token);
  
              axios
                .post(`${Base_Uri}api/SendNotification`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                })
                .then(res => {
                  let data = res.data;
                })
                .catch(error => {
                  console.log(error, 'error');
                });
            })
            .catch(error => {
              console.error('Failed to subscribe to topic: all_devices', error);
            });
        })
        .catch(error => {
          console.error(
            'Error requesting permission or retrieving token:',
            error,
          );
        });
      }
      // useEffect(() => {
      //   // Calculate the total minutes in the notification time
      //   const totalMinutes = notificationTime.hours * 60 + notificationTime.minutes;
      //   // Calculate the current time in minutes
      //   const now = new Date();
      //   const currentMinutes = now.getHours() * 60 + now.getMinutes();
      //   // Specify the interval before which you want to trigger the notification (e.g., 2 hours)
      //   const notificationInterval = totalTime * 60; // 2 hours in minutes
      //   // Calculate the remaining minutes until the specified interval
      //   const remainingMinutes = totalMinutes - notificationInterval;
      //   // Check if the remaining minutes match the specified interval
      //   if (currentMinutes >= remainingMinutes && currentMinutes < totalMinutes) {
      //     sendNotification();
      //   }
      // }, [notificationTime])
      

    const handleClockOut = async () => {
        try {
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
                ToastAndroid.show(`User cancelled image picker`, ToastAndroid.LONG);
              } else if (res.error) {
                ToastAndroid.show(`ImagePicker Error: ${res?.error}`, ToastAndroid.LONG);
              } else {
                try {
                  const startHour = item.startMinutes;
                  const startMinutes = item.startSeconds;
                  let endHour = startHour + hour === 24 ? 0 : startHour + hour;
                  let endMinutes = startMinutes + minutes;
      
                  if (startMinutes + minutes >= 60) {
                    endMinutes = startMinutes + minutes - 60;
                    endHour += 1;
                  }
                  const { assets } = res;
                  const data = {
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
                    studentName: item?.item?.studentName,
                    subjectName: item?.item?.subjectName,
                    subjectID: item?.item?.subjectID,
                    studentID: item?.item?.studentID,
                  };
                  cleanTime();
                  AsyncStorage.removeItem('classInProcess');
                  AsyncStorage.removeItem('timer');
                  navigation.replace('ClockOut', data);
                } catch (error) {
                  ToastAndroid.show(`Error in handleClockOut: ${error}`, ToastAndroid.LONG);
                }
              }
            });
          }
        } catch (permissionError) {
          ToastAndroid.show(`Error requesting camera permission: ${permissionError}`, ToastAndroid.LONG);
        }
      };
      

    return (
        <View style={{ flex: 1, backgroundColor: Theme.white, }} >
            <Header backBtn navigation={navigation} title='Class In Progress' containerStyle={{ height: 60 }} />
            {/* <TouchableOpacity onPress={() => { handleClockOut() }} >
                <ActivityIndicator size={220} color={Theme.darkGray} style={{ marginTop: 30 }} />

                <View style={{ alignItems: "center", position: "relative", top: -130 }} >
                    <Text style={{ textAlign: "center", fontSize: 14, color: Theme.black,fontFamily: 'Circular Std Medium' }} >Timer</Text>
                    {!backTime && <Timer show={"true"} />}
                </View>
            </TouchableOpacity> */}
            {/* <Text style={{ textAlign: "center", color: Theme.black, marginTop: 20, fontSize: 18, fontFamily: 'Circular Std Medium'}} >Class in progress...</Text> */}


            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, }}>
                <Image source={require('../../Assets/Images/Timmmer1.png')} resizeMode="contain" style={{ width: 350, height: 350 }} />
                <View style={{ alignItems: 'center', position: 'absolute', top: '45%', left: '34%', justifyContent: 'center' }}>
                    <>
                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => handleClockOut()} activeOpacity={0.8} >

                            {!backTime && <Timer show={"true"} />}
                        </TouchableOpacity>
                    </>
                </View>
            </View>
            <View style={{flex:1,width:'100%', alignItems: "center", position: "absolute",right:-2, bottom: 60, justifyContent: 'center' }} >
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: '600', color: Theme.black, fontFamily: 'Circular Std Medium', lineHeight: 25 }} >Click on the Timer to </Text>
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: '600', color: Theme.black, fontFamily: 'Circular Std Medium', lineHeight: 25 }} >Clock Out</Text>
            </View>
            {/* <CustomLoader visible={loading} /> */}
        </View>
    )
}


export default ClassTimerCount

