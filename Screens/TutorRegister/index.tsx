import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import InputText from '../../Component/InputText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../Component/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';

const UpdateProfile = ({ navigation, route }: any) => {
  let data = route.params;
  const [isChecked, setIsChecked] = useState(false);


  const [updateProfile, setUpdateProfile] = useState({
    fullName: '',
    email: '',
  });

  console.log('updateProfile', updateProfile);


  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
  });

  const [loading, setLoading] = useState(false)
  const handleUpdateProfile = async () => {
    setLoading(true)
    // Validation logic goes here
    const newErrors = {
      fullName: updateProfile.fullName ? '' : 'Full Name is required',
      email: !updateProfile.email
        ? 'Email is required'
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateProfile.email)
          ? 'Email is invalid'
          : '',
    };



    if (!isChecked) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Kindly accept terms and conditions',
        position: 'bottom',
      });
    }
    setErrors(newErrors);

    // Proceed with updating profile if there are no errors
    if (Object.values(newErrors).every((error) => !error)) {
      try {
        let formData = new FormData();
        formData.append('fullName', updateProfile.fullName);
        formData.append('email', updateProfile.email);
        formData.append('tutorId', data.tutorDetailById[0]?.id);
        formData.append('phoneNumber', data.tutorDetailById[0]?.phoneNumber);
    
        setLoading(true);
        console.log(formData, 'formData');
        console.log("data.tutorDetailById[0]?.id",data.tutorDetailById[0]?.id);
        axios
          .post(`${Base_Uri}api/appTutorRegister`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(({ data }) => {
            console.log('data signup===>', data.Msg);
            if(data?.Msg){
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2:  `${data?.Msg}`,
                position: 'bottom'
              });
              setLoading(false);
              return
            }
            if (data.status == 200) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Main',
                    params: {
                      screen: 'Home',
                    },
                  },
                ],
              });
              navigation.replace('Main', {
                screen: 'Home',
              });
              Toast.show({
                type: 'success',
                text1: 'Register Successfully',
                text2:  `${data?.Msg}`,
                position: 'bottom'
              });
              setLoading(false);
            }
          })
          .catch((error: any) => {
            setLoading(false);
            console.log("error", error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2:  `Network Error`,
              position: 'bottom'
            });
          });
      }
      catch (error: any) {
        setLoading(false)
        if (error.response) {
          console.log('update profile Server responded with data:', error.response.data);
          console.log('update profile Status code:', error.response.status);
          console.log('update profile Headers:', error.response.headers);
        } else if (error.request) {
          console.log('update profile No response received:', error.request);
        } else {
          console.log('Error update profile setting up the request:', error.message);
        }
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `${error == 'AxiosError: Network Error' ? 'Network Error' : 'Error in update profile'}`,
          position: 'bottom',
        });
      }

    }
  };




  const toggleCheckbox = () => {
    setIsChecked(prevState => !prevState);
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Theme.GhostWhite,
        paddingHorizontal: 25,
        height: '100%'
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Header navigation={navigation} />
        <Text style={[styles.textType2]}>Register Profile</Text>
        <View style={{ margin: 8 }}></View>
        <Text
          style={[
            styles.textType1,
            { lineHeight: 20, color: Theme.IronsideGrey },
          ]}>
          We are glad that you Joined with us, {'\n'}Enter your details.{' '}
        </Text>
        <View style={{ margin: 10 }}></View>

        <InputText
          placeholder="Full Name"
          value={updateProfile.fullName}
          onChangeText={(e: string) => setUpdateProfile({ ...updateProfile, fullName: e })}
          error={errors.fullName}
        />
        <InputText
          placeholder="Email"
          value={updateProfile.email}
          onChangeText={(e: string) => setUpdateProfile({ ...updateProfile, email: e })}
          error={errors.email}
        />

        <View style={{ margin: 10 }}></View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {isChecked ? (
            <TouchableOpacity onPress={() => toggleCheckbox()}>
              <MaterialCommunityIcons
                name="checkbox-outline"
                color={Theme.darkGray}
                size={24}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => toggleCheckbox()}>
              <MaterialCommunityIcons
                name="checkbox-blank-outline"
                color={Theme.darkGray}
                size={24}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity activeOpacity={0.8} onPress={() => Linking.openURL('https://sifututor.my/terms-of-use/')}>
            <Text
              style={[
                styles.textType1,
                {
                  color: Theme.IronsideGrey,
                  fontFamily: 'Circular Std Book',
                  lineHeight: 23,
                  width: 330,
                  fontSize: 16,
                },
              ]}>
              By doing this, I agree to Sifututor {'\n'}
              <Text style={{ textDecorationLine: 'underline', color: Theme.Black }}>
                Terms and Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>
          <View style={{ margin: 10 }}></View>
        </View>
        <View style={{ margin: 20 }}></View>
        <CustomButton
          btnTitle="Register"
          backgroundColor={Theme.darkGray}
          color={Theme.white}
          onPress={handleUpdateProfile}
          loading={loading}
        />
        <View style={{ margin: 20 }}></View>


      </ScrollView>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  textType1: {
    color: Theme.Black,
    fontSize: 17,
    fontFamily: 'Circular Std Medium',
  },
  textType2: {
    color: Theme.Black,
    fontSize: 26,
    fontFamily: 'Circular Std Medium',
  },
  phoneNumberView: {
    // height: 70,
    width: '100%',
    // backgroundColor: 'white',
    borderColor: Theme.GhostWhite,
    backgroundColor: '#CECECE',
    borderRadius: 10,
    borderWidth: 1,
    color: '#E5E5E5',
    flexShrink: 22,
    fontFamily: 'Circular Std Medium',
  },
});
