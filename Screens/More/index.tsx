import React from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import Header from '../../Component/Header';
import {Theme} from '../../constant/theme';

function More({navigation}: any) {
  return (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="More" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{paddingHorizontal: 15}}>
            {/* Profile */}
          <TouchableOpacity
          onPress={()=> navigation.navigate('Profile')}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
              }}>
              <Image
                source={require('../../Assets/Images/avatar.png')}
                style={{height: 60, width: 60}}
              />
              <View>
                <Text
                  style={{fontSize: 18, fontWeight: '600', color: Theme.black}}>
                  Muhammad
                </Text>
                <Text
                  style={{fontSize: 14, fontWeight: '300', color: Theme.gray}}>
                  Muhammad@gmail.com
                </Text>
              </View>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* notification */}
          <TouchableOpacity
          onPress={()=>navigation.navigate('Notifications')}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#f88222',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/notification.png')}
                  style={{height: 25, width: 25}}
                />
              </View>
              <Text
                style={{fontSize: 18, fontWeight: '600', color: Theme.black}}>
                Notification
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Students */}
          <TouchableOpacity
          onPress={()=> navigation.navigate('Students')}
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'pink',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/student2.png')}
                  style={{height: 25, width: 25}}
                />
              </View>
              <Text
                style={{fontSize: 18, fontWeight: '600', color: Theme.black}}>
                Students
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Payment History */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'lightgreen',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/payment.png')}
                  style={{height: 25, width: 25}}
                />
              </View>
              <Text
                style={{fontSize: 18, fontWeight: '600', color: Theme.black}}>
                Payment
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/*Report Submission History */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'aqua',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/report.png')}
                  style={{height: 25, width: 25}}
                />
              </View>
              <Text
                style={{fontSize: 18, fontWeight: '600', color: Theme.black}}>
                Report Submission History
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/*Faq */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'gray',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/faq.png')}
                  style={{height: 25, width: 25}}
                />
              </View>
              <Text
                style={{fontSize: 18, fontWeight: '600', color: Theme.black}}>
                FAQs
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/*Logout */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'red',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/logout.png')}
                  style={{height: 25, width: 25}}
                />
              </View>
              <Text
                style={{fontSize: 18, fontWeight: '600', color: Theme.black}}>
                Log Out
              </Text>
            </View>
            <Image
              source={require('../../Assets/Images/right.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default More;
