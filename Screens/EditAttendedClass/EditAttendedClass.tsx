import React, { useState } from 'react';
import {
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Theme } from '../../constant/theme';
import CustomHeader from '../../Component/Header';
import DocumentPicker from 'react-native-document-picker';
import AntDesign from 'react-native-vector-icons/EvilIcons';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';

function EditAttendedClass({ navigation, route }: any) {
  let data = route.params?.data;

  const [cancelledReason, setCancelledReason] = useState('');
  const [file, setFile] = useState<any>({});

  const changeStatus = () => {

    axios.get(`${Base_Uri}attendedClassStatus/${data?.class_schedule_id}/attended`).then(({ data }) => {

      ToastAndroid.show(data?.SuccessMessage, ToastAndroid.SHORT)

    }).catch((error) => {
      ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT)
    })

  };


  const FilePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('Se     lected file:', res);
      setFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file selection');
      } else {
        console.log('Error while picking the file:', err);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{ flex: 1, backgroundColor: Theme.white }}>
      <View>
        <CustomHeader title="Edit Class" backBtn />
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ color: Theme.black, fontSize: 18, fontWeight: '600' }}>
            Student
          </Text>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 16,
              fontWeight: '500',
              marginTop: 5,
            }}>
            {data?.studentName}
          </Text>
          <Text
            style={{
              color: Theme.black,
              fontSize: 18,
              fontWeight: '600',
              marginTop: 20,
            }}>
            Subject
          </Text>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 16,
              fontWeight: '500',
              marginTop: 5,
            }}>
            {data?.subjectName}
          </Text>

          <Text
            style={{
              color: Theme.black,
              fontSize: 18,
              fontWeight: '600',
              marginTop: 20,
            }}>
            Class
          </Text>
          <View
            style={{
              backgroundColor: Theme.lightGray,
              padding: 20,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{ color: Theme.gray, fontSize: 16, fontWeight: '500' }}>
                Date
              </Text>

              <Text
                style={{ color: Theme.black, fontSize: 14, fontWeight: '500' }}>
                {(data?.date).toString()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{ color: Theme.gray, fontSize: 16, fontWeight: '500' }}>
                Start Time
              </Text>

              <Text
                style={{ color: Theme.black, fontSize: 14, fontWeight: '500' }}>
                {(data?.startTime).toString()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{ color: Theme.gray, fontSize: 16, fontWeight: '500' }}>
                End Time
              </Text>

              <Text
                style={{ color: Theme.black, fontSize: 14, fontWeight: '500' }}>
                {(data?.endTime).toString()}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: Theme.black,
              fontSize: 18,
              fontWeight: '600',
              marginTop: 20,
            }}>
            Status
          </Text>
          <View
            style={{
              backgroundColor: Theme.lightGray,
              padding: 20,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{ color: Theme.black, fontSize: 16, fontWeight: '500' }}>
                {route?.params?.schedule
                  ? 'Scheduled'
                  : route?.params?.postpond
                    ? 'Postponed'
                    : route?.params?.cancelled
                      ? 'Cancelled'
                      : 'Attended'}
              </Text>

              <AntDesign name="chevron-down" color={Theme.black} size={30} />
            </View>
          </View>

          <View>
            <Text
              style={{
                color: Theme.black,
                fontSize: 16,
                fontWeight: '600',
                marginTop: 5,
              }}>
              Attachment
            </Text>

            <TouchableOpacity
              onPress={FilePicker}
              style={{
                padding: 20,
                backgroundColor: Theme.lightGray,
                borderRadius: 5,
                marginTop: 5,
              }}>
              <Text style={{ fontSize: 14, color: Theme.gray }}>
                {file.name ?? 'Select File'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => changeStatus()}
          style={{
            backgroundColor: Theme.darkGray,
            padding: 15,
            borderRadius: 10,
            width: '95%',
          }}>
          <Text style={{ textAlign: 'center', fontSize: 16, color: Theme.white }}>
            Confirm Class
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default EditAttendedClass;
