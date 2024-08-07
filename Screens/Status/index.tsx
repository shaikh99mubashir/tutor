import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import StudentContext from '../../context/studentContext';
import CustomLoader from '../../Component/CustomLoader';
import CustomButton from '../../Component/CustomButton';
import Toast from 'react-native-toast-message';

const Status = ({navigation, route}: any) => {
  let data = route.params;

  const context = useContext(StudentContext);

  let {students, updateStudent} = context;

  const status=
  [
    {
      subject: 'active',
    },
    {
      subject: 'inactive',
    },
  ]
  const reasonCategory = 
  [
    {
      subject: 'Boarding school student',
    },
    {
      subject: 'Ended calss due to exam UPSR, PT3 or SPM',
    },
    {
      subject: 'Discontinue',
    },
  ];

  interface ISelected {
    subject: string;
  }

  const [selectedStatus, setSelectedStatus] = useState<any>('');
  const [selectedReasonCategory, setSelectedReasonCategory] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const [editStatus, seteditStatus] = useState({
    reason: '',
  });

  const handleEditStatus = () => {
    if (!selectedStatus) {
      // ToastAndroid.show('Kindly select Status', ToastAndroid.SHORT);
      Toast.show({
        type: 'info',
        // text1: 'Request timeout:',
        text2:  `Kindly select Status`,
        position:'bottom'
      });
      return;
    }
    if (!editStatus.reason) {
      // ToastAndroid.show('Kindly Write Reason', ToastAndroid.SHORT);
      Toast.show({
        type: 'info',
        // text1: 'Request timeout:',
        text2:  `Kindly Write Reason`,
        position:'bottom'
      });
      return;
    }
    setLoading(true);
    let formData = new FormData();
    formData.append('studentID', data.studentID);
    formData.append('reasonCategory', selectedReasonCategory?.subject);
    formData.append('reasonStatus', editStatus.reason);
    formData.append('status', selectedStatus?.subject);

    console.log(formData, 'formData');

    axios
      .post(`${Base_Uri}api/editStatus`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        setLoading(false);
        // ToastAndroid.show(res?.data?.response, ToastAndroid.SHORT);
        Toast.show({
          type: 'info',
          // text1: 'Request timeout:',
          text2:  `${res?.data?.response}`,
          position:'bottom'
        });

        let updateData =
          students &&
          students.length > 0 &&
          students.map((e: any, i: number) => {
            if (e.studentID == data.studentID) {
              return {
                ...e,
                studentStatus: selectedStatus.subject,
              };
            } else {
              return e;
            }
          });

        console.log(updateData, 'updated');

        updateStudent(updateData);
        data.studentStatus = selectedStatus.subject;
        setSelectedStatus('');
        navigation.navigate('StudentsDetails', data);
      })
      .catch(error => {
        setLoading(false);
        console.log(error, 'error');
      });
  };

  return (
    <View style={{backgroundColor: Theme.GhostWhite, height: '100%'}}>
      <Header title="Status" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 25}}>
          <View style={{paddingVertical: 10}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 16,
                fontFamily: 'Circular Std Medium',
              }}>
              Student Name
            </Text>
            <View
              style={{
                backgroundColor: Theme.white,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 12,
                marginVertical: 5,
                height: 60
              }}>
              <Text
                style={{
                  color: Theme.black,
                  fontFamily: 'Circular Std Book',
                  fontSize: 16,
                  marginTop: 8,
                }}>
                {data?.studentName}
              </Text>
            </View>
           
          </View>

          <CustomDropDown
            setSelectedSubject={setSelectedStatus}
            selectedSubject={selectedStatus}
            ddTitle="Status"
            headingStyle={{color: Theme.black, marginHorizontal: 0,}}
            dropdownPlace={'Select Status'}
            dropdownContainerStyle={{
              // paddingVertical: 15,
              borderRadius: 12,
              backgroundColor: Theme.white,
            }}
            subject={status}
            categoryShow={'subject'}
          />
          <CustomDropDown
            setSelectedSubject={setSelectedReasonCategory}
            selectedSubject={selectedReasonCategory}
            ddTitle="Reason Category"
            headingStyle={{color: Theme.black, marginHorizontal: 0,}}
            dropdownPlace={'Select Status'}
            dropdownContainerStyle={{
              // paddingVertical: 15,
              backgroundColor: Theme.white,
              borderRadius:12
            }}
            ddTextStyle="none"
            subject={reasonCategory}
            categoryShow={'subject'}
          />

          {/* Comment */}
          <View style={{marginBottom: 30}}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 16,
                fontFamily: 'Circular Std Medium',
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
                onChangeText={e => seteditStatus({...editStatus, reason: e})}
                style={[
                  styles.textArea,
                  {
                    backgroundColor: Theme.white,
                    padding: 12,
                    color: Theme.black,
                    fontSize: 16,
                  },
                ]}
                underlineColorAndroid="transparent"
                placeholderTextColor="grey"
              />
            </View>
          </View>
          <CustomButton btnTitle='Submit'   onPress={handleEditStatus} />
          <View style={{marginBottom:20}}></View>
        </View>
      </ScrollView>
      {/* Submit Button */}
      {/* <View
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
            onPress={handleEditStatus}
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
      </View> */}
      <CustomLoader visible={loading} />
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
