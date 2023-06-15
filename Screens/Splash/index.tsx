import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const Splash = ({ navigation }: any) => {

  const navigateToHomeScreen = () => {
    setTimeout(async () => {

      let data = await AsyncStorage.getItem("login")


      let authData = await AsyncStorage.getItem("loginAuth")

      if (authData) {
        navigation.replace("Main", authData)
        return
      }

      if (data) {
        navigation.replace('Login');
        return
      }
      navigation.replace('OnBoarding');
    }, 3000);
  };
  useEffect(() => {
    navigateToHomeScreen();
  }, []);
  return (
    <View style={{ backgroundColor: 'white', height: '100%', paddingHorizontal: 15, alignItems: 'center' }}>

      <Image
        source={require('../../Assets/Images/logo.png')}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width / 1.1,
  },
});
