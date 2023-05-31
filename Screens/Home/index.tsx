import React from "react"
import { View, Text, StyleSheet, Image,Dimensions, TouchableOpacity } from "react-native"
import { Theme } from "../../constant/theme"

function Home() {
    const date: Date = new Date();
const currentDate: string = date.toLocaleDateString("en-US", {
  month: "short",
  year: "numeric",
});
const currentMonth: string = date.toLocaleDateString("en-US", {
  month: "short",
});
console.log('currentDate===>',currentDate);

    return (
        <View style={styles.container} >

            <View>
                <Text style={styles.text} >
                    Hello,
                </Text>
                <Text style={styles.heading} >
                    Muhammad
                </Text>
            </View>

            <View style={styles.firstBox} >
                <Text style={[styles.text, { color: Theme.white, fontSize: 14 }]} >
                  {currentDate}
                </Text>
                <Text style={[styles.heading, { color: Theme.white, fontWeight: "400" }]} >
                    RM 0.00
                </Text>
                <Text style={[styles.text, { color: Theme.white, fontSize: 14 }]} >
                    CUMMULATIVE COMMISSION
                </Text>
            </View>
            <TouchableOpacity style={[styles.firstBox, { backgroundColor: Theme.lightGray, justifyContent: "space-between", paddingHorizontal: 15, flexDirection: "row", marginTop: 10 }]} >
                <Text style={[styles.text, { color: Theme.black, fontSize: 14 }]} >
                    Notifications
                </Text>
                <View style={{ borderRadius: 100, backgroundColor: Theme.red, width: 25, height: 25, alignItems: "center", justifyContent: "center" }} >
                    <Text style={[styles.text, { fontSize: 12, color: Theme.white }]} >
                        3
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={{ marginTop: 20 }} >
                <Text style={[styles.heading, { fontSize: 16 }]} >
                    Monthly Summary
                </Text>
                <Text style={[styles.text, { fontSize: 14, color: Theme.gray }]} >
                {currentMonth}
                </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 10 }} >
                <View style={{ flexDirection: "row", width: "50%" , alignItems:'center'}} >
                    <Image source={require("../../Assets/Images/timer-or-chronometer-tool.png")} style={{ width: 30, height: 30 }} />
                    <View style={{ justifyContent: "center", marginLeft: 10 }} >
                        <Text style={[styles.text, { fontSize: 13 }]} >Attended hours</Text>
                        <Text style={[styles.text, { fontSize: 16, fontWeight: "700" }]}  >0.0</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", width: "50%", justifyContent: "flex-start", alignItems:'center' }} >
                    <Image source={require("../../Assets/Images/student.png")} style={{ width: 30, height: 30 }} />
                    <View style={{ justifyContent: "center", marginLeft: 10 }} >
                        <Text style={[styles.text, { fontSize: 12 }]} >Active Student</Text>
                        <Text style={[styles.text, { fontSize: 16, fontWeight: "700" }]}  >1</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 20 }} >
                <View style={{ flexDirection: "row", width: "50%", alignItems:'center' }} >
                    <Image source={require("../../Assets/Images/scheduled.png")} style={{ width: 30, height: 30 }} />
                    <View style={{ justifyContent: "center", marginLeft: 10 }} >
                        <Text style={[styles.text, { fontSize: 12 }]} >Schedule hours</Text>
                        <Text style={[styles.text, { fontSize: 16, fontWeight: "700" }]}  >2.0</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", width: "50%", justifyContent: "flex-start", alignItems:'center' }} >
                    <Image source={require("../../Assets/Images/clock.png")} style={{ width: 30, height: 30 }} />
                    <View style={{ justifyContent: "center", marginLeft: 10 }} >
                        <Text style={[styles.text, { fontSize: 12 }]} >Cancelled hours</Text>
                        <Text style={[styles.text, { fontSize: 16, fontWeight: "700" }]}  >0.0</Text>
                    </View>
                </View>
            </View>

            <Text style={[styles.text, { marginTop: 20, fontWeight: "500" }]} >
                Upcoming Classes
            </Text>
            <View style={{alignItems:"center",position: "absolute", bottom: 10}} >
            <Text style={[styles.text,{fontSize:16,color:Theme.gray,width:"100%",textAlign:"center",borderWidth:1,borderColor:"red" }]} >
                No upcoming classes
            </Text>
            </View>
        </View>
    )
}

export default Home



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white,
        padding: 15,
    },
    text: {
        color: Theme.black,
        fontSize: 16
    },
    heading: {
        color: Theme.black,
        fontSize: 20,
        fontWeight: "600"
    },
    firstBox: {
        alignItems: "center",
        paddingVertical: 25,
        backgroundColor: Theme.darkGray,
        borderRadius: 6,
        marginTop: 10
    },

})