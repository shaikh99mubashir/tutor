import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Theme } from '../../constant/theme';

const CustomDropDown2 = (props: any) => {
  let { ddTitle, categoryData, dataShow, searchData, searchFunc, subject, search, headingStyle, categoryShow, dropdownPlace, dropdownContainerStyle, setSelectedSubject, selectedSubject } = props




  const [selectedServicedata, setSelectedServicedata]: any = useState({});
  const [serviceDD, setServiceDD] = useState(false);
  const SelectedServices = (item: any) => {

    setSelectedSubject(item);

    setServiceDD(!serviceDD);
  };

  const filterSearchData = (text: string) => {

    if (text.length > 0) {
      searchFunc(text, search)
    }
  }


  return (
    <View>
      <View style={{ overflow: 'hidden', marginHorizontal: 0, marginVertical: 0, }}>
        {ddTitle &&
          <Text
            style={{
              fontFamily: 'Circular Std Medium',
              color: Theme.Dune,
              fontSize: 16,
              marginVertical: 5,
              textTransform: 'capitalize',
              marginHorizontal: 5,
              ...headingStyle

            }}>
            {ddTitle}
          </Text>
        }
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setServiceDD(!serviceDD)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 20,
            height: 60,
            borderWidth: serviceDD ? 2 : 0,
            backgroundColor: Theme.white,
            borderRadius: 15,
            borderColor: Theme.darkGray,
            alignItems: 'center',
            ...dropdownContainerStyle
          }}>
          {selectedServicedata &&
            Object.keys(selectedServicedata).length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text
                style={{
                  color: Theme.DustyGrey,
                  fontFamily: 'Circular Std Medium',
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                {selectedServicedata.complain_name &&
                  selectedServicedata.complain_name > 10
                  ? selectedServicedata.complain_name.slice(0, 10)
                  : selectedServicedata.complain_name}
              </Text>
              {serviceDD ? (
                <Image source={require('../../Assets/Images/up.png')} style={{ width: 20, height: 20 }} />
              ) : (
                <Image source={require('../../Assets/Images/down.png')} style={{ width: 20, height: 20 }} />
              )}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text
                style={{
                  color: Theme.DustyGrey,
                  fontFamily: 'Circular Std Book',
                  fontSize: 18,
                  textTransform: 'capitalize',
                }}>
                {selectedSubject ? selectedSubject?.subject : dropdownPlace ?? ddTitle}
              </Text>
              {serviceDD ? (
                <AntDesign name='up' size={20} color={'black'} />
              ) : (
                <AntDesign name='down' size={20} color={'black'} />
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
      {categoryData &&
        <View
          style={{
            borderBottomEndRadius: 5,
            borderBottomStartRadius: 5,
            borderWidth: !serviceDD ? 0 : 1,
            borderTopWidth: !serviceDD ? 0 : 1,
            borderColor: Theme.DustyGrey,
            top: -14,
          }}>
          <ScrollView style={{ maxHeight: 100 }} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
            {serviceDD == true &&
              Array.from(
                new Set(categoryData && categoryData.map((item: any) => item.complain_name)),
              ).map((e: any, i: number) => {

                return (
                  <TouchableOpacity
                    onPress={() =>
                      SelectedServices(
                        categoryData.find(
                          (item: any) => item.complain_name === e,
                        ),
                      )
                    }
                    key={i}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      marginVertical: 5,
                      gap: 10,
                    }}>
                    <Text
                      style={{
                        color: Theme.DustyGrey,
                        fontFamily: 'Circular Std Medium',
                        fontSize: 16,
                        textTransform: 'capitalize',
                      }}>
                      {e}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
      }
      {subject &&
        <View
          style={{
            borderRadius: 15,
            borderColor: Theme.DustyGrey,
            marginVertical: 5,
            backgroundColor: Theme.white,
            paddingVertical: !serviceDD ? 0 : 15,
            paddingHorizontal: 10,
            marginTop:15
          }}>
          <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

            {serviceDD == true &&
              <View>
                {search && <TextInput onChangeText={(e) => filterSearchData(e)} style={{
                  paddingHorizontal: 10,
                  marginVertical: 0,
                  color: 'black',
                  backgroundColor: Theme.white,
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgrey',
                  gap: 0,
                  height: 38,
                  fontFamily: 'Circular Std Medium',
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                }}
                  placeholder={"Search"}
                  placeholderTextColor={"black"}

                />}
                {searchData && searchData.length > 0 ? Array.from(
                  new Set(searchData && searchData.map((item: any) => item?.subject)),
                ).map((e: any, i: number) => {

                  return (
                    <TouchableOpacity
                      onPress={() =>
                        SelectedServices(
                          subject.find(
                            (item: any) => `${item?.subject}` === e,
                          ),
                        )
                      }
                      key={i}
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        marginVertical: 5,
                        gap: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: 'lightgrey'
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Circular Std Book',
                          fontSize: 18,
                          textTransform: 'capitalize'
                        }}>
                        {e ?? selectedSubject}
                      </Text>
                    </TouchableOpacity>
                  );

                }).filter(Boolean)
                  :
                  Array.from(
                    new Set(subject && subject.map((item: any) => item?.subject)),
                  ).map((e: any, i: number) => {
                    console.log('e', e);
                    const statusCount = subject.filter((item: any) => item?.subject === e).length;
                    if (i < 5) {
                      let backgroundColor;
                      if (e === 'Approved') {
                        backgroundColor = Theme.Primary;
                      } else if (e === 'Pending') {
                        backgroundColor = Theme.Yellow;
                      } else if (e === 'Rejected') {
                        backgroundColor = Theme.RedOrange;
                      } else {
                        backgroundColor = 'transparent';
                      }
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            SelectedServices(
                              subject.find(
                                (item: any) => `${item?.subject}` === e,
                              ),
                            )
                          }
                          key={i}
                          style={{
                            flexDirection: 'row',
                            marginHorizontal: 10,
                            marginVertical: 10,
                            gap: 10,
                            paddingBottom: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: 'lightgrey',
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}>
                          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <FontAwesome name='dot-circle-o' size={21} color={backgroundColor} />
                            <Text
                              style={{
                                color: Theme.Dune,
                                fontFamily: 'Circular Std Book',
                                fontSize: 18,
                                textTransform: 'capitalize'
                              }}>
                              {e ?? selectedSubject}
                            </Text>
                          </View>
                          {/* <Text
                            style={{
                              backgroundColor: Theme.PattensBlue,
                              width: 60,
                              textAlign: "center",
                              paddingVertical: 5,
                              borderRadius: 15,
                              color: Theme.Dune,
                              fontFamily: 'Circular Std Bold',
                              fontSize: 16,
                              textTransform: 'capitalize'
                            }}>
                            {statusCount}
                          </Text> */}

                        </TouchableOpacity>
                      );
                    }
                  }).filter(Boolean)
                }
              </View>
            }
          </ScrollView>
        </View>
      }
    </View>
  )
}

export default CustomDropDown2

const styles = StyleSheet.create({})