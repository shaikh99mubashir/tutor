// import notifee, { EventType } from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging';
// import { PERMISSIONS, request } from 'react-native-permissions';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// //method was called to get FCM tiken for notification
// export const getFcmToken = async () => {
//     let token = null;
//     await checkApplicationNotificationPermission();
//     await registerAppWithFCM();
//     try {
//         token = await messaging().getToken();
//         console.log('getFcmToken-->', token);
//     } catch (error) {
//         console.log('getFcmToken Device Token error ', error);
//     }
//     return token;
// };

// //method was called on  user register with firebase FCM for notification
// export async function registerAppWithFCM() {
//     console.log(
//         'registerAppWithFCM status',
//         messaging().isDeviceRegisteredForRemoteMessages,
//     );
//     if (!messaging().isDeviceRegisteredForRemoteMessages) {
//         await messaging()
//             .registerDeviceForRemoteMessages()
//             .then(status => {
//                 console.log('registerDeviceForRemoteMessages status', status);
//             })
//             .catch(error => {
//                 console.log('registerDeviceForRemoteMessages error ', error);
//             });
//     }
// }

// //method was called on un register the user from firebase for stoping receiving notifications
// export async function unRegisterAppWithFCM() {
//     console.log(
//         'unRegisterAppWithFCM status',
//         messaging().isDeviceRegisteredForRemoteMessages,
//     );

//     if (messaging().isDeviceRegisteredForRemoteMessages) {
//         await messaging()
//             .unregisterDeviceForRemoteMessages()
//             .then(status => {
//                 console.log('unregisterDeviceForRemoteMessages status', status);
//             })
//             .catch(error => {
//                 console.log('unregisterDeviceForRemoteMessages error ', error);
//             });
//     }
//     await messaging().deleteToken();
//     console.log(
//         'unRegisterAppWithFCM status',
//         messaging().isDeviceRegisteredForRemoteMessages,
//     );
// }

// export const checkApplicationNotificationPermission = async () => {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//         console.log('Authorization status:', authStatus);
//     }
//     request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
//         .then((result: any) => {
//             console.log('POST_NOTIFICATIONS status:', result);
//         })
//         .catch((error: any) => {
//             console.log('POST_NOTIFICATIONS error ', error);
//         });
// };

// //method was called to listener events from firebase for notification triger
// export function registerListenerWithFCM() {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//         console.log('onMessage Received : ', JSON.stringify(remoteMessage));
//         if (
//             remoteMessage?.notification?.title &&
//             remoteMessage?.notification?.body
//         ) {
//             onDisplayNotification(
//                 remoteMessage.notification?.title,
//                 remoteMessage.notification?.body,
//                 remoteMessage?.data,
//             );
//         }
//     });
//     notifee.onForegroundEvent(({ type, detail }) => {
//         console.log("Detail", detail);

//         switch (type) {
//             case EventType.DISMISSED:
//                 console.log('User dismissed notification', detail.notification);
//                 break;
//             case EventType.PRESS:

//                 console.log('User pressed notification', detail.notification);
//                 const sender = detail?.notification?.data?.sender
//                 console.log('click action', detail?.notification?.data?.clickAction);

//                 console.log("sendersendersender", sender);

//                 break;
//             case EventType.ACTION_PRESS:
//                 console.log('ACTION_PRESS', detail.notification);
//                 break;
//         }
//     });



//     notifee.onBackgroundEvent(async ({ type, detail }) => {
//         const { notification, pressAction, input } = detail;

//         if (type === EventType.ACTION_PRESS) {
//             console.log('User pressed notification Background', detail.notification);
//             //   updateChatOnServer(notification.data.conversationId, input);
//         }
//     });

//     messaging().onNotificationOpenedApp(async remoteMessage => {
//         console.log(
//             'onNotificationOpenedApp Received',
//             JSON.stringify(remoteMessage),
//         );
//         // if (remoteMessage?.data?.clickAction) {
//         //   onNotificationClickActionHandling(remoteMessage.data.clickAction);
//         // }
//     });
//     // Check whether an initial notification is available
//     messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//             if (remoteMessage) {
//                 console.log(
//                     'Notification caused app to open from quit state:',
//                     remoteMessage.notification,
//                 );
//             }
//         });

//     return unsubscribe;
// }

// //method was called to display notification

// async function onDisplayNotification(title: any, body: any, data: any) {

//     console.log('onDisplayNotification Adnan: ', JSON.stringify(data));
//     const notiRoute = JSON.stringify(data)
//     const notiRouteObject = JSON.parse(notiRoute);
//     console.log("notiRoute.screen name", notiRouteObject.screen);
//     AsyncStorage.setItem(notiRouteObject.screen, 'NotiRoute')
//         .then(() => {
//             console.log("notiRoute screen setted")
//         })
//         .catch(() => {
//             console.log("errror notiRoute screen setted")
//         })
//     const navigation: any = useNavigation()
//     navigation.navigate('Main', {
//         screen: notiRouteObject.screen,
//     });
//     // Request permissions (required for iOS)
//     await notifee.requestPermission();
//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//         id: 'default',
//         name: 'Default Channel',
//     });

//     // Display a notification
//     await notifee.displayNotification({
//         title: title,
//         body: body,
//         data: data,
//         android: {
//             channelId,
//             // pressAction is needed if you want the notification to open the app when pressed
//             pressAction: {
//                 id: 'default',
//             },
//         },
//     });
// }

import notifee, {EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {PERMISSIONS, request} from 'react-native-permissions';
//method was called to get FCM tiken for notification
export const getFcmToken = async () => {
  let token = null;
  await checkApplicationNotificationPermission();
  await registerAppWithFCM();
  try {
    token = await messaging().getToken();
    console.log('getFcmToken-->', token);
  } catch (error) {
    console.log('getFcmToken Device Token error ', error);
  }
  return token;
};

//method was called on  user register with firebase FCM for notification
export async function registerAppWithFCM() {
  console.log(
    'registerAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging()
      .registerDeviceForRemoteMessages()
      .then(status => {
        console.log('registerDeviceForRemoteMessages status', status);
      })
      .catch(error => {
        console.log('registerDeviceForRemoteMessages error ', error);
      });
  }
}

//method was called on un register the user from firebase for stoping receiving notifications
export async function unRegisterAppWithFCM() {
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );

  if (messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging()
      .unregisterDeviceForRemoteMessages()
      .then(status => {
        console.log('unregisterDeviceForRemoteMessages status', status);
      })
      .catch(error => {
        console.log('unregisterDeviceForRemoteMessages error ', error);
      });
  }
  await messaging().deleteToken();
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
}

export const checkApplicationNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
    .then(result => {
      console.log('POST_NOTIFICATIONS status:', result);
    })
    .catch(error => {
      console.log('POST_NOTIFICATIONS error ', error);
    });
};

//method was called to listener events from firebase for notification triger
export function registerListenerWithFCM() {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('onMessage Received : ', JSON.stringify(remoteMessage));
    if (
      remoteMessage?.notification?.title &&
      remoteMessage?.notification?.body
    ) {
      onDisplayNotification(
        remoteMessage.notification?.title,
        remoteMessage.notification?.body,
        remoteMessage?.data,
      );
    }
  });
  notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        let screenName = detail?.notification?.data?.sender
        handleNotification(detail)
        break;
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
  
    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS) {
      // Update external API
      let screenName = detail?.notification?.data?.sender
      console.log("screenName",screenName);
      
        // if(screenName =='jobTicket')
        // navigation.replace('Main', {
        //   screen: 'jobTicket',
        // });
    }
  });

  async function handleNotification(detail: any) {
    try {
      const screenName = detail?.notification?.data?.sender;
      console.log("screenName", screenName);

      if (screenName) {
        await AsyncStorage.setItem('notiScreenRoute', screenName);
      }
    } catch (error) {
      console.error("Error saving screen name to AsyncStorage:", error);
    }
  }

  messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log(
      'onNotificationOpenedApp Received',
      JSON.stringify(remoteMessage),
    );
    // if (remoteMessage?.data?.clickAction) {
    //   onNotificationClickActionHandling(remoteMessage.data.clickAction);
    // }
  });
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  return unsubscribe;
}

//method was called to display notification
async function onDisplayNotification(title:any, body:any, data:any) {
  console.log('onDisplayNotification Adnan: ', JSON.stringify(data));

  // Request permissions (required for iOS)
  await notifee.requestPermission();
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    data: data,
    android: {
      channelId,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}