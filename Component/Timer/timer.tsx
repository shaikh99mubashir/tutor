import React, { useState, useEffect, useContext } from "react"
import { Text,View } from "react-native";
import { Theme } from "../../constant/theme";
import noteContext from "../../context/noteContext"
import AsyncStorage from "@react-native-async-storage/async-storage";



function Timer({ show }: any):any {

    const [classInProcess, setClassInProcess] = useState("")
    const context = useContext(noteContext)
    let { hour, seconds, minutes } = context

    const updateData = async () => {

        let data: any = await AsyncStorage.getItem("classInProcess")

        data = JSON.parse(data)

        if (data && Object.keys(data).length > 0) {
            context.update()
        }

    }

    useEffect(() => {

        let interval = setInterval(() => {

            updateData()
        }, 1000);


        return () => clearInterval(interval)



    }, [seconds, hour, minutes]);


    return (
        <View style={{alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize: 16, color: Theme.black,fontFamily: 'Circular Std Medium', left:-10 }} >
            Timer
        </Text>    
        {
            show == "true" && <Text style={{ textAlign: "center", fontSize: 35, color: Theme.black, fontWeight: "800",fontFamily: 'Circular Std Medium' }} >{hour.toString().length == 1 ? `0${hour}` : hour}:{minutes.toString().length == 1 ? `0${minutes}` : minutes}:{seconds.toString().length == 1 ? `0${seconds}` : seconds}<Text style={{ fontSize: 16, color: Theme.gray, fontWeight: "500",fontFamily: 'Circular Std Medium' }} >s</Text> </Text>
        }
        </View>

    )

}

export default Timer