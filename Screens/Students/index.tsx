import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';

const Students = ({navigation}: any) => {
  const [students, setstudents] = useState([
    {
      id: 1,
      image: require('../../Assets/Images/woman.png'),
      name: 'testing1',
      code: 'sdf544',
      title: 'Add Math (DEGREE) Online',
      time: '12:00 PM to 7:00 PM',
      date: '20 May 2023',
    },
    {
      id: 2,
      image: require('../../Assets/Images/woman.png'),
      name: 'testing2',
      code: 'sd52442',
      title: 'Add History (DEGREE) Online',
      time: '12:00 PM to 7:00 PM',
      date: '20 May 2023',
    },
  ]);
  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Student" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 10}}>
          {students && students.length > 0 ? (
            <FlatList
              data={students}
              nestedScrollEnabled
              renderItem={({item, index}: any) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      borderWidth: 1,
                      paddingHorizontal: 15,
                      marginTop: 10,
                      paddingVertical: 15,
                      borderRadius: 10,
                      gap: 10,
                      marginRight: 10,
                      borderColor: '#eee',
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 15,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../../Assets/Images/woman.png')}
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: 50,
                        }}
                      />
                      <View>
                        <Text style={{color: Theme.gray, fontSize: 16}}>
                          {item.code}
                        </Text>
                        <Text style={{color: Theme.black, fontSize: 14}}>
                          {item.name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View style={{marginTop: 35}}>
              <Text
                style={{color: Theme.black, fontSize: 14, textAlign: 'center'}}>
                No Student Found...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Students;

const styles = StyleSheet.create({});
