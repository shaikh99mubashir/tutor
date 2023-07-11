import React, { useState } from "react"
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

                    let { assets } = res
                    let endTimeProofImage = assets[0].fileName
                    let endMinutes = new Date().getMinutes()
                    let endSeconds = new Date().getSeconds()

                    let data = {
                        id: item.id,
                        class_schedule_id: item?.class_schedule_id,
                        startMinutes: endMinutes,
                        startSeconds: endSeconds,
                        hasIncentive: item?.hasIncentive ? item?.hasIncentive : 0,
                        startTimeProofImage: endTimeProofImage
                    }

                    let formData = new FormData()

                    formData.append("id", data.id)
                    formData.append("class_schedule_id", data.class_schedule_id)
                    formData.append("startMinutes", data.startMinutes)
                    formData.append("startSeconds", data.startSeconds)
                    formData.append("hasIncentive", data.hasIncentive)
                    formData.append('endTimeProofImage', {
                        uri: assets[0].uri,
                        type: assets[0].type,
                        name: assets[0].fileName,
                    });
                    setLoading(true)
                    axios.post(`${Base_Uri}api/attendedClassClockOutTwo`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }).then((res) => {
                        setLoading(false)
                        console.log('Response:', res.data);
                        let startTime = new Date()
                        navigation.navigate("Home", res.data)

                    }).catch((error) => {
                        setLoading(false)
                        console.log(error, "error")
                    })
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
                    <Text style={{ textAlign: "center", fontSize: 22, color: Theme.black, fontWeight: "800" }} >00:00:06<Text style={{ fontSize: 16, color: Theme.lightGray, fontWeight: "500" }} >s</Text> </Text>
                </View>
            </TouchableOpacity>

            <View style={{ width: "100%", alignItems: "center", position: "absolute", bottom: 60 }} >
                <Text style={{ textAlign: "center", fontSize: 18, color: Theme.black, width: "50%" }} >Click on the timer to clock out</Text>
            </View>

        </View>
    )
}


export default ClassTimerCount

