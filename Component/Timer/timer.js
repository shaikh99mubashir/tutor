import React,{useState,useEffect, useContext} from "react"
import { Text } from "react-native";
import { Theme } from "../../constant/theme";
import noteContext from "../../context/noteContext"



function Timer ({show})  {


    const context = useContext(noteContext)	

    console.log(context,"context")

    let {hour,seconds,minutes} = context
		

    useEffect(()=>{

       let interval =  setInterval(() => {
            context.update()
        }, 1000);


        return () => clearInterval(interval)


    
        }, [seconds,hour,minutes]);
    

return (

    show == "true" &&<Text style={{ textAlign: "center", fontSize: 22, color: Theme.black, fontWeight: "800" }} >{hour.toString().length == 1 ? `0${hour}` : hour}:{minutes.toString().length == 1 ? `0${minutes}` : minutes}:{seconds.toString().length == 1 ? `0${seconds}` : seconds}<Text style={{ fontSize: 16, color: Theme.lightGray, fontWeight: "500" }} >s</Text> </Text>

)


}

export default Timer