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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DropDownModalView = ({
  navigation,
  title,
  selectedValue,
  option,
  value,
  placeHolder,
  modalHeading,
  subTitle,
  style,
}: any) => {
  const [serviceDD, setServiceDD] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleReportTypeChange = (value: any) => {
    setServiceDD(!serviceDD);
    setModalVisible(true);
  };

  const setReportTypeChange = (value: any) => {
    selectedValue(value);
    setReportType(value?.option);
    setModalVisible(false);
    setServiceDD(!serviceDD);
  };

  const getModalValue = () => {
    setModalVisible(false);
  };

  return (
    <>
      {/* Report Type */}

      <View style={{marginTop: 8}}>
        {title && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black',
              fontFamily: 'Circular Std Medium',
            }}>
            {title}
          </Text>
        )}
        {subTitle && (
          <Text
            style={{
              color: Theme.gray,
              fontFamily: 'Circular Std Medium',
              fontSize: 14,
            }}>
            {subTitle}
          </Text>
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleReportTypeChange}
          style={{
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius:15,
            // borderTopLeftRadius: 5,
            // borderTopRightRadius: 5,
            // borderBottomLeftRadius: 5,
            // borderBottomRightRadius: 5,
            backgroundColor:Theme.liteBlue,
            alignItems: 'center',
            ...style,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Circular Std Book',
                fontSize: 16,
                textTransform:'capitalize'
              }}>
              {value
                ? value
                : reportType
                ? reportType
                : placeHolder && placeHolder}
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

      <Modal
        onRequestClose={() => setModalVisible(false)}
        visible={modalVisible}
        animationType="slide"
        transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: Theme.liteBlue,
              padding: 20,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              position: 'absolute',
              bottom: 0,
              height: '40%',
              width: '100%',
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: Theme.liteBlue,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}
                onPress={() => getModalValue()}>
                {/* <Text >X</Text> */}
                <AntDesign name="closecircleo" size={20} color={'black'} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  // fontWeight: 'bold',
                  color: 'black',
                  fontFamily: 'Circular Std Medium',
                  marginBottom: 15,
                }}>
                {modalHeading}
              </Text>
              {option &&
                option.map((e: any, i: number) => {
                  return (
                    <>
                    <View  style={{
                          paddingTop:10
                        }}></View>
                      <TouchableOpacity
                        key={i}
                        onPress={() => setReportTypeChange(e)}
                        style={{
                          marginVertical: 5,
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '100%',
                          gap:10
                        }}>
                          {['Pending', 'Approved', 'Rejected','Dispute','InComplete','Attended'].includes(e.option) && (
                        <Text>
                          <FontAwesome
                            name="dot-circle-o"
                            size={22}
                            color={(() => {
                              switch (e.option) {
                                case 'Pending':
                                  return '#FEBC2A';
                                case 'Dispute':
                                  return 'orange';
                                case 'Attended':
                                  return '#1FC07D';
                                case 'InComplete':
                                  return '#FF0000';
                                case 'Approved':
                                  return '#1FC07D';
                                case    'Rejected':
                                  return '#FF0000';
                                default:
                                  return '#298CFF33';
                              }
                            })()}
                          />
                        </Text>
                          )}
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'black',
                            fontFamily: 'Circular Std Medium',
                            textTransform:'capitalize'
                          }}>
                          {e.option}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: '#eee',
                          paddingBottom:10
                        }}></View>
                    </>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DropDownModalView;

const styles = StyleSheet.create({});
