import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React ,{useRef,useState}from 'react'
import PhoneInput from 'react-native-phone-number-input';
import { Theme } from '../../constant/theme';

const Login = ({navigation}:any) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const phoneInput = useRef(null);
  return (
    <View style={{backgroundColor:'white', height:'100%', justifyContent:'center',paddingHorizontal:15}}>
      <Text style={{fontSize:25, color:'black'}}>Enter your{'\n'}mobile number</Text>
      <Text style={{fontSize:14, color:'black', marginTop:14}}>A verification code will send to{'\n'}this mobile number</Text>
      <View style={styles.container}>
          <PhoneInput
            ref={phoneInput}
            placeholder="Enter Your Number"
            defaultValue={phoneNumber}
            defaultCode="PK"
            layout="first"
            autoFocus={true}
            textInputStyle={{color: Theme.black, height: 50}}
            textInputProps={{placeholderTextColor: Theme.gray}}
            codeTextStyle={{marginLeft: -15, paddingLeft: -55, color: 'black'}}
            containerStyle={styles.phoneNumberView}
            textContainerStyle={{
              height: 60,
              backgroundColor: 'white',
              borderRadius:10,
              borderColor: 'transparent',
            }}
            onChangeFormattedText={text => {
              setPhoneNumber(text);
            }}
          />
        </View>
        {/* Submit Button */}
      
        <View
          style={{
            borderWidth: 1,
            borderColor: Theme.white,

            marginVertical: 20,
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={()=>navigation.navigate('Verification') }
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.darkGray,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
              }}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        autoFocus: true,
        // flex: 1,
        marginTop:20
      },
      phoneNumberView: {
        // height: 70,
        width: '100%',
        backgroundColor: 'white',
        borderColor: Theme.gray,
        borderRadius: 10,
        borderWidth: 1,
        color: '#E5E5E5',
        flexShrink: 22,
        autoFocus: true,
      },
})