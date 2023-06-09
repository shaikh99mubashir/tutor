import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';
import { Base_Uri } from '../../constant/BaseUri';
import axios from "axios"
import { Callout } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobTicket from '../JobTicket';


const Filter = ({ navigation }: any) => {

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedMode, setSelectedMode] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')



  const [categoryData, setCategory] = useState([
    {
      id: 1,
      complain_name: 'asass',
    },
    {
      id: 2,
      complain_name: 'ass',
    },
    {
      id: 3,
      complain_name: 'asadshfss',
    },
    {
      id: 3,
      complain_name: 'asadshfdsss',
    },
  ]);
  const [subject, setSubject] = useState([
    {
      id: 1,
      subject: 'noD',
    },
    {
      id: 2,
      subject: 'physic',
    },
    {
      id: 3,
      subject: 'science',
    },
    {
      id: 3,
      subject: 'history',
    },
  ])
  const [classMode, setClassMode] = useState([
    {
      id: 1,
      subject: 'Physical',
    },
    {
      id: 2,
      subject: 'Online',
    },

  ]);

  const [State, setState] = useState([
    {
      id: 1,
      subject: 'sindh',
    },
    {
      id: 2,
      subject: 'punjab',
    },
    {
      id: 3,
      subject: 'Kpk',
    },
    {
      id: 3,
      subject: 'Baluchistan',
    },
  ]);

  const [city, setCity] = useState([
    {
      id: 1,
      subject: 'Karachi',
    },
    {
      id: 2,
      subject: 'Lahore',
    },
    {
      id: 3,
      subject: 'Peshawer',
    },
    {
      id: 3,
      subject: 'City',
    },
  ]);



  const getCategories = () => {



    axios.get(`${Base_Uri}getCategories`).then(({ data }) => {


      let { categories } = data

      let myCategories = categories && categories.length > 0 && categories.map((e: any, i: Number) => {
        if (e.category_name) {
          return {
            subject: e.category_name,
            id: e.id
          }
        }
      })

      setCategory(myCategories)



    }).catch((error) => {

      console.log(error)

    })

  }


  const getSubject = () => {

    axios.get(`${Base_Uri}getSubjects`).then(({ data }) => {



      let { subjects } = data

      let mySubject = subjects && subjects.length > 0 && subjects.map((e: any, i: Number) => {
        if (e.name) {
          return {
            subject: e.name,
            id: e.id
          }
        }
      })

      setSubject(mySubject)


    }).catch((error) => {

      console.log(error)

    })
  }


  const getStates = () => {

    axios.get(`${Base_Uri}getStates`).then(({ data }) => {



      let { states } = data

      let myStates = states && states.length > 0 && states.map((e: any, i: Number) => {
        if (e.name) {
          return {
            subject: e.name,
            id: e.id
          }
        }
      })

      setState(myStates)


    }).catch((error) => {

      console.log(error)

    })


  }


  const getCities = () => {


    axios.get(`${Base_Uri}getCities`).then(({ data }) => {



      let { cities } = data


      let myCities = cities && cities.length > 0 && cities.map((e: any, i: Number) => {
        if (e.name) {
          return {
            subject: e.name,
            id: e.id
          }
        }
      })
      setCity(myCities)

    }).catch((error) => {

      console.log(error)

    })



  }

  useEffect(() => {

    getCategories()
    getSubject()
    getStates()
    getCities()

  }, [])


  const applyFilter = async () => {

    let jobFilter = {
      Category: selectedCategory,
      subject: selectedSubject,
      mode: selectedMode,
      state: selectedState,
      city: selectedCity
    }

    let myFilter = JSON.stringify(jobFilter)
    await AsyncStorage.setItem('filter', myFilter)
    ToastAndroid.show('your data has been successfully filtered', ToastAndroid.SHORT)

  }

  const resetFilter = async () => {
    await AsyncStorage.removeItem('filter').then((res) => {
      ToastAndroid.show('Filtered has been Successfully reset', ToastAndroid.SHORT)
    }).catch((error) => {
      ToastAndroid.show('Filter reset unsuccessfull', ToastAndroid.SHORT)
    })

  }

  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Filter" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          <CustomDropDown
            setSelectedSubject={setSelectedCategory}
            selectedSubject={selectedCategory}
            ddTitle="Category" headingStyle={{ color: Theme.black, fontWeight: "700" }} dropdownPlace={"Select Category"} dropdownContainerStyle={{ paddingVertical: 15, backgroundColor: Theme.lightGray }} subject={categoryData} categoryShow={"complain_name"} />
          <CustomDropDown
            setSelectedSubject={setSelectedSubject}
            selectedSubject={selectedSubject}
            ddTitle="Subject" headingStyle={{ color: Theme.black, fontWeight: "700" }} dropdownPlace={"Select Subject"} dropdownContainerStyle={{ paddingVertical: 15, backgroundColor: Theme.lightGray }} subject={subject} categoryShow={"subject"} />
          <CustomDropDown
            setSelectedSubject={setSelectedMode}
            selectedSubject={selectedMode}
            ddTitle="Mode" headingStyle={{ color: Theme.black, fontWeight: "700" }} dropdownPlace={"Select Mode"} dropdownContainerStyle={{ paddingVertical: 15, backgroundColor: Theme.lightGray }} subject={classMode} categoryShow={"subject"} />
          <CustomDropDown setSelectedSubject={setSelectedState}
            selectedSubject={selectedState} ddTitle="State" headingStyle={{ color: Theme.black, fontWeight: "700" }} dropdownPlace={"Select State"} dropdownContainerStyle={{ paddingVertical: 15, backgroundColor: Theme.lightGray }} subject={State} categoryShow={"subject"} />
          <CustomDropDown ddTitle="City"
            setSelectedSubject={setSelectedCity}
            selectedSubject={selectedCity}
            headingStyle={{ color: Theme.black, fontWeight: "700" }} dropdownPlace={"Select City"} dropdownContainerStyle={{ paddingVertical: 15, backgroundColor: Theme.lightGray }} subject={city} categoryShow={"subject"} />
        </View>
      </ScrollView>
      <View style={{ width: "100%", alignItems: "center" }} >
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            justifyContent: "center",
            gap: 10,
            marginTop: 20,
            position: "absolute",
            bottom: 40
          }}>
          <TouchableOpacity
            style={{
              width: '48%',
              alignItems: 'center',
              backgroundColor: Theme.darkGray,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => applyFilter()}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
              Apply
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '48%',
              alignItems: 'center',
              backgroundColor: Theme.gray,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => resetFilter()}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({});
