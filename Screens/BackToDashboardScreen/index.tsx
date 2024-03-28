import React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { Theme } from "../../constant/theme"
import { useNavigation } from "@react-navigation/native"
import {CommonActions, useIsFocused} from '@react-navigation/native';

//#0f58cb

function BackToDashboard({ route,navigation }: any) {
    let data = route.params
    // const navigation: any = useNavigation()
    console.log("navigation",navigation.canGoBack);
    
    const handelPress = () => {
       navigation.replace('AddClass')
    }
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
            <View style={{width:'100%', alignItems:"center", gap:20}}>
            <TouchableOpacity activeOpacity={0.8} onPress={()=> handelPress()} style={{ width: "90%", backgroundColor: Theme.white, padding: 12, borderRadius: 8 }} >
                <Text style={{ fontSize: 16, color: Theme.darkGray, textAlign: "center", fontWeight: "700",fontFamily: 'Circular Std Black' }} >
                   Update Schedule
                </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.replace("Main")} style={{ width: "90%", backgroundColor: Theme.black, padding: 12, borderRadius: 8 }} >
                <Text style={{ fontSize: 16, color: Theme.white, textAlign: "center", fontWeight: "700",fontFamily: 'Circular Std Black' }} >
                    Back To Dashboard
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default BackToDashboard
