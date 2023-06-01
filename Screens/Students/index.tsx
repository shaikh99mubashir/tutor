import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
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
      gender: 'male',
      ade: '51',
      studentName: 'testing',
      email: 'dsdds@sd.com',
      address: 'dsfdssd sds',
      contactno: 'as324324324',
      date: '20 May 2023',
    },
    {
      id: 2,
      image: require('../../Assets/Images/woman.png'),
      name: 'testing2',
      code: 'sd52442',
      gender: 'male',
      ade: '51',
      studentName: 'testing',
      email: 'dsdds@sd.com',
      address: 'dsfdssd sds',
      contactno: 'as324324324',
      date: '20 May 2023',
    },
  ]);

  const [foundName, setFoundName] = useState([]);
  const [searchText, setSearchText] = useState('');
  const searchStudent = (e: any) => {
    console.log(e, 'eee');
    setSearchText(e);
    let filteredItems: any = students.filter(x =>
      x.code.toLowerCase().includes(e.toLowerCase()),
    );
    setFoundName(filteredItems);
  };
  console.log('foundName===>', foundName);
  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Student" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15}}>
          {/* Search */}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: '100%',
                backgroundColor: Theme.lightGray,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 4,
                paddingHorizontal: 10,
                marginVertical: 15,
              }}>
              <TextInput
                placeholder="Search"
                placeholderTextColor="black"
                onChangeText={e => searchStudent(e)}
                style={{width: '90%', padding: 8, color: 'black'}}
              />
              <TouchableOpacity onPress={() => navigation}>
                <Image
                  source={require('../../Assets/Images/search.png')}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </View>
          </View>

          {students && students.length > 0 ? (
            <FlatList
              data={searchText && foundName.length > 0 ? foundName : students}
              nestedScrollEnabled
              renderItem={({item, index}: any) => {
                return (
                  <TouchableOpacity
                  onPress={()=> navigation.navigate('StudentsDetails',item)}
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
                      width: '100%',
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
