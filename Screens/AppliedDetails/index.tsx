import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';

const AppliedDetails = ({route, navigation}: any) => {
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
         
          <Text style={{color: Theme.gray, fontSize: 15, fontWeight: '600', marginTop:10}}>
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
                marginTop: 5,
              }}>
              RM {data.RS}/subject
            </Text>
          </View>
          {/* Avaiable Subject */}
          <View style={{marginVertical: 15}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Available Subjects
            </Text>
            <View
              style={{
                backgroundColor: Theme.lightGray,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 10,
                marginVertical: 5,
              }}>
                <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>

                
              <Text
                style={{
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '600',
                    marginTop: 5,
                    width:'70%'
                }}>
                {data.title}
              </Text>
              <Text
                      style={{
                        color: 'green',
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginTop: 0,
                        backgroundColor:'lightgreen',
                        padding:3,width:'25%',
                        height:30,
                        textAlign:'center',
                        borderRadius:10,
                        opacity:0.6,
                        
                    }}>
                      Approved
                    </Text>
              </View>
              <Text
                style={{
                    color: Theme.gray,
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 5,
                }}>
                {data.title}
              </Text>
                    
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AppliedDetails;

const styles = StyleSheet.create({});
