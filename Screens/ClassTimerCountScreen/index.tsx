import React, { useEffect, useState } from "react"
import { View, Text, Image, ActivityIndicator, TouchableOpacity, PermissionsAndroid, ToastAndroid } from "react-native"
import { Theme } from "../../constant/theme"
import Header from "../../Component/Header"
import { launchCamera } from "react-native-image-picker"
import { Base_Uri } from "../../constant/BaseUri"
import axios from "axios"



function ClassTimerCount({ navigation, route }: any) {


    let startTime = route.params
    let item = route.params

    const [endTime, setEndTime] = useState("2:00 Pm")
    const [loading, setLoading] = useState(false)
    const [hour,setHour] = useState(0)
    const [minutes,setMinutes] = useState(0)
    const [seconds,setSeconds] = useState(0)


useEffect(()=>{

    const interval = setInterval(() => {

        if(seconds < 59){
            setSeconds(seconds + 1)
        }
        if(seconds == 59){
            setSeconds(0)
            setMinutes(minutes + 1)
        }
        if(minutes == 59){
            setMinutes(0)
            setHour(hour + 1)
        }
        if(hour == 23){
            setHour(0)
        }

    }, 1000);

    return () => clearInterval(interval)


},[seconds,minutes,hour])


    const handleClockOut = async () => {

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            let options: any = {
                mediaType: "photo"
            }

            launchCamera(options, (res: any) => {


                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.error) {
                    console.log('ImagePicker Error:', res.error);
                } else {

                    let startHour = item.startMinutes
                    let startMinutes = item.startSeconds

                    
                    // starthours = 23 
                    // hour = 1
                    //endHour 24 ? 0 : endHour

                    //start minutes = 47
                    //end minutes = 13
                    //endMinutes = 60 ? 0 && endHour + 1 : endMinutes

                    let endHour =  startHour + hour == 24 ? 0 : startHour + hour
                    let endMinutes = startMinutes + minutes
                    if(startMinutes + minutes == 60){
                            endMinutes = 0
                            endHour = endHour + 1
                    }
                      
                    let { assets } = res

                    setHour(0)
                    setMinutes(0)
                    setSeconds(0)
                    
                    let data = {
                        id: item.id,
                        class_schedule_id: item?.class_schedule_id,
                        endHour: endHour,
                        endMinutes: endMinutes,
                        startMinutes : item?.startSeconds,
                        startHour : item?.startMinutes,
                        hasIncentive: item?.hasIncentive ? item?.hasIncentive : 0,
                        uri : assets[0].uri,
                        type: assets[0].type,
                        filename : assets[0].fileName
                    }

                    navigation.navigate("ClockOut",data)
                    
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
                    <Text style={{ textAlign: "center", fontSize: 22, color: Theme.black, fontWeight: "800" }} >{hour.toString().length == 1 ? `0${hour}` : hour}:{minutes.toString().length == 1 ? `0${minutes}` : minutes}:{seconds.toString().length == 1 ? `0${seconds}` : seconds}<Text style={{ fontSize: 16, color: Theme.lightGray, fontWeight: "500" }} >s</Text> </Text>
                </View>
            </TouchableOpacity>

            <View style={{ width: "100%", alignItems: "center", position: "absolute", bottom: 60 }} >
                <Text style={{ textAlign: "center", fontSize: 18, color: Theme.black, width: "50%" }} >Click on the timer to clock out</Text>
            </View>

        </View>
    )
}


export default ClassTimerCount

