import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome';
// import IonIcons from  'react-native-vector-icons/Ionicons'
import {Theme} from '../constant/theme';
import Home from '../Screens/Home';
import JobTicket from '../Screens/JobTicket';
import Schedule from '../Screens/Schedule';
import Index from '../Screens/Index';
import More from '../Screens/More';
import {View, Text, StyleSheet, Image,ToastAndroid} from 'react-native';
import OpenDetails from '../Screens/OpenDetails';
import Notifications from '../Screens/Notifications';
import AppliedDetails from '../Screens/AppliedDetails';
import Filter from '../Screens/Filter';
import Profile from '../Screens/Profile';
import Students from '../Screens/Students';
import StudentsDetails from '../Screens/StudentsDetails';
import Status from '../Screens/Status';
import FAQs from '../Screens/FAQs';
import ReportSubmissionHistory from '../Screens/ReportSubmissionHistory';
import OnBoarding from '../Screens/OnBoarding';
import Login from '../Screens/Login';
import Verification from '../Screens/Verification';
import Splash from '../Screens/Splash';
import EditScheduleClass from '../Screens/EditScheduleClass.tsx';
import EditAttendedClass from '../Screens/EditAttendedClass/EditAttendedClass';
import EditPostpondClass from '../Screens/EditPostpondClass';
import EditCancelledClass from '../Screens/EditCancelledClass';
import InboxDetail from '../Screens/InboxDetailScreen';
import AddClass from '../Screens/AddClass';
import BackToDashboard from '../Screens/BackToDashboardScreen';
import ClockIn from '../Screens/ClockInScreen/ClockIn';
import ClassTimerCount from '../Screens/ClassTimerCountScreen';
import ClockOut from '../Screens/ClockOutScreen';
import ReportSubmission from '../Screens/ReportSubmission';
import AttendedDetails from '../Screens/AttendedDetails';
import PaymentHistory from '../Screens/PaymentHistory';
import Signup from '../Screens/TutorRegister';
import TutorDetailForm from '../Screens/TutorDetailForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext, useEffect, useState} from 'react';
import TutorDetailsContext from '../context/tutorDetailsContext';
import axios from 'axios';
import {Base_Uri} from '../constant/BaseUri';
import AttendedClassRecords from '../Screens/AttendedClassRecords';
import ScheduleSuccessfully from '../Screens/ScheduleSuccessfully';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function BottomNavigation({navigation,route}: any) {
  const tutorDetailsCont = useContext(TutorDetailsContext);
  const {tutorDetails, setTutorDetail}: any = tutorDetailsCont;

  const getTutorData = async () => {
    let authData = await AsyncStorage.getItem('loginAuth');

    if (authData) {
      let tutorData: any = JSON.parse(authData);
      axios
        .get(`${Base_Uri}getTutorDetailByID/${tutorData?.tutorID}`)
        .then(res => {
          if(res.data.tutorDetailById == null){
            AsyncStorage.removeItem('loginAuth');
            navigation.replace('Login');
            setTutorDetail('')
            ToastAndroid.show('Terminated', ToastAndroid.SHORT);
            return;
          }
          let tutorData = res.data;
          if (tutorData) {
            let allData = tutorData?.tutorDetailById[0];
            
            setTutorDetail(allData);
          }
          return;
        });
    }
  };

  useEffect(() => {
    getTutorData();
  }, []);
  
  const initialRoute =
    tutorDetails?.status?.toLowerCase() == 'unverified' ? 'JobTicket' : 'Home';

  const hideTabs =
    tutorDetails?.status?.toLowerCase() == 'unverified' ? ['Schedule', 'Home', 'inbox'] : [];

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: 'black',
      })}>
      <>
        <Tab.Screen
          name="Job Ticket"
          component={JobTicket}
          options={{
            tabBarIcon: ({focused, color}) => (
              <View>
                {focused == true ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      padding: 5,
                      borderRadius: 5,
                    }}>
                    <Image
                      source={require('../Assets/Images/Job.png')}
                      resizeMode="contain"
                      style={{
                        height: 50,
                        width: 50,
                        tintColor: focused ? 'black' : 'grey',
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={require('../Assets/Images/Job.png')}
                      resizeMode="contain"
                      style={{
                        height: 50,
                        width: 50,
                        tintColor: focused ? 'black' : 'grey',
                      }}
                    />
                  </View>
                )}
              </View>
            ),
          }}
        />
        {hideTabs?.includes('Schedule') ||
        tutorDetails?.status?.toLowerCase() != 'verified' && tutorDetails?.open_dashboard != 'yes' ? null : (
          <Tab.Screen
            name="Schedule"
            component={Schedule}
            options={{
              tabBarIcon: ({focused, color}) => (
                <View>
                  {focused == true ? (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        padding: 5,
                        borderRadius: 5,
                      }}>
                      <Image
                        source={require('../Assets/Images/schedule1.png')}
                        resizeMode="contain"
                        style={{
                          height: 50,
                          width: 50,
                          tintColor: focused ? 'black' : 'grey',
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <Image
                        source={require('../Assets/Images/schedule1.png')}
                        resizeMode="contain"
                        style={{
                          height: 50,
                          width: 50,
                          tintColor: focused ? 'black' : 'grey',
                        }}
                      />
                    </View>
                  )}
                </View>
              ),
            }}
          />
        )}
        {hideTabs?.includes('Home') ||
        tutorDetails?.status?.toLowerCase() != 'verified' && tutorDetails?.open_dashboard != 'yes' ? null : (
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({focused, color}) => (
                <View>
                  {focused == true ? (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        // backgroundColor:'#1FC07D',
                      }}>
                      <Image
                        source={require('../Assets/Images/HomeBlue.png')}
                        resizeMode="contain"
                        style={{
                          height: 100,
                          width: 100,
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <Image
                        source={require('../Assets/Images/HomeBlue.png')}
                        resizeMode="contain"
                        style={{
                          height: 100,
                          width: 100,
                        }}
                      />
                    </View>
                  )}
                </View>
              ),
            }}
          />
        )}
        {hideTabs?.includes('inbox') ||
        tutorDetails?.status?.toLowerCase() != 'verified' && tutorDetails?.open_dashboard != 'yes' ? null : (
          <Tab.Screen
            name="inbox"
            component={Index}
            options={{
              tabBarIcon: ({focused, color}) => (
                <View>
                  {focused == true ? (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        padding: 5,
                        borderRadius: 5,
                      }}>
                      <Image
                        source={require('../Assets/Images/Group203.png')}
                        resizeMode="contain"
                        style={{
                          height: 35,
                          width: 35,
                          tintColor: focused ? 'black' : 'grey',
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <Image
                        source={require('../Assets/Images/Group203.png')}
                        resizeMode="contain"
                        style={{
                          height: 35,
                          width: 35,
                          tintColor: focused ? 'black' : 'grey',
                        }}
                      />
                    </View>
                  )}
                </View>
              ),
            }}
          />
        )}
        <Tab.Screen
          name="More"
          component={More}
          options={{
            tabBarIcon: ({focused, color}) => (
              <View>
                {focused == true ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      padding: 5,
                      borderRadius: 5,
                    }}>
                    <Image
                      source={require('../Assets/Images/Group202.png')}
                      resizeMode="contain"
                      style={{
                        height: 35,
                        width: 35,
                        tintColor: focused ? 'black' : 'grey',
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={require('../Assets/Images/Group202.png')}
                      resizeMode="contain"
                      style={{
                        height: 35,
                        width: 35,
                        tintColor: focused ? 'black' : 'grey',
                      }}
                    />
                  </View>
                )}
              </View>
            ),
          }}
        />
      </>
    </Tab.Navigator>

  );
}

function AppNavigation() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator>
      <Stack.Screen
          options={{headerShown: false}}
          name="BackToDashboard"
          component={BackToDashboard}
        />
      <Stack.Screen
          options={{headerShown: false}}
          name="Main"
          component={BottomNavigation}
        />
      <Stack.Screen
          options={{headerShown: false}}
          name="AddClass"
          component={AddClass}
        />
      </Stack.Navigator> */}
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="Splash"
          component={Splash}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="OnBoarding"
          component={OnBoarding}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ReportSubmission"
          component={ReportSubmission}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AttendedClassRecords"
          component={AttendedClassRecords}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ReportSubmissionHistory"
          component={ReportSubmissionHistory}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Verification"
          component={Verification}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Main"
          component={BottomNavigation}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Schedule"
          component={BottomNavigation}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="OpenDetails"
          component={OpenDetails}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Notifications"
          component={Notifications}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AppliedDetails"
          component={AppliedDetails}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Filter"
          component={Filter}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Profile"
          component={Profile}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Students"
          component={Students}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="StudentsDetails"
          component={StudentsDetails}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Status"
          component={Status}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="FAQs"
          component={FAQs}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditScheduleClass"
          component={EditScheduleClass}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditAttendedClass"
          component={EditAttendedClass}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditPostpondClass"
          component={EditPostpondClass}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditCancelledClass"
          component={EditCancelledClass}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="InboxDetail"
          component={InboxDetail}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AddClass"
          component={AddClass}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="BackToDashboard"
          component={BackToDashboard}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ClockIn"
          component={ClockIn}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ClassTimerCount"
          component={ClassTimerCount}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ScheduleSuccessfully"
          component={ScheduleSuccessfully}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ClockOut"
          component={ClockOut}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AttendedDetails"
          component={AttendedDetails}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="PaymentHistory"
          component={PaymentHistory}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="TutorDetails"
          component={TutorDetailForm}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
const styles = StyleSheet.create({
  customFont: {
    fontFamily: 'Circular Std Black', // Use the actual font name here
  },

  tabBarStyle: {
    borderTopWidth: 0,
    height: 80,
    backgroundColor: Theme.white,
  },
});
