import React from "react"
import { View, Text, StyleSheet, Image,Dimensions } from "react-native"
import { Theme } from "../../constant/theme"

function Home() {

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
                    May 2023
                </Text>
                <Text style={[styles.heading, { color: Theme.white, fontWeight: "400" }]} >
                    RM 0.00
                </Text>
                <Text style={[styles.text, { color: Theme.gray, fontSize: 14 }]} >
                    CUMMULATIVE COMMISSION
                </Text>
            </View>
            <View style={[styles.firstBox, { backgroundColor: Theme.gray, justifyContent: "space-between", paddingHorizontal: 20, flexDirection: "row", marginTop: 10 }]} >
                <Text style={[styles.text, { color: Theme.black, fontSize: 14 }]} >
                    Notifications
                </Text>

                <View style={{ borderRadius: 100, backgroundColor: Theme.red, width: 25, height: 25, alignItems: "center", justifyContent: "center" }} >
                    <Text style={[styles.text, { fontSize: 12, color: Theme.white }]} >
                        3
                    </Text>
                </View>
            </View>

            <View style={{ marginTop: 20 }} >
                <Text style={[styles.heading, { fontSize: 18 }]} >
                    Monthly Summary
                </Text>
                <Text style={[styles.text, { fontSize: 16, color: Theme.gray }]} >
                    May
                </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 10 }} >
                <View style={{ flexDirection: "row", width: "50%" }} >
                    <Image source={require("../../Assets/Images/square.jpg")} style={{ width: 50, height: 50 }} />
                    <View style={{ justifyContent: "center", marginLeft: 10 }} >
                        <Text style={[styles.text, { fontSize: 12 }]} >Attended hours</Text>
                        <Text style={[styles.text, { fontSize: 16, fontWeight: "700" }]}  >0.0</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", width: "50%", justifyContent: "flex-start" }} >
                    <Image source={require("../../Assets/Images/square.jpg")} style={{ width: 50, height: 50 }} />
                    <View style={{ justifyContent: "center", marginLeft: 10 }} >
                        <Text style={[styles.text, { fontSize: 12 }]} >Active Student</Text>
                        <Text style={[styles.text, { fontSize: 16, fontWeight: "700" }]}  >1</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 20 }} >
                <View style={{ flexDirection: "row", width: "50%" }} >
                    <Image source={require("../../Assets/Images/square.jpg")} style={{ width: 50, height: 50 }} />
                    <View style={{ justifyContent: "center", marginLeft: 10 }} >
                        <Text style={[styles.text, { fontSize: 12 }]} >Schedule hours</Text>
                        <Text style={[styles.text, { fontSize: 16, fontWeight: "700" }]}  >2.0</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", width: "50%", justifyContent: "flex-start" }} >
                    <Image source={require("../../Assets/Images/square.jpg")} style={{ width: 50, height: 50 }} />
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
        backgroundColor: Theme.primary,
        padding: 20
    },
    text: {
        color: Theme.black,
        fontSize: 18
    },
    heading: {
        color: Theme.black,
        fontSize: 24,
        fontWeight: "600"
    },
    firstBox: {
        alignItems: "center",
        paddingVertical: 25,
        backgroundColor: Theme.blue,
        borderRadius: 6,
        marginTop: 10
    },

})