import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Theme } from '../../constant/theme';
import Icon from 'react-native-vector-icons/AntDesign';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
export type Props = {
  navigation: any;
};

const Header = (Props: any) => {
  let {
    navigation,
    Drawer,
    backBtn,
    backBtnColor,
    filter,
    addClass,
    title,
    plus,
    noLogo,
    myStyle,
    tab,
    containerStyle,
    recordsFilter,
    BackBtn
  } = Props;

  const routeToFilter = () => {

    let selectedTab = tab.filter((e: any, i: number) => {

      return e.selected

    })

    if (selectedTab[0]?.name == "Applied") {
      navigation.navigate('Filter', "applied")
    } else {
      navigation.navigate('Filter')
    }
  }

  const routeToRecordFilter = () => {
    navigation.navigate('Filter', "tutorrecords")
  }


  const previousRouteName = navigation?.getState().routes[navigation.getState().routes.length - 2]?.name;

  // console.log("Previous Route Name:", previousRouteName);
  const handleGoBack = () => {
    if (previousRouteName == undefined) {
      navigation.replace("Main", {
        screen: "Home",
      });
      // navigation.replace("Main");
    } else {
      navigation.goBack(); // Navigate back to the previous screen if possible
    }
  };


  return (
    <View
      style={{
        backgroundColor: 'rgba(52, 52, 52, 0.0)',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
        borderBottomColor: 'grey',
        height: 60,
        ...containerStyle
      }}>
      <>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%'
          }}>
          {BackBtn && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, paddingLeft: 0, }}>
              <AntDesign name="arrowleft" size={25} color={'black'} />
              {/* <Entypo name="chevron-left" size={25} color={'black'} /> */}
            </TouchableOpacity>
          )}
          {backBtn &&
            <TouchableOpacity style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', paddingRight: 10, borderRadius: 50 }} onPress={() => handleGoBack()}>
              <Entypo name="chevron-left" size={25} color={'black'} />
              {/* <Image source={require('../../Assets/Images/back.png')} style={{ width: 12, height: 12 }} resizeMode='contain' /> */}
            </TouchableOpacity>
          }
          {title &&
            <Text style={[styles.textType1, { fontFamily: 'Circular Std Bold', width: '100%' }]}>{title}</Text>
          }
        </View>


        {filter ? (
          // <View style={{ flex: 1 }}>
          //   <TouchableOpacity
          //     style={{
          //       flex: 1,
          //       justifyContent: 'center',
          //       alignItems: 'flex-end',
          //     }}
          //     activeOpacity={0.8}
          //     onPress={() => routeToFilter()}>
          //     <Image source={require('../../Assets/Images/funnel.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />

          //   </TouchableOpacity>
          // </View>
          <View
        style={{
          backgroundColor: Theme.shinyGrey,
          padding: 10,
          borderRadius: 50,
        }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => routeToFilter()}>
            <AntDesign name="filter" size={25} color={'black'} />
          </TouchableOpacity>
      </View>
        ) :
          recordsFilter ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
                activeOpacity={0.8}
                onPress={() => routeToRecordFilter()}>
                <Image source={require('../../Assets/Images/funnel.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />

              </TouchableOpacity>
            </View>
          ) :
            addClass ? (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}
                  activeOpacity={0.8}
                  onPress={() => { }}>
                  <Image source={require('../../Assets/Images/plus.png')} style={{ width: 25, height: 25 }} resizeMode='contain' />
                </TouchableOpacity>
              </View>
            ) : plus ? <View style={{ flex: 1, alignItems: "flex-end" }}>
              <TouchableOpacity
                style={{
                  // flex: 1,
                  width: 34,
                  height: 34,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                  backgroundColor: Theme.darkGray,
                  padding: 5
                }}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AddClass')}>
                <Icon name={"plus"} size={24} color={Theme.white} />
              </TouchableOpacity>
            </View> : (
              <View style={{ flex: 1 }}>
                <Text></Text>
              </View>
            )}
      </>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  button: {
    height: Dimensions.get('window').height / 12,
    width: Dimensions.get('window').width / 5,
  },
  icon: {
    height: Dimensions.get('window').height / 16,
    width: Dimensions.get('window').width / 16,
  },
  logo: {
    // height: Dimensions.get('window').height / 12,
    // width: Dimensions.get('window').width / 2,
    width: 150,
    height: 40,
    alignSelf: 'center',
  },
  textType1: {
    fontWeight: '500',
    fontSize: 26,
    color: Theme.Black,
    fontFamily: 'Circular Std Medium',
    // lineHeight: 24,
    fontStyle: 'normal',
  },
});
