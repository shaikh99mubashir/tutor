import React,{useState} from "react"
import TutorDetailsContext from "./tutorDetailsContext"



const TutorDetailsState = (prop) => {

    const [tutorDetails,setTutorDetaials] = useState("")


    const updateTutorDetails = (details) => {

            setTutorDetaials(details)


    }


    return (
        <TutorDetailsContext.Provider value={{tutorDetails,updateTutorDetails}} >

            {prop.children}

        </TutorDetailsContext.Provider>
    )


}

export default TutorDetailsState