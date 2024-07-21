import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import CustomButton from '../../Component/CustomButton';
import { Theme } from '../../constant/theme';


const {width, height} = Dimensions.get('window');

const COLORS = {primary: 'pink', white: 'black'};

const slides = [
  {
    id: '1',
    image: require('../../Assets/Images/OnBoardingOne.png'),
    // image2: require('../../Assets/Images/Dot.png'),
    title: 'Tutor with Confidence',
    subtitle: 'Share Your Knowledge and ',
    subtitle2: 'Help Students Succeed',
  },
  {
    id: '2',
    image: require('../../Assets/Images/OnBoardingTwo.png'),
    // image2: require('../../Assets/Images/Dot.png'),
    title: 'Teach, We Manage Billing!',
    subtitle: 'Just Focus on What You do Best, Teach!',
    subtitle2: 'Let us Handle all the Billings',
  },
  {
    id: '3',
    image: require('../../Assets/Images/OnBoardingThree.png'),
    // image2: require('../../Assets/Images/Dot.png'),
    title: 'Earn More, Teach Better!',
    subtitle: 'We Offer Tutors Competitive Pay.',
    subtitle2: 'Earn More with a Rewarding Career as a Tutor',
  },
];

const Slide = ({item}: any) => {
  return (
    <View style={{alignItems: 'center', marginTop: 40}}>
      <Text
        style={[
          {
            marginTop: 20,
            fontFamily: 'Circular Std Medium',
            color: 'black',
            fontSize: 24,
            lineHeight: 24,
          },
        ]}>
        {item?.title}
      </Text>
      <Image
        source={item?.image}
        style={{height: '50%', width, resizeMode: 'contain', marginTop: 40}}
      />
      <View
        style={{alignItems: 'center', justifyContent: 'center', marginTop: 30}}>
        <Text
          style={{
            fontFamily: 'Circular Std Medium',
            color: 'black',
            fontSize: 15,
            lineHeight: 23,
          }}>
          {item?.subtitle}
        </Text>
      </View>
      {item?.subtitle2 && (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontFamily: 'Circular Std Medium',
              color: 'black',
              fontSize: 15,
            }}>
            {item?.subtitle2}
          </Text>
        </View>
      )}
    </View>
  );
};

const OnBoarding = ({navigation}: any) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref: any = React.useRef();
  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };

  const handleDonePress = () => {
    AsyncStorage.setItem('login', 'login');
    navigation.replace('Login');
  };
  const handleLoginPress = () => {
    // AsyncStorage.setItem('OnBoarding', 'true');
    navigation.replace('Login');
  };

  const Footer = () => {
    return (
      <View style={{marginBottom: 20, marginHorizontal: 20}}>
        {currentSlideIndex == slides.length - 1 ? (
          <>
            <View style={{height: 50, paddingHorizontal: 15, marginBottom: 20,}}>
              <CustomButton
                onPress={() => handleDonePress()}
                btnTitle="Continue To Login"
              />
            </View>
            {/* <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleLoginPress()}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 40,
                flexDirection: 'row',
                gap: 10,
              }}>
              <View>
                <Text
                  style={{
                    color: Theme.IronsideGrey,
                    alignSelf: 'center',
                    fontSize: 16,
                    fontFamily: 'Circular Std Medium',
                  }}>
                  Already have an Account?
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: Theme.Dune,
                    fontWeight: '500',
                    fontSize: 16,
                    borderBottomWidth: 2,
                    borderBottomColor: Theme.darkGray,
                    fontFamily: 'Circular Std Medium',
                  }}>
                  Login
                </Text>
              </View>
            </TouchableOpacity> */}
          </>
        ) : (
          <View style={{height: 50, marginBottom: 20, paddingHorizontal: 15}}>
            <CustomButton onPress={goToNextSlide} btnTitle="Next" />
          </View>
        )}
      </View>
    );
  };

  const roundedCornerStyle = {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  };

  const roundedEndStyle = {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    left: -1,
  };

  const UpperScroll = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          left: 10,
        }}>
        {/* Render indicator */}
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === 2 ? roundedEndStyle : {},
              currentSlideIndex >= index && {
                backgroundColor: Theme.darkGray,
                width: 35,
                height: 8,
                borderWidth: 0,
                ...(index === 0 ? roundedCornerStyle : {}),
                ...(index === slides.length - 1 ? roundedEndStyle : {}),
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Theme.white, paddingTop: 20}}>
      {/* <StatusBar backgroundColor={COLORS.primary} /> */}
      <View style={{alignItems: 'center', flexDirection: 'row', marginTop: 20}}>
        <View style={{width: '60%'}}>
          <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <UpperScroll />
            {/* <Image source={require("../../Images/Dot.png")}/> */}
          </View>
        </View>

        <View style={{width: '40%'}}>
          <TouchableOpacity
            onPress={() => skip()}
            activeOpacity={0.8}
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginRight: 20,
            }}>
            {currentSlideIndex !== slides.length - 1 && (
              <Text
                style={{
                  color: Theme.Dune,
                  textAlign: 'right',
                  fontSize: 14,
                  fontFamily: 'Circular Std Medium',
                }}>
                Skip
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            marginTop: 40,
            color: 'black',
            fontSize: 20,
            fontFamily: 'Circular Std Medium',
            fontWeight: '500',
          }}>{`${currentSlideIndex + 1}/${slides.length}`}</Text>
      </View>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: COLORS.white,
    fontSize: 13,
    marginTop: 10,
    // maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 23,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    // marginTop: 20,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    height: 8,
    width: 35,
    backgroundColor: Theme.lightBlue,
    // borderLeftWidth:1
  },
  btn: {
    flex: 1,
    height: 50,
    // width:360,
    borderRadius: 30,
    flexShrink: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default OnBoarding;
