import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { Theme } from '../../constant/theme';
import CustomButton from '../../Component/CustomButton';

const GetStarted = ({navigation}: any) => {
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
      scrollEnabled={false}
      style={{backgroundColor: Theme.darkGray}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 35,
        }}>
        <Text style={styles.textType2}>Welcome to Sifututor!</Text>
        <View style={{margin: 5}}></View>
        <Text style={styles.textType1}>
          Simplify Your Tutor Search for Your
        </Text>
        <Text style={styles.textType1}>
          Child's Success. Get a recommended{' '}
        </Text>
        <Text style={styles.textType1}>Tutor within 24 Hours. </Text>
      </View>
      <View style={{margin: 10}}></View>
      <View style={{alignItems: 'center',}}>
        <Image source={require('../../Assets/Images/getStarted.png')} resizeMode='contain' style={{width:'85%'}}/>
      </View>
      <View style={{margin: 20}}></View>
      <View style={{marginHorizontal: 35}}>
        <CustomButton
          btnTitle="Get Started"
          backgroundColor={Theme.WhiteSmoke}
          color={Theme.Black}
          onPress={() => navigation.replace('Login')}
        />
      </View>
    </ScrollView>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  textType1: {
    textAlign: 'center',
    color: Theme.white,
    fontSize: 14,
    fontFamily: 'Circular Std Medium',
  },
  textType2: {
    textAlign: 'center',
    color: Theme.white,
    fontSize: 26,
    fontFamily: 'Circular Std Medium',
  },
});
