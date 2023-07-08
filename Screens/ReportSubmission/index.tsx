import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  TextInput,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import DropDownModalView from '../../Component/DropDownModalView';

const ReportSubmission = ({navigation}: any) => {
  const EvalutionOption = [
    {
      option: 'Hello World',
    },
    {
      option: 'Hello World2',
    },
  ];
  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Report Submission" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15, marginBottom: 100}}>
          {/* Report Type */}
          <DropDownModalView
            title="Report Type"
            placeHolder="Evaluation Report"
            option={EvalutionOption}
            modalHeading="Select Report Type"
          />
          {/* First Class Date */}
          <View style={{marginTop: 8}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>
              First Class Date
            </Text>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                borderColor: Theme.gray,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                }}>
                7 June 2023
              </Text>
            </View>
          </View>
          {/* Student */}
          <DropDownModalView
            title="Student"
            placeHolder="Mk Test Student"
            option={EvalutionOption}
            modalHeading="Student"
          />
          {/* Subject */}
          <DropDownModalView
            title="Subject"
            placeHolder="Select Subject"
            option={EvalutionOption}
            modalHeading="Subject"
          />
          {/* Knowledge */}
          <DropDownModalView
            title="1. Knowledge"
            subTitle="What can you tell us about the student's knowledge of this Subject"
            placeHolder="Select Answer"
            option={EvalutionOption}
            modalHeading="Knowledge"
          />
          {/* Understanding */}
          <DropDownModalView
            title="2. Understanding"
            subTitle="What can you tell us about the student's Understanding of this Subject"
            placeHolder="Select Answer"
            option={EvalutionOption}
            modalHeading="Understanding"
          />
          {/* Analysis */}
          <DropDownModalView
            title="3. Analysis"
            subTitle="What can you tell us about the student's ablity to apply analyse fact and theory of this Subject"
            placeHolder="Select Answer"
            option={EvalutionOption}
            modalHeading="Analysis"
          />

          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'black',
              marginTop: 8,
            }}>
            4. Additional Assessment
          </Text>
          <Text
            style={{
              color: Theme.gray,
              fontFamily: 'Poppins-SemiBold',
              fontSize: 16,
            }}>
            What is the current score for the subject?
          </Text>
          <View
            style={[
              styles.textAreaContainer,
              {
                width: '100%',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 5,
              },
            ]}>
            <TextInput
              placeholder="Message"
              multiline={true}
              maxLength={300}
              style={[
                styles.textArea,
                {
                  width: Dimensions.get('window').width,
                  padding: 8,
                },
              ]}
              underlineColorAndroid="transparent"
              placeholderTextColor="grey"
            />
          </View>
          <Text
            style={{
              color: Theme.gray,
              fontFamily: 'Poppins-SemiBold',
              fontSize: 16,
              marginTop:8
            }}>
            Elaborate your Plan to Help Student?
          </Text>
          <View
            style={[
              styles.textAreaContainer,
              {
                width: '100%',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 5,
              },
            ]}>
            <TextInput
              placeholder="Plan"
              multiline={true}
              maxLength={300}
              style={[
                styles.textArea,
                {
                  height: 80,
                  padding: 8,
                },
              ]}
              underlineColorAndroid="transparent"
              placeholderTextColor="grey"
            />
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
          elevation: 5,
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

export default ReportSubmission;

const styles = StyleSheet.create({
  textAreaContainer: {
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    height: 120,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
