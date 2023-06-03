import React from "react";
import { View, Text, Linking, TouchableOpacity, ScrollView } from "react-native";
import CustomHeader from "../../components/header";
import { Theme } from "../../constant/theme";


function InboxDetail({ navigation, route }: any) {

    let data = route.params



    const handleLinkPress = (url: any) => {
        // Replace with your desired URL
        Linking.openURL(`https://${url}`);
    };

    console.log(data, "data")

    return (
        <View style={{ flex: 1, backgroundColor: Theme.white }} >
            <View>
                <CustomHeader />
            </View>

            <ScrollView style={{ height: "100%", padding: 20 }} >

                <Text style={{ fontSize: 20, color: Theme.black, fontWeight: "500" }}  >{data.title}</Text>

                <View style={{ flexDirection: "row", marginTop: 20 }} >
                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "500" }}  >{data.messageDate}</Text>
                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "500" }}  > - </Text>
                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "500" }}  >{data.messageTime}</Text>
                </View>

                <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "700", marginTop: 15 }}  >{data.description}</Text>


                <View style={{ marginTop: 20, flexDirection: "row" }} >

                    <View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: Theme.darkGray }} >
                    </View>
                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "700", textTransform: "capitalize", marginLeft: 7 }}  >{data.name},</Text>
                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "700", marginLeft: 3 }}  >{data.classDate}</Text>
                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "700", marginLeft: 3 }}  >{data.startTime} - </Text>
                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "700", marginLeft: 3 }}  >{data.endTime}</Text>
                </View>


                <Text style={{ fontSize: 14, color: Theme.gray, fontWeight: "500", marginTop: 15 }}  >{data.message}</Text>


                <Text style={{ fontSize: 16, color: Theme.gray, fontWeight: "500", marginTop: 15 }}  >1){data.topic1}</Text>
                <Text style={{ fontSize: 16, color: Theme.gray, fontWeight: "500" }}  >2){data.topic2}</Text>




                <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <View style={{ width: 18, height: 18, backgroundColor: "orange" }}>
                    </View>

                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "500", marginLeft: 10 }}  >{data?.link1?.message}: </Text>
                    <TouchableOpacity onPress={() => handleLinkPress(data.link1.url)}>
                        <Text style={{ color: "blue", textDecorationColor: "blue", textDecorationLine: "underline", fontWeight: "500", fontSize: 16 }}>{data.link1.url}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <View style={{ width: 18, height: 18, backgroundColor: "green" }}>
                    </View>

                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "500", marginLeft: 10 }}  >{data?.link2?.message}: </Text>
                </View>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => handleLinkPress(data.link1.url)}>
                    <Text style={{ color: "blue", textDecorationColor: "blue", textDecorationLine: "underline", fontWeight: "500", fontSize: 16 }}>{data.link2.url}</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <View style={{ width: 18, height: 18, backgroundColor: "green" }}>
                    </View>

                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "500", marginLeft: 10 }}  >{data?.link3?.message}: </Text>
                </View>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => handleLinkPress(data.link3.url)}>
                    <Text style={{ color: "blue", textDecorationColor: "blue", textDecorationLine: "underline", fontWeight: "500", fontSize: 16 }}>{data.link3.url}</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <View style={{ width: 18, height: 18, backgroundColor: "green" }}>
                    </View>
                    <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "500", marginLeft: 10 }}  >{data?.link4?.message}: </Text>
                </View>
                <TouchableOpacity style={{ marginTop: 10,marginBottom:30 }} onPress={() => handleLinkPress(data.link1.url)}>
                    <Text style={{ color: "blue", textDecorationColor: "blue", textDecorationLine: "underline", fontWeight: "500", fontSize: 16 }}>{data.link2.url}</Text>
                </TouchableOpacity>



            </ScrollView>

        </View>
    )
}

export default InboxDetail