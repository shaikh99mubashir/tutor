import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import { Theme } from '../../constant/theme';

const UpCommingCarousel = ({ upCommingClassesdata }: any) => {
  // console.log("upCommingClassesdata", upCommingClassesdata);

  const [currentIndexJT, setCurrentIndexJT] = useState(0);
  const flatListRefJT = useRef<FlatList | null>(null);
  const { width, height } = Dimensions.get('screen');
  // const upCommingClassesdata = [
  //   {
  //     id: '1',
  //     name: 'Rebecca P. Nichols',
  //     location: 'Selangor, Malaysia',
  //     type: 'Physical',
  //     subject: 'Mathematics',
  //     day: 'Sunday',
  //     time: '06:00 PM',
  //   },
  //   {
  //     id: '2',
  //     name: 'Rebecca P. Nichols',
  //     location: 'Selangor, Malaysia',
  //     type: 'Physical',
  //     subject: 'Chemistary',
  //     day: 'Sunday',
  //     time: '06:00 PM',
  //   },
  //   {
  //     id: '3',
  //     name: 'Rebecca P. Nichols',
  //     location: 'Selangor, Malaysia',
  //     type: 'Physical',
  //     subject: 'Physic',
  //     day: 'Sunday',
  //     time: '06:00 PM',
  //   },
  // ];

  const renderUpcommingItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        borderRadius: 12,
        borderColor:Theme.lineColor,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 25,
        backgroundColor: Theme.white,
        marginEnd: 10,
        width: width - 55,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={[
            styles.textType1,
            {
              lineHeight: 22,
              textTransform: 'capitalize',
              fontSize: 20,
              fontFamily: 'Circular Std Bold',
            },
          ]}>
          {item?.studentName}
        </Text>
        <View style={{  borderRadius: 50,
                    backgroundColor: item?.mode == 'online'?  Theme.lightBlue : Theme.lightGreen,}}>

          <Text
            style={[
              styles.textType3,
              {
                paddingVertical: 5,
                width: 90,
                borderRadius: 50,
                // marginLeft: 20,
                textAlign: 'center',
                textTransform: 'capitalize',
                color: item?.mode == 'online'? Theme.darkGray : '#1FC07D',
                
              },
            ]}>
            {item?.mode}
          </Text>
        </View>
      </View>

          <View
            style={{
              flexDirection: 'row', gap: 5, alignItems: 'center',
            }}>
            {item?.mode?.toLowerCase() == 'physical' &&
            <>
            <Feather name="map-pin" size={18} color={'#003E9C'} />
            <Text style={[styles.textType3, { color: '#003E9C',fontFamily: 'Circular Std Medium' }]}>
              {item?.city}
            </Text>
            </>
            }
          </View>
      {/* <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
        <Feather name="map-pin" size={18} color={'#003E9C'} />
        <Text
          style={[
            styles.textType3,
            {
              color: '#003E9C',
              textTransform: 'capitalize',
              fontFamily: 'Circular Std Book',
            },
          ]}>
          Selangor, Malaysia
        </Text>
      </View> */}
      <View
        style={{
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: Theme.LightPattensBlue,
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
            }}>
            <AntDesign name="copy1" size={20} color={Theme.darkGray} />
            <Text
              style={[
                styles.textType3,
                {
                  fontFamily: 'Circular Std Book',
                  color: Theme.IronsideGrey,
                  fontSize: 17,
                },
              ]}>
              Subject
            </Text>
          </View>
          <Text
            style={[
              styles.textType1,
              {
                fontSize: 18,
                textTransform: 'capitalize',
                fontFamily: 'Circular Std Medium',
              },
            ]}>
            {item.subject_name}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
        <View
          style={{
            backgroundColor: Theme.PattensBlue,
            paddingVertical: 10,
            borderRadius: 10,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
              paddingHorizontal: 10,
            }}>
            <AntDesign name="calendar" size={20} color={Theme.darkGray} />
            <Text
              style={[
                styles.textType3,
                {
                  color: Theme.darkGray,
                  textTransform: 'capitalize',
                  fontFamily: 'Circular Std Book',
                },
              ]}>
              {item?.day}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Theme.PattensBlue,
            paddingVertical: 10,
            borderRadius: 10,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
            }}>
            <AntDesign name="clockcircleo" size={20} color={Theme.darkGray} />
            <Text
              style={[
                styles.textType3,
                {
                  color: Theme.darkGray,
                  textTransform: 'uppercase',
                  fontFamily: 'Circular Std Book',
                },
              ]}>
              {item?.startTime}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const index = Math.floor(contentOffset.x / layoutMeasurement.width);
    setCurrentIndexJT(index);
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {upCommingClassesdata.map((_: any, index: number) => (
          // <Animated.View
          //   key={index}
          //   style={[
          //     styles.indicator,
          //     currentIndexJT === index ? styles.activeIndicator : null,
          //   ]}
          // />
          < View
            key={index}
            style={[
              styles.indicator,
              currentIndexJT === index ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (currentIndexJT + 1) % upCommingClassesdata.length;
      setCurrentIndexJT(nextIndex);
      flatListRefJT.current?.scrollToIndex({ animated: true, index: nextIndex });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndexJT]);
  return (
    <View style={styles.container}>
      <FlatList
        // ref={flatListRefJT}
        data={upCommingClassesdata}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderUpcommingItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        // onScroll={handleScroll}
        // pagingEnabled
      />
      {/* {renderPagination()} */}
    </View>
  )
}

export default UpCommingCarousel

const styles = StyleSheet.create({
  textType1: {
    fontWeight: '500',
    fontSize: 24,
    color: Theme.Dune,
    fontFamily: 'Circular Std Medium',
    lineHeight: 24,
    fontStyle: 'normal',
  },
  textType3: {
    color: Theme.Dune,
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
  },
  textType2: {
    color: Theme.Dune,
    textAlign: 'center',
    fontFamily: 'Circular Std Medium',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
  },
  jobTicketImg: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  container: {
    flex: 1,
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: Theme.LightPattensBlue, // Inactive indicator color
  },
  activeIndicator: {
    backgroundColor: Theme.darkGray, // Active indicator color
    width: 30,
    height: 8,
    borderRadius: 10,
    gap: 15,
  }
})