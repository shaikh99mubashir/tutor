import React, { useEffect, useState } from "react"
import MapView, { Marker } from "react-native-maps"
import { View, Text, TouchableOpacity, Image, PermissionsAndroid,ToastAndroid } from "react-native"
import { Theme } from "../../constant/theme"
import Header from "../../Component/Header"
import { launchCamera } from "react-native-image-picker"
import Geolocation from "@react-native-community/geolocation"

function ClockIn({ navigation, route }: any) {

    let item = route.params


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


        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {


            let options: any = {
                mediaType: "photo"
            }

            launchCamera(options, (res) => {

                let startTime = new Date()

                navigation.navigate("ClassTimerCount",startTime)
            })
        }else{
            ToastAndroid.show("Permission not satisfied",ToastAndroid.SHORT)
        }

    }


    return (
        <View style={{ flex: 1, alignItems: "center" }} >
            <Header backBtn navigation={navigation} title={"Clock In"} />
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
                <View style={{ flexDirection: "row", alignItems: "center" }} >
                    <View style={{ borderWidth: 1, borderColor: Theme.lightGray, borderRadius: 100, width: 70, height: 70, alignItems: "center", justifyContent: "center", backgroundColor: Theme.darkGray }} >
                        <Image source={item.imageUrl} style={{ width: 45, height: 45 }} />
                    </View>
                    <Text style={{ fontSize: 14, color: Theme.gray, marginLeft: 10 }} >{item.name}</Text>
                </View>

                <View style={{ marginTop: 10, flexDirection: "row" }} >
                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "600", textTransform: "uppercase" }} >{item.Subject}</Text>

                </View>

                <View style={{ flexDirection: "row" }} >

                    <Text style={{ color: Theme.gray }} >{(item.startTime).toString()} - {(item.startTime).toString()} | </Text>

                    <Text style={{ color: Theme.gray }} >{(item.date.slice(7)).toString()}</Text>
                </View>
                <TouchableOpacity onPress={() => handleClockInPress()} style={{ backgroundColor: Theme.darkGray, width: "100%", padding: 10, borderRadius: 10, marginTop: 10 }} >
                    <Text style={{ textAlign: "center", fontSize: 16 }} >
                        Clock In
                    </Text>
                </TouchableOpacity>

            </TouchableOpacity>


        </View>
    )
}

export default ClockIn