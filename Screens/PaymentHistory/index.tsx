import {View, Text, FlatList, StyleSheet,Dimensions,Image} from 'react-native';
import React from 'react';
import Header from '../../Component/Header';
const height = Dimensions.get('screen').height;
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Theme } from '../../constant/theme';
const PaymentHistory = ({navigation}: any) => {
  const commissionData = [
    {
      id: 1,
      tutorID: 2,
      classAttendedID: null,
      paymentDate: '2023-07-10 00:00:00',
      comissionMonth: 'June',
      comissionYear: '2023',
      payAmount: 151,
      payingAccount: 'Cash At Bank - Maybank',
      deduction: 0,
      addition: 0,
      remark: 'testing remarks at 10-07-2023',
    },
    {
      id: 2,
      tutorID: 2,
      classAttendedID: null,
      paymentDate: '2023-07-10 00:00:00',
      comissionMonth: 'June',
      comissionYear: '2023',
      payAmount: 151,
      payingAccount: 'Cash At Bank - Maybank',
      deduction: 0,
      addition: 0,
      remark: 'testing remarks at 10-07-2023',
    },
    {
      id: 3,
      tutorID: 2,
      classAttendedID: null,
      paymentDate: '2023-07-10 00:00:00',
      comissionMonth: 'June',
      comissionYear: '2023',
      payAmount: 151,
      payingAccount: 'Cash At Bank - Maybank',
      deduction: 0,
      addition: 0,
      remark: 'testing remarks at 10-07-2023',
    },
    {
      id: 4,
      tutorID: 2,
      classAttendedID: null,
      paymentDate: '2023-07-10 00:00:00',
      comissionMonth: 'June',
      comissionYear: '2023',
      payAmount: 151,
      payingAccount: 'Cash At Bank - Maybank',
      deduction: 0,
      addition: 0,
      remark: 'testing remarks at 10-07-2023',
    },
    {
      id: 5,
      tutorID: 2,
      classAttendedID: null,
      paymentDate: '2023-07-10 00:00:00',
      comissionMonth: 'June',
      comissionYear: '2023',
      payAmount: 151,
      payingAccount: 'Cash At Bank - Maybank',
      deduction: 0,
      addition: 0,
      remark: 'testing remarks at 10-07-2023',
    },
  ];

  const renderItem = ({item}: any) => (
    <View style={styles.itemContainer}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: 'blue', fontWeight: '600'}}>
          {item.comissionMonth} {item.comissionYear}
        </Text>
        <Text style={{color: 'black', fontWeight: '600'}}>
          {item.paymentDate}
        </Text>
      </View>
      <Text style={{marginTop: 5, color: 'black', fontWeight: '600'}}>
        Payment Amount : {item.payAmount}
      </Text>
      <Text style={{marginTop: 5, color: 'black', fontWeight: '600'}}>
        Paying Account : {item.payingAccount}
      </Text>
      <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text style={{color: 'black', fontWeight: '600'}}>
          Deduction: {item.deduction} |{' '}
        </Text>
        <Text style={{color: 'black', fontWeight: '600'}}>
          Addition: {item.addition}
        </Text>
      </View>
      <Text style={{marginTop: 5, color: 'black', fontWeight: '600'}}>
        Remarks: {item.remark}
      </Text>
    </View>
  );
  return (
    <View style={{flex:1,backgroundColor:'white'}}>
      <Header title="Payment History" navigation={navigation} backBtn />
      {commissionData && commissionData.length > 0 ? (
      <View style={{paddingBottom:80}}>
        <FlatList
          data={commissionData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
       ) : (
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            justifyContent: 'center',
            alignItems: 'center',
            height: height / 1.5,
          }}>
          <Image
                  source={require('../../Assets/Images/payment.png')}
                  style={{ height: 25, width: 25 }}
                />
          <Text style={{ color: Theme.gray }}>  Payment History Not Found</Text>
          </View>
        )}
    </View>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 5,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation:2
  },
});
