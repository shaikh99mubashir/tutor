
import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppNavigation from './Navigation/appNavigation';
import Timer from './Component/Timer/timer';
import NoteState from './context/noteState';
import NoteContext from './context/noteContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import noteContext from './context/noteContext';


function App() {


  return (
    <View style={styles.container} >

      <NoteState>
        <AppNavigation />
        <Timer show="false" />
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
