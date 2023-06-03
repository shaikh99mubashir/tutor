import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from "react-native"
import { Theme } from "../../constant/theme";
import CustomHeader from "../../Component/Header";
import AntDesign from "react-native-vector-icons/EvilIcons"
import DateTimePicker from "@react-native-community/datetimepicker"

function EditPostpondClass({ navigation, route }: any) {

    let data = route.params?.data



    const [postponedReason, setPostponedReason] = useState<any>("")
    const [mode, setMode] = useState<any>('date');
    const [clickedStartTime, setClickedStartTime] = useState(false)
    const [show, setShow] = useState(false);
    const [indexClicked, setIndexClicked] = useState<null | Number>(null)
    const [value, setValue] = useState(new Date())


    const [nextClass, setNextClass] = useState({
        date: new Date(),
        startTime: "-",
        endTime: "-"
    })


    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;

        let data = { ...nextClass }

        if (mode == "date") {


            data = {
                ...nextClass,
                date: currentDate

            }
        }

        else if (mode == "time" && clickedStartTime) {


            data = {
                ...nextClass,
                startTime: currentDate

            }
        }
        else {

            data = {
                ...nextClass,
                endTime: currentDate

            }

        }


        setValue(currentDate)
        setNextClass(data)
        setShow(false)
        setClickedStartTime(false)
    };


    const setClassDate = (mode: any, startTime?: Boolean) => {


        if (startTime) {
            setClickedStartTime(true)
        }
        setMode(mode)
        setShow(true)

    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Theme.white }} behavior="padding">
            <View>
                <CustomHeader title="Edit Class" backBtn />
            </View>

            <View style={{ flex: 1, padding: 20, paddingVertical: 10 }}>
                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}  >
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
                                <TouchableOpacity onPress={() => setClassDate("date")} >
                                    <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }}>{nextClass?.date.toString().slice(0, 15)}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                                <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }}>Start Time</Text>
                                <TouchableOpacity onPress={() => setClassDate("time", true)} style={{ minWidth: 60, alignItems: "flex-end" }}  >
                                    <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }}>{nextClass.startTime !== "-" ? nextClass?.startTime.toLocaleString().slice(10) : "-"} </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                                <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: "500" }}>End Time</Text>
                                <TouchableOpacity onPress={() => setClassDate("time")} style={{ minWidth: 60, alignItems: "flex-end" }} >
                                    <Text style={{ color: Theme.black, fontSize: 14, fontWeight: "500" }}>{nextClass.endTime !== "-" ? nextClass?.endTime.toLocaleString().slice(10) : "-"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={value}
                            mode={mode}
                            is24Hour={false}
                            onChange={onChange}
                        />
                    )}
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