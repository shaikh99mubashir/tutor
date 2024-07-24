import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Theme } from '../../constant/theme'


const CustomButton = ({ onPress,onPressIn,opacity,disabled,onPressOut, btnTitle, color, backgroundColor, height, loading ,fontSize}: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.btn, { height: height ? height : 55 ,marginVertical: 0, backgroundColor: backgroundColor ? backgroundColor : Theme.darkGray,opacity: opacity ?opacity :'' }]}
    >
      {loading ? (
        <ActivityIndicator color={Theme.white} size="small" />
      ) : (
        <Text style={[styles.textType1, { color: color ? color : Theme.white, textAlign: 'center',fontSize: fontSize? fontSize:24 }]}>{btnTitle}</Text>
      )}
    </TouchableOpacity>

  )
}

export default CustomButton

const styles = StyleSheet.create({
  btn: {
    height: 55,
    borderRadius: 30,
    flexShrink: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 15,
  },
  textType1: {
    fontWeight: '500',
    fontSize: 24, color: Theme.white,
    fontFamily: 'Circular Std Medium', lineHeight: 24
  },
  textType2: {
    color: Theme.IronsideGrey, alignSelf: 'center', fontWeight: '500', fontSize: 16
  },
  textType3: {
    color: Theme.Dune, fontWeight: '500', fontSize: 16, borderBottomWidth: 2, borderBottomColor: Theme.darkGray
  },
});