
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppNavigation from './Navigation/appNavigation';
import Timer from './Component/Timer/timer';
import NoteState from './context/noteState';
import NoteContext from './context/noteContext';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


function App() {

  const [classInProcess,setClassInProcess] = useState({})

const getClassInProcess = async () => {

   let data : any = await AsyncStorage.getItem("classInProcess")

   data = JSON.parse(data)
   setClassInProcess(data)

}

useEffect(()=>{

  getClassInProcess()

},[])


  return (
    <View style={styles.container} >

      <NoteState>
      <AppNavigation/>
        {Object.keys(classInProcess).length>0 && <Timer/>}
      </NoteState>
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
  }
});

export default App;
