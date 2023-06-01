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
      subject: 'math',
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
  ]);
  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Filter" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15}}>
          <CustomDropDown ddTitle="Category" categoryData={categoryData} />
          <CustomDropDown ddTitle="Subject" subject={subject} />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              gap: 10,
              marginTop: 20,
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
      </ScrollView>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({});
