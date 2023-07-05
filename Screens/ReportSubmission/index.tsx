import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';
import DropDownPicker from 'react-native-dropdown-picker';

const ReportSubmission = ({navigation}: any) => {
  const [selectedServicedata, setSelectedServicedata]: any = useState({});
  const [serviceDD, setServiceDD] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [student, setStudent] = useState(null);
  const [subject, setSubject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleReportTypeChange = (value: any) => {
     setServiceDD(!serviceDD);
    setModalVisible(true);
  };

  const setReportTypeChange = (value: any) => {
    setReportType(value);
    setModalVisible(false);
    setServiceDD(!serviceDD);
  };
  const handleStudentChange = (value: any) => {
    setStudent(value);
    setModalVisible(false);
  };

  const handleSubjectChange = (value: any) => {
    setSubject(value);
    setModalVisible(false);
  };
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
        <View style={{paddingHorizontal: 15}}>
            {/* Report Type */}
          <View style={{marginTop: 8}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>
              Report Type
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleReportTypeChange}
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      color: Theme.gray,
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 16,
                    }}>
                    {reportType ? reportType : 'Evaluation Report'}
                  </Text>
                  {serviceDD ? (
                    <Image
                      source={require('../../Assets/Images/up.png')}
                      style={{width: 15, height: 20}}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={require('../../Assets/Images/down.png')}
                      style={{width: 20, height: 20}}
                    />
                  )}
                </View>
            </TouchableOpacity>
          </View>
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
        </View>
      </ScrollView>
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderTopRightRadius:15,
                borderTopLeftRadius:15,
                position:'absolute',
                bottom:0,
                height:'40%',
                width:'100%'
              }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{textAlign:'right'}}>X</Text>
              </TouchableOpacity>
              <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black',marginBottom:15}}>Select Report Type</Text>
              {EvalutionOption && EvalutionOption.map((e:any,i)=>{
                return(
                    <TouchableOpacity key={i} onPress={()=> setReportTypeChange(e.option)} style={{marginVertical:5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>{e.option}</Text>
                    </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </Modal>
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

const styles = StyleSheet.create({});
