import React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { Theme } from "../../constant/theme"
import { useNavigation } from "@react-navigation/native"

//#0f58cb

function BackToDashboard({ route }: any) {

    let data = route.params





    const navigation: any = useNavigation()

    return (
        <View style={{ flex: 1, backgroundColor: Theme.darkGray, alignItems: "center", justifyContent: "space-around" }} >

            <Image source={require("../../Assets/Images/btd.png")} style={{ width: "80%", height: 300 }} resizeMode="contain" />
            <View style={{alignItems:"center"}}>
            <Text style={{ color: Theme.white, fontSize: 30, width: "90%", textAlign: "center", fontWeight: "500", marginBottom:15,fontFamily: 'Circular Std Black' }} >
                {data?.notificationType ? "" : "Class Completed!"}
            </Text>
            <Text style={{ color: Theme.white, fontSize: 16, width: "90%", textAlign: "center", fontWeight: "300",fontFamily: 'Circular Std Black' }} >
                {data?.notificationType ? "Report has been successfully Submited" : "Good Job for completing your class.\n See you next in the class!!"}
            </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.replace("Main")} style={{ width: "90%", backgroundColor: Theme.white, padding: 12, borderRadius: 8 }} >

                <Text style={{ fontSize: 16, color: Theme.darkGray, textAlign: "center", fontWeight: "700",fontFamily: 'Circular Std Black' }} >
                    Back To Dashboard
                </Text>
            </TouchableOpacity>

        </View>
    )
}

export default BackToDashboard
