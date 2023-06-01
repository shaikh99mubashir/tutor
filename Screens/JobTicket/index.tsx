import React, {useState,useCallback} from "react"
import { View,Text,FlatList,TouchableOpacity, ScrollView } from "react-native"
import Header from "../../Component/Header"
import { Theme } from "../../constant/theme"
import CustomTabView from "../../Component/CustomTabView"



function JobTicket ({navigation}:any) {
    const [currentTab, setCurrentTab]: any = useState([
        {
          index: 0,
          name: 'Open',
          selected: true,
        },
        {
          index: 1,
          name: 'Applied',
          selected: false,
        },
      ]);
      const activateTab = (index: any) => {
        setCurrentTab(
          currentTab &&
            currentTab.length > 0 &&
            currentTab.map((e: any, i: any) => {
              if (e.index == index) {
                return {
                  ...e,
                  selected: true,
                };
              } else {
                return {
                  ...e,
                  selected: false,
                };
              }
            }),
        );
      };
      const [openData, setOpenData] = useState([
        {
            id:1,
            code:'SS545455',
            code2:'SS545455',
            title:'Mathematics (UPSR) - PHYSICAL - Weekday',
            details:'Weekday at 90:00Am for 1.5 hour(S) of each class',
            details2:'Physical Classes at 90:00Am for 1.5 hour(S) of each class',
            details3:'Female (11 y/o)',
            details4:'Weekdays, 9PAGI',
            details5:'Weekdays, 9PAGI',
            RS:'180',
        },
        {
            id:2,
            code:'SS545455',
            code2:'SS545455',
            title:'Mathematics (UPSR) - PHYSICAL - Weekday',
            details:'Weekday at 90:00Am for 1.5 hour(S) of each class',
            details2:'Physical Classes at 90:00Am for 1.5 hour(S) of each class',
            details3:'Female (11 y/o)',
            details4:'Weekdays, 9PAGI',
            details5:'Weekdays, 9PAGI',
            RS:'180',
        },
    ])
      const [closeData, setCloseData] = useState([
        {
            id:1,
            code:'SS545455',
            code2:'Approved',
            title:'Mathematics (UPSR) - PHYSICAL - Weekday',
            details:'Weekday at 90:00Am for 1.5 hour(S) of each class',
            details5:'Testing',
            RS:'180',
        },
        {
            id:2,
            code:'SS545455',
            code2:'Approved',
            title:'Mathematics (UPSR) - PHYSICAL - Weekday',
            details:'Weekday at 90:00Am for 1.5 hour(S) of each class',
            details5:'Testing',
            RS:'180',
        },
        
    ])

    const renderOpenData :any = ({item}:any) => {
        console.log('item',item);
        return(
            <TouchableOpacity onPress={()=> navigation.navigate('OpenDetails', item)} activeOpacity={0.8} style={{borderWidth:1, borderRadius:5, marginBottom:10,padding:10, borderColor:Theme.lightGray}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%',  }}>
                <Text style={{color:'green', fontSize:14, fontWeight:'600'}}>{item.code}</Text>
                <Text style={{color:'green', fontSize:14, fontWeight:'600'}}>{item.code2}</Text>
                </View>
                <Text style={{color:Theme.black, fontSize:14, fontWeight:'600', marginTop:10}}>{item.title}</Text>
                <View>
                <Text style={{color:Theme.black, fontSize:14, fontWeight:'600', marginTop:10}}>Details</Text>
                <Text style={{color:Theme.gray, fontSize:14, fontWeight:'600', }}>{item.details}</Text>
                </View>
                <Text style={{color:Theme.gray, fontSize:14, fontWeight:'600', marginTop:10}}>{item.details2}</Text>
                <Text style={{color:Theme.gray, fontSize:14, fontWeight:'600', marginTop:10}}>{item.details3}</Text>
                <Text style={{color:Theme.gray, fontSize:14, fontWeight:'600', }}>{item.details4}</Text>
                <Text style={{color:Theme.gray, fontSize:14, fontWeight:'600', }}>{item.details5}</Text>
                <Text style={{color:Theme.black, fontSize:18, fontWeight:'600', marginTop:10}}>RM {item.RS}/subject</Text>
            </TouchableOpacity>
          
            )
    }
    const renderCloseData = ({item}:any) => {
        return(

            <View></View>
            )
    }
      const firstRoute = useCallback(() => {
        return (
          <View style={{marginVertical: 20, marginBottom: 10}}>
            {openData.length > 0 ? (
              <FlatList
                data={openData.length > 0 ? openData : []}
                renderItem={renderOpenData}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                keyExtractor={(items: any, index: number): any => index}
              />
            ) : (
              <Text style={{fontWeight: 'bold', fontSize: 16}}>no data found</Text>
            )}
          </View>
        );
      }, [openData]);
    
      const secondRoute = useCallback(() => {
        return (
          <View style={{marginVertical: 20, marginBottom: 10}}>
            {closeData.length > 0 ? (
              <FlatList
                data={closeData}
                renderItem={renderCloseData}
                nestedScrollEnabled={true}
                keyExtractor={(items: any, index: number): any => index}
              />
            ) : (
              <Text style={{fontWeight: 'bold', fontSize: 16}}>no data found</Text>
            )}
          </View>
        );
      }, [closeData]);
    return (
        <View style={{ backgroundColor:Theme.white, height:'100%', }}>
            <Header title='Job Ticket' filter />
            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>

            <View style={{paddingHorizontal:15, marginTop:20}}>
            <CustomTabView
            currentTab={currentTab}
            firstRoute={firstRoute}
            secondRoute={secondRoute}
            activateTab={activateTab}
            firstRouteTitle="Open"
            secondRouteTitle="Applied"
            />
            </View>
            </ScrollView>
        </View>
    )
}

export default JobTicket
 