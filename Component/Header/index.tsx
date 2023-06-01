import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
  } from 'react-native';
  import React from 'react';
import { Theme } from '../../constant/theme';
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
      noLogo,
      myStyle,
    } = Props;
  
    return (
      <View
        style={{
          backgroundColor: 'rgba(52, 52, 52, 0.0)',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
          marginTop: 10,
          paddingHorizontal:15,
          borderBottomColor:'grey',
          borderBottomWidth:1
        }}>
        <>
          {Drawer ? (
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              activeOpacity={0.8}
              onPress={() => navigation.openDrawer()}>
              <Text>
              </Text>
            </TouchableOpacity>
          ) :backBtn ? (
            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}>
              <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
                <Image source={require('../../Assets/Images/back.png')} style={{width:20, height:20}} resizeMode='contain'/>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
              }}></View>
          )}
  
          {title ? (
            <View style={{flex: 2, alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 20,
                  color: Theme.darkGray,
                  marginVertical: 15,
                  fontWeight: 'bold',
                }}>
                {title}
              </Text>
            </View>
          )  : (
            <View style={{flex: 2}}>
            </View>
          )}
          {filter ? (
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
                activeOpacity={0.8}
                onPress={() => {}}>
                <Image source={require('../../Assets/Images/funnel.png')} style={{width:20, height:20}} resizeMode='contain'/>
                   
              </TouchableOpacity>
            </View>
          ) :addClass ? (
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
                activeOpacity={0.8}
                onPress={() =>{} }>
                <Image source={require('../../Assets/Images/plus.png')} style={{width:20, height:20}} resizeMode='contain' />
              </TouchableOpacity>
            </View>
          ):  (
            <View style={{flex: 1}}>
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
  });
  