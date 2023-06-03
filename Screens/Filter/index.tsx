import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';

const Filter = ({navigation}: any) => {
  const [categoryData, setCategory] = useState([
    {
      id: 1,
      complain_name: 'asass',
    },
    {
      id: 2,
      complain_name: 'ass',
    },
    {
      id: 3,
      complain_name: 'asadshfss',
    },
    {
      id: 3,
      complain_name: 'asadshfdsss',
    },
  ]);
  const [subject, setSubject] = useState([
    {
      id: 1,
      subject: 'noD',
    },
    {
      id: 2,
      subject: 'physic',
    },
    {
      id: 3,
      subject: 'science',
    },
    {
      id: 3,
      subject: 'history',
    },
  ])
  const [classMode, setClassMode] = useState([
    {
      id: 1,
      subject: 'Mode A',
    },
    {
      id: 2,
      subject: 'Mode B',
    },
    {
      id: 3,
      subject: 'Mode C',
    },
    {
      id: 3,
      subject: 'Mode D',
    },
  ]);

  const [State, setState] = useState([
    {
      id: 1,
      subject: 'sindh',
    },
    {
      id: 2,
      subject: 'punjab',
    },
    {
      id: 3,
      subject: 'Kpk',
    },
    {
      id: 3,
      subject: 'Baluchistan',
    },
  ]);

  const [city, setCity] = useState([
    {
      id: 1,
      subject: 'Karachi',
    },
    {
      id: 2,
      subject: 'Lahore',
    },
    {
      id: 3,
      subject: 'Peshawer',
    },
    {
      id: 3,
      subject: 'City',
    },
  ]);

  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Filter" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15}}>
          <CustomDropDown ddTitle="Category" headingStyle={{color:Theme.black,fontWeight:"700"}} dropdownPlace={"Select Category"} dropdownContainerStyle={{paddingVertical:15,backgroundColor:Theme.lightGray}}  subject={categoryData} categoryShow={"complain_name"} />
          <CustomDropDown ddTitle="Subject"  headingStyle={{color:Theme.black,fontWeight:"700"}} dropdownPlace={"Select Subject"} dropdownContainerStyle={{paddingVertical:15,backgroundColor:Theme.lightGray}} subject={subject} categoryShow={"subject"} />
          <CustomDropDown ddTitle="Mode"  headingStyle={{color:Theme.black,fontWeight:"700"}} dropdownPlace={"Select Mode"} dropdownContainerStyle={{paddingVertical:15,backgroundColor:Theme.lightGray}} subject={subject} categoryShow={"subject"} />
          <CustomDropDown ddTitle="State"  headingStyle={{color:Theme.black,fontWeight:"700"}} dropdownPlace={"Select State"} dropdownContainerStyle={{paddingVertical:15,backgroundColor:Theme.lightGray}} subject={subject} categoryShow={"subject"} />
          <CustomDropDown ddTitle="City"  headingStyle={{color:Theme.black,fontWeight:"700"}} dropdownPlace={"Select City"} dropdownContainerStyle={{paddingVertical:15,backgroundColor:Theme.lightGray}} subject={subject} categoryShow={"subject"} />
        </View>
      </ScrollView>
      <View style={{width:"100%",alignItems:"center"}} >
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              justifyContent:"center",
              gap: 10,
              marginTop: 20,
              position:"absolute",
              bottom:40
            }}>
            <TouchableOpacity
              style={{
                width: '48%',
                alignItems: 'center',
                backgroundColor: Theme.darkGray,
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{color: 'white', fontWeight: '700', fontSize: 15}}>
                Apply
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '48%',
                alignItems: 'center',
                backgroundColor: Theme.gray,
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{color: 'white', fontWeight: '700', fontSize: 15}}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
          </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({});
