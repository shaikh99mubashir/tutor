import React, { useEffect, useState } from "react"
import MapView, { Marker } from "react-native-maps"
import { View, Text, TouchableOpacity, Image, PermissionsAndroid,ToastAndroid } from "react-native"
import { Theme } from "../../constant/theme"
import Header from "../../Component/Header"
import { launchCamera } from "react-native-image-picker"
import Geolocation from "@react-native-community/geolocation"

function ClockIn({ navigation, route }: any) {

    let startTime = route.params.startTime
    let endTime = route.params.endTime


    console.log(startTime,"start")
    console.log(endTime,"end")

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


    const handleClockInPress = async () => {


        navigation.navigate("Home")

    }


    return (
        <View style={{ flex: 1, alignItems: "center" }} >
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
                    <Text style={{  color: Theme.gray, textTransform: "uppercase" }} >Time:</Text>
                    <Text style={{  color: Theme.black, fontWeight: "600", textTransform: "uppercase" }} > {startTime.toLocaleString().slice(10,14)}{startTime.toLocaleString().slice(17)}  -  {endTime.toString()}</Text>

                </View>

                <View style={{ flexDirection: "row" }} >

                    <Text style={{ color: Theme.gray }} > Duration:</Text>
                    <Text style={{ color: Theme.black,fontWeight:"600" }} > 00 hours 00 minutes</Text>
                </View>
                <TouchableOpacity onPress={() => handleClockInPress()} style={{ backgroundColor: Theme.darkGray, width: "100%", padding: 10, borderRadius: 10, marginTop: 10 }} >
                    <Text style={{ textAlign: "center", fontSize: 16 }} >
                        Clock Out
                    </Text>
                </TouchableOpacity>

            </TouchableOpacity>


        </View>
    )
}

export default ClockIn