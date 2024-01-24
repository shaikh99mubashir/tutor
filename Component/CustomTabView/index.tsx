import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { Theme } from '../../constant/theme';

const CustomTabView = (Props: any): any => {
  const {
    firstRoute,
    secondRoute,
    thirdRoute,
    currentTab,
    activateTab,
    firstRouteTitle,
    secondRouteTitle,
    thirdRouteTitle,
  } = Props;

  const myFirstRoute = () => {
    firstRoute();
  };

  const mySecondRoute = () => {
    secondRoute();
  };

  return (
    <View>
    <View style={{ marginBottom: 40, alignItems: 'center' }}>
      <View
        style={{
          // width: Dimensions.get('window').width / 1.08
          width:'100%',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 10,
          // backgroundColor:Theme.lightGray,
          borderRadius:10,
          padding:5,
        }}>
        <TouchableOpacity
        activeOpacity={0.8}
          onPress={() => activateTab(0)}
          style={{
            // width: '49%',
            width: 
            currentTab &&
                currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
                ? '55%'
                : '40%'
            ,
            borderRadius: 50,

            paddingVertical: 
            currentTab &&
            currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
            ? 15
            : 10,
            
            paddingHorizontal: 
            currentTab &&
            currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
            ? 15
            : 15,
            borderColor: Theme.darkGray,
            // borderWidth:1,
            backgroundColor:
              currentTab &&
                currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
                ? Theme.darkGray
                : Theme.lightGray,
                // backgroundColor:'white'
          }}>
          <Text
            style={[
              styles.text,
              {
                color:
                  currentTab &&
                    currentTab.some(
                      (e: any, i: any) => e.index == 0 && e.selected,
                    )
                    ? 'white'
                    : Theme.Dune,
                // borderBottomWidth: 3,
                fontFamily: 'Circular Std Medium',
                fontSize:
                currentTab &&
                currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
                ? 18
                : 20,
              },
            ]}>
            {firstRouteTitle}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        activeOpacity={0.8}
          onPress={() => activateTab(1)}
          style={{
            width: 
            currentTab &&
                currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
                ? '40%'
                : '55%'
            ,
            borderRadius: 50,
            paddingVertical: 
            currentTab &&
            currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
            ? 10
            : 15,
            paddingHorizontal: 
            currentTab &&
            currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
            ? 15
            : 15,
            // borderWidth:1,
            // borderColor: Theme.gray,
            // backgroundColor:
            //   currentTab &&
            //   currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
            //     ? Color.mainColor
            //     : 'white',
            backgroundColor:
              currentTab &&
                currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
                ? Theme.lightGray
                : Theme.darkGray,
          }}>
          <Text
            style={[
              styles.text,
              {
                color:
                  currentTab &&
                    currentTab.some(
                      (e: any, i: any) => e.index == 1 && e.selected,
                    )
                    ? 'white'
                    : Theme.Dune,
                // borderBottomWidth: 3,
                fontFamily: 'Circular Std Medium',
                fontSize:
                currentTab &&
                currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
                ? 20
                : 18,
                borderBottomColor:
                  currentTab &&
                    currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
                    ? Theme.darkGray
                    : 'white',
              },
            ]}>
            {secondRouteTitle}
          </Text>
        </TouchableOpacity>
      </View>

      {currentTab &&
        currentTab.length > 0 &&
        currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
        ? firstRoute()
        :
        currentTab.length > 0 &&
          currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
          ?
          secondRoute() : thirdRoute()}
    </View>
  </View>
    // <View>
    //   <View style={{ marginBottom: 40, alignItems: 'center' }}>
    //     <View
    //       style={{
    //         width: Dimensions.get('window').width / 1.08,
    //         alignItems: 'center',
    //         flexDirection: 'row',
    //         gap: 10,
    //         backgroundColor:Theme.lightGray,
    //         borderRadius:10,
    //         padding:5,
    //       }}>
    //       <TouchableOpacity
    //       activeOpacity={0.8}
    //         onPress={() => activateTab(0)}
    //         style={{
    //           width: '49%',
    //           borderRadius: 10,
    //           paddingVertical: 5,
    //           borderColor: Theme.darkGray,
    //           // borderWidth:1,
    //           backgroundColor:
    //             currentTab &&
    //               currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
    //               ? 'white'
    //               : Theme.lightGray,
    //               // backgroundColor:'white'
    //         }}>
    //         <Text
    //           style={[
    //             styles.text,
    //             {
    //               color:
    //                 currentTab &&
    //                   currentTab.some(
    //                     (e: any, i: any) => e.index == 0 && e.selected,
    //                   )
    //                   ? 'black'
    //                   : Theme.gray,
    //               // borderBottomWidth: 3,
    //               borderBottomColor:
    //                 currentTab &&
    //                   currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
    //                   ? Theme.darkGray
    //                   : 'white',
    //             },
    //           ]}>
    //           {firstRouteTitle}
    //         </Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //       activeOpacity={0.8}
    //         onPress={() => activateTab(1)}
    //         style={{
    //           width: '48%',
    //           borderRadius: 10,
    //           paddingVertical: 5,
    //           // borderWidth:1,
    //           // borderColor: Theme.gray,
    //           // backgroundColor:
    //           //   currentTab &&
    //           //   currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
    //           //     ? Color.mainColor
    //           //     : 'white',
    //           backgroundColor:
    //             currentTab &&
    //               currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
    //               ? 'white'
    //               : Theme.lightGray,
    //         }}>
    //         <Text
    //           style={[
    //             styles.text,
    //             {
    //               color:
    //                 currentTab &&
    //                   currentTab.some(
    //                     (e: any, i: any) => e.index == 1 && e.selected,
    //                   )
    //                   ? 'black'
    //                   : Theme.gray,
    //               // borderBottomWidth: 3,
    //               borderBottomColor:
    //                 currentTab &&
    //                   currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
    //                   ? Theme.darkGray
    //                   : 'white',
    //             },
    //           ]}>
    //           {secondRouteTitle}
    //         </Text>
    //       </TouchableOpacity>
    //       {/* <TouchableOpacity
    //         onPress={() => activateTab(2)}
    //         style={{
    //           width: '29%',
    //           borderRadius: 10,
    //           paddingVertical: 5,
    //           // borderWidth:1,
    //           // borderColor: Theme.gray,
    //           // backgroundColor:
    //           //   currentTab &&
    //           //   currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
    //           //     ? Color.mainColor
    //           //     : 'white',
    //           backgroundColor:
    //           currentTab &&
    //             currentTab.some((e: any, i: any) => e.index == 2 && e.selected)
    //             ? 'white'
    //             : Theme.lightGray,
    //         }}>
    //         <Text
    //           style={[
    //             styles.text,
    //             {
    //               color:
    //                 currentTab &&
    //                   currentTab.some(
    //                     (e: any, i: any) => e.index == 2 && e.selected,
    //                   )
    //                   ? 'black'
    //                   : Theme.gray,
    //               // borderBottomWidth: 3,
    //               borderBottomColor:
    //                 currentTab &&
    //                   currentTab.some((e: any, i: any) => e.index == 2 && e.selected)
    //                   ? Theme.darkGray
    //                   : 'white',
    //             },
    //           ]}>
    //           {thirdRouteTitle}
    //         </Text>
    //       </TouchableOpacity> */}
    //     </View>

    //     {currentTab &&
    //       currentTab.length > 0 &&
    //       currentTab.some((e: any, i: any) => e.index == 0 && e.selected)
    //       ? firstRoute()
    //       :
    //       currentTab.length > 0 &&
    //         currentTab.some((e: any, i: any) => e.index == 1 && e.selected)
    //         ?
    //         secondRoute() : thirdRoute()}
    //   </View>
    // </View>
  );
};

export default CustomTabView;

const styles = StyleSheet.create({
  text: {
    color: Theme.Dune,
    fontSize: 18,
    // fontWeight: '400',
    textAlign: 'center',
    fontFamily: 'Circular Std Book'
  },
});