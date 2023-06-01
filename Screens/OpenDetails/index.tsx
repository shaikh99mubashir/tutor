import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';

const OpenDetails = ({route, navigation}: any) => {
  const data = route.params;

  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title={data.code} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15}}>
          <Text
            style={{
              color: 'green',
              fontSize: 15,
              fontWeight: '500',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: '#eee',
            }}>
            jkfs fsdjk fsd f dsfj ksdf sdf jdf
          </Text>
          <View>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
                marginTop: 10,
              }}>
              Details
            </Text>
            <Text style={{color: Theme.gray, fontSize: 15, fontWeight: '600'}}>
              {data.details}
            </Text>
          </View>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 15,
              fontWeight: '600',
              marginTop: 10,
            }}>
            {data.details2}
          </Text>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 15,
              fontWeight: '600',
              marginTop: 10,
            }}>
            {data.details3}
          </Text>
          <Text style={{color: Theme.gray, fontSize: 15, fontWeight: '600'}}>
            {data.details4}
          </Text>
          <Text style={{color: Theme.gray, fontSize: 15, fontWeight: '600'}}>
            {data.details5}
          </Text>
          <View style={{marginVertical: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Estimated Commission
            </Text>
            <Text
              style={{
                color: 'green',
                fontSize: 17,
                fontWeight: '600',
                marginTop:5
              }}>
              RM {data.RS}/subject
            </Text>
          </View>
          <View style={{marginVertical: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Available Subjects
            </Text>
            <Text
              style={{
                color: 'green',
                fontSize: 15,
                fontWeight: '600',
                marginTop:5
              }}>
              RM {data.title}/subject
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OpenDetails;

const styles = StyleSheet.create({});
