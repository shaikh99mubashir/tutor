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
import LinearGradient from 'react-native-linear-gradient';
import {Theme} from '../../constant/theme';

const {width, height} = Dimensions.get('window');

const COLORS = {primary: 'pink', white: 'black'};

const slides = [
  {
    id: '1',
    image: require('../../Assets/Images/students1.jpeg'),
    title: 'Teach students from your',
    subtitle: 'Community or nationwide and as ',
    subtitle2: 'much as you want',

  },
  {
    id: '2',
    image: require('../../Assets/Images/students2.jpeg'),
    title: 'Just Focus On what you do best,',
    subtitle: 'teach! Let handel all the',
    subtitle2: 'Billings',
  },
  {
    id: '3',
    image: require('../../Assets/Images/students3.jpeg'),
    title: 'We offer tutors comoetative Pay.',
    subtitle: 'Earn More With a rewarding',
    subtitle2: 'carrer as a tutor',
  },
];
const OnBoarding = ({navigation}: any) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref: any = React.useRef();
  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };
const Slide = ({item}: any) => {
  return (
    <>
  <View style={{alignItems: 'center',justifyContent:'center'}}>
        <Image source={item?.image} style={{width:width/1, height:'70%'}}resizeMode='contain'/>
        
      <View style={{ alignItems:'center', position:'relative',bottom:-50}}>
        <Text style={[styles.textType3,{fontSize:20, fontWeight:'600'}]}>{item?.title}</Text>
        <Text style={[styles.textType3,{fontSize:20, fontWeight:'600'}]}>{item?.subtitle}</Text>
        <Text style={[styles.textType3,{fontSize:20, fontWeight:'600'}]}>{item?.subtitle2}</Text>
      </View>
    </View>
   
  </>
  );
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

  const Footer = () => {
    return (
      <View
        style={{
          // height: height * 0.25,
          // justifyContent: 'space-between',
          // paddingHorizontal: 20,
          // backgroundColor:'black'
        }}>
        {/* Indicator container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            // marginTop: 20,
          }}>
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: Theme.darkGray,
                  width: 10,
                  height:10,
                  borderRadius:50
                },
              ]}
            />
          ))}
        </View>


        <TouchableOpacity activeOpacity={0.8} onPress={() => handleDonePress()} style={{backgroundColor:Theme.lightGray, width:'90%', alignSelf:'center',borderRadius:10, flexDirection:'row', gap:20, paddingHorizontal:18, paddingVertical:15, alignItems:'center', marginTop:40,marginBottom:20}}>
          <Image source={require('../../Assets/Images/malalogo.png')}  style={{width:30, height:30}} resizeMode='contain'/>
              <Text style={styles.textType3}>+60</Text>
              <Text style={styles.textType3}>Enter Your Mobile Number</Text>
        </TouchableOpacity>

        {/* Render buttons */}
        {/* <View style={{marginBottom: 40}}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{height: 50}}>
              <TouchableOpacity
              activeOpacity={0.8}
                style={styles.btn}
                onPress={() => handleDonePress()}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: Theme.white,
                  }}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: COLORS.white,
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: 'rgb(0, 0, 95)',
                  }}>
                  SKIP
                </Text>
              </TouchableOpacity>
              <View style={{width: 15}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: Theme.white,
                  }}>
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View> */}
      </View>
    );
  };

  return (
    // <SafeAreaView style={{flex: 1}}>
      <View style={{backgroundColor:'white',height:'100%'}}>
        {/* <StatusBar backgroundColor={COLORS.primary} /> */}
        
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
      </View>
    // </SafeAreaView>
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
    fontSize: 18,
    fontWeight: '600',
    // marginTop: 20,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 50,
    backgroundColor: 'grey',
    marginHorizontal: 3,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: 'rgb(0, 0, 95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textType1: {
    fontWeight: '500', fontSize: 24, color: Theme.Dune, fontFamily: 'Circular Std Book', lineHeight: 24,
    fontStyle: 'normal'
  },
  textType3: {
    color: Theme.Dune, fontWeight: '500', fontSize: 16,
    fontFamily: 'Circular Std Book',
    fontStyle: 'normal',
  },
});
export default OnBoarding;
