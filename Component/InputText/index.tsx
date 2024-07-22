import { StyleSheet, Text, View,TextInput } from 'react-native'
import React from 'react'
import { Theme } from '../../constant/theme'


const InputText = ({ label, placeholder, onChangeText, value, error,keyboardType, Required }: any) => {
  return (
    <View style={{ gap: 5, marginTop: 0 }}>
    <Text style={styles.label}>{label} {Required  && <Text style={{color:Theme.Red}}>*</Text>}</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          error && { borderWidth: 1, borderColor: 'red' }, // Apply red border if there is an error
        ]}
        placeholder={placeholder}
        placeholderTextColor="#A9A9A9"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
    {error && <Text style={{ color: 'red', }}> {error}</Text>}
  </View>

  )
}

export default InputText

const styles = StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      backgroundColor: 'white',
      height: 60,
      borderRadius: 12,
      elevation: 4, // for Android
      shadowColor: 'rgba(213, 226, 245, 0.40)', // for iOS
      shadowOffset: { width: 0, height: 4 }, // for iOS
      shadowOpacity: 1, // for iOS
      shadowRadius: 20,
      flex: 1,
      padding: 20,
      fontFamily: 'Circular Std Medium',
      color: 'black',
      fontSize: 17,
    },
    label: {
      color: Theme.Dune,
      fontFamily: 'Circular Std Medium',
      fontSize: 16,
    },
  });
  