
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppNavigation from './Navigation/appNavigation';



function App() {

  return (
    <View style={styles.container} >
        
      <AppNavigation/>

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
