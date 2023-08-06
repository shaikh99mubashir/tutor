
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
import TutorDetailsState from './context/tutorDetailsState';
import StudentState from './context/studentState';
import FilterState from './context/filterState';
import UpcomingClassState from './context/upcomingClassState';


function App() {


  return (
    <View style={styles.container} >

      <NoteState>
        <UpcomingClassState>
          <TutorDetailsState>
            <StudentState>
              <FilterState>
                <AppNavigation />
                <Timer show="false" />
              </FilterState>
            </StudentState>
          </TutorDetailsState>
        </UpcomingClassState>
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
