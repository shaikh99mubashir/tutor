import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome';
import IonIcons from  'react-native-vector-icons/Ionicons'
import { Theme } from '../constant/theme';
import Home from '../Screens/Home';
import JobTicket from '../Screens/JobTicket';
import Schedule from '../Screens/Schedule';
import Index from '../Screens/Index';
import More from '../Screens/More';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();







function BottomNavigation ()  {

    return (
        <Tab.Navigator
        screenOptions={{
          headerShown: false,
        //   tabBarStyle: {
        //     backgroundColor: Theme.secondary,
        //     padding: 10,
        //     height: 70,
        //   },
        //   tabBarInactiveTintColor: Theme.white,
        //   tabBarActiveTintColor: '#b9be4d',
        //   tabBarShowLabel: true,
        }}
        initialRouteName="home">
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            // tabBarIcon: ({color, size}) => {
            //   return (
            //     <Image
            //       source={require('../assets/Images/gameicon.png')}
            //       style={{width: 30, height: 30, borderRadius: 100}}
            //     />
            //   );
            // },
            // tabBarIconStyle: {marginTop: 0, padding: 0},
            // tabBarItemStyle: {marginBottom: 15, padding: 0},
            // tabBarShowLabel: true,
          }}
        />
        <Tab.Screen
          name="Job Ticket"
          component={JobTicket}
          options={{
            // tabBarIcon: ({color, size}) => {
            //   return (
            //     <IonIcons
            //       name="chatbubble-ellipses-sharp"
            //       color={color}
            //       size={30}
            //     />
            //   );
            // },
            // tabBarIconStyle: {marginTop: 0, padding: 0},
            // tabBarItemStyle: {marginBottom: 15, padding: 0},
            // tabBarShowLabel: true,
          }}
        />
        <Tab.Screen
          name="Schedule"
          component={Schedule}
          options={{
            // tabBarIcon: ({color, size}) => {
            //   return (
            //     <Image
            //       source={require('../assets/Images/PancheeIcon.png')}
            //       style={{width: 80, height: 80, borderRadius: 100}}
            //     />
            //   );
            // },
            // tabBarIconStyle: {marginTop: 0, padding: 0},
            // tabBarItemStyle: {
            //   marginBottom: 60,
            //   padding: 0,
            //   position: 'relative',
            //   bottom: 10,
            // },
            // tabBarShowLabel: true,
          }}
        />
        <Tab.Screen
          name="Index"
          component={Index}
          options={{
            // tabBarIcon: ({color, size}) => {
            //   return <FontAwesome5 name="history" color={color} size={30} />;
            // },
            // tabBarIconStyle: {marginTop: 0, padding: 0},
            // tabBarItemStyle: {marginBottom: 15, padding: 0},
            // tabBarShowLabel: true,
          }}
        />
        <Tab.Screen
          name="More"
          component={More}
        //   options={{
        //     tabBarIcon: ({color, size}) => {
        //       return <FontAwesome5 name="user" color={color} size={30} />;
        //     },
        //     tabBarIconStyle: {marginTop: 0, padding: 0},
        //     tabBarItemStyle: {marginBottom: 15, padding: 0},
        //     tabBarShowLabel: true,
        //   }}
        />
      </Tab.Navigator>
    )
    



}

function AppNavigation() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown:false}} name="Main" component={BottomNavigation}  />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  export default AppNavigation

