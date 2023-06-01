import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome';
// import IonIcons from  'react-native-vector-icons/Ionicons'
import { Theme } from '../constant/theme';
import Home from '../Screens/Home';
import JobTicket from '../Screens/JobTicket';
import Schedule from '../Screens/Schedule';
import Index from '../Screens/Index';
import More from '../Screens/More';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import OpenDetails from '../Screens/OpenDetails';
import Notifications from '../Screens/Notifications';
import AppliedDetails from '../Screens/AppliedDetails';
import Filter from '../Screens/Filter';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomNavigation ()  {

    return (
        <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarInactiveTintColor: Theme.darkGray,
          // tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: 'black',
        })}
        initialRouteName="home">
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
                      padding: 5,
                      borderRadius: 5,
                    }}>
                    <Image
                      source={require('../Assets/Images/home.png')}
                      resizeMode="contain"
                      style={{
                        height: 30,
                        width: 30,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
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
                      source={require('../Assets/Images/home.png')}
                      resizeMode="contain"
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
                      }}
                    />
                  </View>
                )}
              </View>
            ),
          }}
        />
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
                      source={require('../Assets/Images/ticket.png')}
                      resizeMode="contain"
                      style={{
                        height: 30,
                        width: 30,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
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
                      source={require('../Assets/Images/ticket.png')}
                      resizeMode="contain"
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
                      }}
                    />
                  </View>
                )}
              </View>
            ),
          }}
        />
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
                      source={require('../Assets/Images/schedule.png')}
                      resizeMode="contain"
                      style={{
                        height: 30,
                        width: 30,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
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
                      source={require('../Assets/Images/schedule.png')}
                      resizeMode="contain"
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
                      }}
                    />
                  </View>
                )}
              </View>
            ),
          }}
        />
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
                      source={require('../Assets/Images/inbox.png')}
                      resizeMode="contain"
                      style={{
                        height: 30,
                        width: 30,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
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
                      source={require('../Assets/Images/inbox.png')}
                      resizeMode="contain"
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
                      }}
                    />
                  </View>
                )}
              </View>
            ),
          }}
        />
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
                      source={require('../Assets/Images/settings.png')}
                      resizeMode="contain"
                      style={{
                        height: 30,
                        width: 30,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
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
                      source={require('../Assets/Images/settings.png')}
                      resizeMode="contain"
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: focused ? Theme.darkGray : Theme.lightGray,
                      }}
                    />
                  </View>
                )}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    )
    

}

function AppNavigation() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown:false}} name="Main" component={BottomNavigation}  />
          <Stack.Screen options={{headerShown:false}} name="OpenDetails" component={OpenDetails} />
        <Stack.Screen options={{headerShown:false}} name="Notifications" component={Notifications} />
        <Stack.Screen options={{headerShown:false}} name="AppliedDetails" component={AppliedDetails} />
        <Stack.Screen options={{headerShown:false}} name="Filter" component={Filter} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  export default AppNavigation

