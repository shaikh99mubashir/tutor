import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from "react-native"
import { Theme } from "../../constant/theme";
import CustomHeader from "../../components/header";
import AntDesign from "react-native-vector-icons/EvilIcons"

function EditPostpondClass({ navigation, route }: any) {

    let data = route.params?.data

    const [postponedReason, setPostponedReason] = useState("")


    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Theme.white }} behavior="padding">
            <View>
                <CustomHeader headerName="Edit Class" iconRight icon_name={"plus"} />
            </View>

            <View style={{ flex: 1, padding: 20, paddingVertical: 10 }}>
                <ScrollView>
                <View style={{ backgroundColor: Theme.lightGray, padding: 20, borderRadius: 10, marginTop: 10 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }}>Date</Text>

                        <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }}>{data?.date.toString()}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }}>Start Time</Text>

                        <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }}>{data?.startTime.toString()}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }}>End Time</Text>

                        <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }}>{data?.endTime.toString()}</Text>
                    </View>
                </View>

                <Text style={{ color: Theme.black, fontSize: 16, fontWeight: "600", marginTop: 20 }}>Status</Text>
                <View style={{ backgroundColor: Theme.lightGray, padding: 20, borderRadius: 10, marginTop: 10 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: Theme.black, fontSize: 16, fontWeight: "500" }}>
                            {route?.params?.schedule ? "Scheduled" : route?.params?.postpond ? "Postponed" : ""}
                        </Text>

                        <AntDesign name="chevron-down" color={Theme.black} size={30} />
                    </View>
                </View>

                <View>
                    <Text style={{ color: Theme.black, fontSize: 16, fontWeight: "600", marginTop: 5 }}>Postponed Reason</Text>

                    <View style={{ height: 150, padding: 10, backgroundColor: Theme.lightGray, borderRadius: 5, marginTop: 5 }}>
                        <TextInput
                            style={{ padding: 10, color: Theme.black, fontSize: 16, paddingVertical: 3 }}
                            onChangeText={setPostponedReason}
                            multiline={true}
                            placeholder="Enter Reason"
                            placeholderTextColor={Theme.gray}
                        />
                    </View>
                </View>
                <View>
                    <Text style={{ color: Theme.black, fontSize: 16, fontWeight: "600", marginTop: 10 }} >Next Class</Text>
                    <View style={{ backgroundColor: Theme.lightGray, padding: 20, borderRadius: 10, marginTop: 10 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }}>Date</Text>

                        <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }}>{data?.date.toString()}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }}>Start Time</Text>

                        <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }}>{data?.startTime.toString()}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }}>End Time</Text>

                        <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }}>{data?.endTime.toString()}</Text>
                    </View>
                </View>
                </View>
                </ScrollView>
            </View>
            <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }} >
                <TouchableOpacity style={{ backgroundColor: Theme.darkGray, padding: 15, borderRadius: 10, width: "95%" }} >
                    <Text style={{ textAlign: "center", fontSize: 16, color: Theme.white }} >
                        Confirm Class
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default EditPostpondClass