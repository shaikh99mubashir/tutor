import React, { useState } from "react"
import {View,Text,Image,ActivityIndicator,TouchableOpacity,PermissionsAndroid,ToastAndroid} from "react-native"
import { Theme } from "../../constant/theme"
import Header from "../../Component/Header"
import { launchCamera } from "react-native-image-picker"



function ClassTimerCount ({navigation,route}:any) {


let startTime = route.params

const [endTime,setEndTime] = useState("2:00 Pm")



const handleClockOut = async () => {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {


        let options: any = {
            mediaType: "photo"
        }

        launchCamera(options, (res) => {
            navigation.navigate("ClockOut",{startTime:startTime,endTime:endTime})
        })
    }else{
        ToastAndroid.show("Permission not satisfied",ToastAndroid.SHORT)
    }
}

    return (
        <View style={{flex:1,backgroundColor:Theme.white}} >
        
            
                <Header backBtn navigation={navigation} containerStyle={{height:50}} />


            <Text style={{textAlign:"center",color:Theme.black,marginTop:20,fontSize:16}} >Class in progress...</Text>

            <TouchableOpacity onPress={()=>{handleClockOut()}} >
            <ActivityIndicator size={220} color={Theme.darkGray} style={{marginTop:30}} />

            <View style={{alignItems:"center",position:"relative",top:-130}} >
                <Text style={{textAlign:"center",fontSize:14,color:Theme.lightGray}} >Timer</Text>
                <Text style={{textAlign:"center",fontSize:22,color:Theme.black,fontWeight:"800"}} >00:00:06<Text style={{fontSize:16,color:Theme.lightGray,fontWeight:"500"}} >s</Text> </Text>
            </View>
            </TouchableOpacity>

            <View style={{width:"100%",alignItems:"center",position:"absolute",bottom:60}} >
            <Text style={{textAlign:"center",fontSize:18,color:Theme.black,width:"50%"}} >Click on the timer to clock out</Text>
            </View>

        </View>
    )
}


export default ClassTimerCount

