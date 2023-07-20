import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';

const Status = ({ navigation }: any) => {
  const [editStatus, seteditStatus] = useState({
    reason: '',
  });
  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Status" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          <View style={{ paddingVertical: 10, }}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 14,
                fontWeight: '700',
              }}>
              Student Name
            </Text>
            <Text
              style={{
                color: Theme.gray,
                fontSize: 14,
                fontWeight: '600',
                marginTop: 5,
              }}>
              Testing
            </Text>
          </View>
          {/* Comment */}
          <View style={{ marginBottom: 100 }}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Reason
            </Text>
            <View
              style={[
                styles.textAreaContainer,
                {
                  // borderWidth: 1,
                  marginTop: 5,
                  borderRadius: 10,
                  marginHorizontal: 2,
                },
              ]}>
              <TextInput
                placeholder="Enter Your Reason"
                multiline={true}
                maxLength={300}
                onChangeText={e =>
                  seteditStatus({ ...editStatus, reason: e })
                }
                style={[
                  styles.textArea,
                  {
                    backgroundColor: Theme.lightGray,
                    padding: 12,
                    color: Theme.black
                  },
                ]}
                underlineColorAndroid="transparent"
                placeholderTextColor="grey"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Submit Button */}
      <View
        style={{
          backgroundColor: Theme.white,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: Theme.white,

            marginVertical: 20,
            width: '94%',
          }}>
          <TouchableOpacity
            // onPress={}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.darkGray,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  textAreaContainer: {
    // borderColor: COLORS.grey20,
    // borderWidth: 1,
    // padding: 5,
    borderRadius: 10,
  },
  textArea: {
    borderRadius: 10,
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
