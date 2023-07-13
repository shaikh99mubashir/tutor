import React, { useEffect, useState } from "react"
import MapView, { Marker } from "react-native-maps"
import { View, Text, TouchableOpacity, Image, PermissionsAndroid, ToastAndroid, ActivityIndicator } from "react-native"
import { Theme } from "../../constant/theme"
import Header from "../../Component/Header"
import { launchCamera } from "react-native-image-picker"
import Geolocation from "@react-native-community/geolocation"
import axios from "axios"
import { Base_Uri } from "../../constant/BaseUri"

function ClockOut({ navigation, route }: any) {

    const [loading, setLoading] = useState(false)

    const data = route?.params


    const [currentLocation, setCurrentLocation] = useState<any>({
        latitude: null,
        longitude: null
    })


    const getCurrentLocation = () => {


        Geolocation.getCurrentPosition(e => setCurrentLocation({
            ...currentLocation,
            latitude: e.coords.latitude,
            longitude: e.coords.longitude

        }))

    }


    useEffect(() => {

        getCurrentLocation()

    }, [])

    console.log(data, "data")

    const handleClockOutPress = async () => {

        setLoading(true)
        let formData = new FormData()

        formData.append("id", data.id)
        formData.append("class_schedule_id", data.class_schedule_id)
        formData.append("endMinutes", data.endHour)
        formData.append("endSeconds", data.endMinutes)
        formData.append("hasIncentive", data.hasIncentive)
        formData.append('endTimeProofImage', {
            uri: data.uri,
            type: data.type,
            name: data.filename,
        });
        setLoading(true)
        axios.post(`${Base_Uri}api/attendedClassClockOutTwo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            setLoading(false)
            console.log(res.data, "data")
            ToastAndroid.show("Class Clockout Successfull", ToastAndroid.SHORT)
            navigation.navigate("Home")
        }).catch((error) => {
            setLoading(false)
            ToastAndroid.show("Class Clockout Failed", ToastAndroid.SHORT)
            console.log(error, "error")


        })

    }


    let totalHours;
    let totalMinutes;


    if ((data.endHour - data.startHour).toString().includes("-")) {
        let endHour = 24 - data.startHour

        let totalEndMinutes = (endHour * 60) + data.endMinutes
        let totalStartMinutes = (data.startHour * 60) + data.startMinutes

        let total = totalEndMinutes + totalStartMinutes

        let myHours = total / 60

        let minutes = myHours.toString().split(".")[1]
        let totalHours = myHours.toString().split(".")[0]
        let totalMinutes = (Number(minutes) / 100) * 60

    } else {


        let totalEndMinutes = Number(data.endHour * 60) + Number(data.endMinutes)
        let totalStartMinutes = Number(data.startHour * 60) + Number(data.startMinutes)

        console.log(totalEndMinutes, "endMinutes")
        console.log(totalStartMinutes, "startints")

        let total = totalEndMinutes - totalStartMinutes

        let myHours = Number(total / 60).toFixed(2)

        console.log(myHours, "hours")

        let minutes: any = myHours.toString().split(".")[1]

        totalHours = myHours.toString().split(".")[0]
        totalMinutes = Math.round(((Number(minutes) / 100) * 60))



    }

    console.log(totalHours)
    console.log(totalMinutes)


    return (
        loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <ActivityIndicator size="large" color="black" />
        </View>
            : <View style={{ flex: 1, alignItems: "center" }} >
                <Header backBtn navigation={navigation} title={"Clock Out"} />
                {currentLocation.latitude && currentLocation.longitude && <MapView
                    style={{ height: "100%", width: "100%" }}
                    region={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}

                    />



                </MapView>}

                <TouchableOpacity style={{ borderWidth: 1, borderColor: Theme.lightGray, padding: 20, backgroundColor: Theme.white, bottom: 20, borderRadius: 10, position: "absolute", width: "90%" }} >


                    <View style={{ marginTop: 10, flexDirection: "row" }} >
                        <Text style={{ color: Theme.gray, textTransform: "uppercase" }} >Time:</Text>
                        <Text style={{ color: Theme.black, fontWeight: "600", textTransform: "uppercase" }} > {data.startHour.toString().length == 1 ? `0${data.startHour}` : data.startHour}:{data.startMinutes.toString().length == 0 ? `0${data?.startMinutes}` : data.startMinutes}:00  -  {data.endHour.toString().length == 1 ? `0${data.endHour}` : data.endHour}:{data.endMinutes.toString().length == 1 ? `0${data.endMinutes}` : data.endMinutes}:00</Text>

                    </View>

                    <View style={{ flexDirection: "row" }} >
                        <Text style={{ color: Theme.gray }} > Duration:</Text>
                        <Text style={{ color: Theme.black, fontWeight: "600" }} > {totalHours} hours {totalMinutes} minutes</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleClockOutPress()} style={{ backgroundColor: Theme.darkGray, width: "100%", padding: 10, borderRadius: 10, marginTop: 10 }} >
                        <Text style={{ textAlign: "center", fontSize: 16 }} >
                            Clock Out
                        </Text>
                    </TouchableOpacity>

                </TouchableOpacity>


            </View>
    )
}

export default ClockOut