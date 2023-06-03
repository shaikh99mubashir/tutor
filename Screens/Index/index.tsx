import React, { useState } from "react"
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native"
import { Theme } from "../../constant/theme"
import { ScrollView } from "react-native-gesture-handler"
import CustomHeader from "../../components/header"
import { Colors } from "react-native/Libraries/NewAppScreen"
import Icon from "react-native-vector-icons/MaterialIcons"
import EvilIcons from "react-native-vector-icons/EvilIcons"


function Index({navigation}:any) {

    const [inboxData, setInboxData] = useState([
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        {
            title: "28 May 2023 | LIVE: Kick Start Your Tutoring Career With SifuTutor",
            messageDate: "May,27,2023",
            messageTime: "8:00:20 PM",
            description: "WE TEACH YOU THE WAY YOU SHOULD BE TAUGHT",
            name: "ahad",
            classDate: "28 May",
            startTime: "10:30am",
            endTime: "12:00pm",
            message: `I hope this message finds you well. I wanted to inform you that there will be a slight change in the class schedule. The class that was initially scheduled for [date] from [start time] to [end time] will need to be postponed. The reason for this postponement is [provide reason].I apologize for any inconvenience caused by this change, and I appreciate your understanding. We will reschedule the class at the earliest possible time. Please let me know if you have any concerns or if you need any further information.`,
            topic1: "Tenses and active voice and passive voice",
            topic2: "Do's and Don't",
            link1:  {
                message : "Pauton Live",
                url : "www.google.com"
            },
            link2:  {
                message : "App Tutorial",
                url : "www.google.com"
            },
            link3:  {
                message : "Payment Structure",
                url : "www.google.com"
            },
            link4:  {
                message : "FAQ",
                url : "www.google.com"
            }, 
        },
        

    ])

    const renderInboxData = ({ item, index }: any): any => {

        return (
            <TouchableOpacity onPress={()=>navigation.navigate("InboxDetail",item)} style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, padding: 10, borderBottomWidth: 1, borderBottomColor: Theme.lightGray, width: "100%" }} >
                <View style={{ flexDirection: "row", width: "70%" }} >
                    <View style={{ borderWidth: 1, borderColor: Theme.lightGray, borderRadius: 100, width: 60, height: 60, alignItems: "center", justifyContent: "center" }} >

                        <View style={{ position: "absolute", height: 15, width: 15, backgroundColor: Theme.darkGray, borderRadius: 100, left: 2, top: 0 }} >

                        </View>

                        <Icon name="chat" size={30} color={Theme.black} />
                    </View>

                    <View style={{ marginLeft: 10 }} >

                        <Text style={{ fontSize: 18, fontWeight: "700", color: Theme.black, }} numberOfLines={1} >{item?.title}</Text>
                        <Text style={{ fontSize: 14, fontWeight: "500", color: Theme.black, }} numberOfLines={1} >Announcement</Text>
                        <Text style={{ fontSize: 14, fontWeight: "500", color: Theme.gray, }} numberOfLines={1} >{item.messageDate}</Text>

                    </View>

                </View>

                <View style={{ alignItems: "center", justifyContent: "center" }} >

                    <Icon name="chevron-right" color={Theme.gray} size={30} />

                </View>


            </TouchableOpacity>
        )


    }


    return (
        <View style={{ flex: 1, backgroundColor: Theme.white }} >

            <View>
                <CustomHeader headerName="Inbox" iconRight icon_name={"plus"} />
            </View>

            <FlatList

                data={inboxData}
                renderItem={renderInboxData}

            />

        </View>
    )
}

export default Index
