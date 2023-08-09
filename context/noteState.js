import React, { useEffect, useState } from "react";
import NoteContext from "./noteContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NoteState = (prop) => {

    const [hour, setHour] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [tutorID, setTutorId] = useState("")


    const getTutorId = async () => {

        let data = await AsyncStorage.getItem('loginAuth');
        data = JSON.parse(data);
        let { tutorID } = data;
        setTutorId(tutorID)
    }

    useEffect(() => {

        getTutorId()

    }, [])


    const update = () => {


        if (seconds < 59) {
            setSeconds(seconds + 1)
        }
        if (seconds == 59) {
            setSeconds(0)
            setMinutes(minutes + 1)
        }
        if (minutes == 59) {
            setMinutes(0)
            setHour(hour + 1)
        }
        if (hour == 23) {
            setHour(0)
        }

    }

    const cleanTime = () => {

        setHour(0)
        setMinutes(0)
        setSeconds(0)

    }


    return (
        <NoteContext.Provider value={{ hour, seconds, minutes, update, cleanTime, tutorID,setSeconds,setMinutes,setHour }} >

            {prop.children} 

        </NoteContext.Provider>
    )

}

export default NoteState