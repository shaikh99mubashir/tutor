import React, { useState } from "react";
import { View, Text, TouchableOpacity, ToastAndroid, ActivityIndicator } from "react-native"
import { Theme } from "../../constant/theme";
import CustomHeader from "../../Component/Header";
import AntDesign from "react-native-vector-icons/EvilIcons"
import axios from "axios";
import { Base_Uri } from "../../constant/BaseUri";

function EditScheduleClass({ navigation, route }: any) {

    let data = route.params?.data
    const [loading, setLoading] = useState(false)


    const editTutorScheduleClass = () => {

        setLoading(true)
        axios.get(`${Base_Uri}attendedClassStatus/${data?.id}/schedule`).then(({ data }) => {
            ToastAndroid.show(data?.SuccessMessage, ToastAndroid.SHORT)
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT)
        })

    }

    return (
        loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <ActivityIndicator size="large" color={Theme.black} />
        </View> : <View style={{ flex: 1, backgroundColor: Theme.white }} >
            <View>
                <CustomHeader title="Edit Class" backBtn navigation={navigation} />
            </View>
            <View style={{ flex: 1, padding: 20 }} >
                <Text style={{ color: Theme.black, fontSize: 18, fontWeight: "600" }} >
                    Student
                </Text>
                <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500", marginTop: 5 }} >
                    {data?.studentName}
                </Text>
                <Text style={{ color: Theme.black, fontSize: 18, fontWeight: "600", marginTop: 20 }} >
                    Subject
                </Text>
                <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500", marginTop: 5 }} >
                    {data?.subjectName}
                </Text>

                <Text style={{ color: Theme.black, fontSize: 18, fontWeight: "600", marginTop: 20 }} >
                    Class
                </Text>
                <View style={{ backgroundColor: Theme.lightGray, padding: 20, borderRadius: 10, marginTop: 10 }} >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >
                        <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }} >
                            Date
                        </Text>

                        <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }} >
                            {(data?.date).toString()}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }} >
                        <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }} >
                            Start Time
                        </Text>

                        <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }} >
                            {(data?.startTime).toString()}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }} >
                        <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }} >
                            End Time
                        </Text>

                        <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }} >
                            {(data?.endTime).toString()}
                        </Text>
                    </View>
                </View>

                <Text style={{ color: Theme.black, fontSize: 18, fontWeight: "600", marginTop: 20 }} >
                    Status
                </Text>
                <View style={{ backgroundColor: Theme.lightGray, padding: 20, borderRadius: 10, marginTop: 10 }} >

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >
                        <Text style={{ color: Theme.black, fontSize: 16, fontWeight: "500" }} >
                            {route?.params?.schedule && "Scheduled"}
                        </Text>

                        <AntDesign name="chevron-down" color={Theme.black} size={30} />
                    </View>

                </View>
            </View>

            <View style={{ position: "absolute", width: "100%", bottom: 20, alignItems: "center" }} >
                <TouchableOpacity onPress={() => editTutorScheduleClass()} style={{ backgroundColor: Theme.darkGray, padding: 15, borderRadius: 10, width: "95%" }} >
                    <Text style={{ textAlign: "center", fontSize: 16, color: Theme.white }} >
                        Confirm Class
                    </Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}

export default EditScheduleClass