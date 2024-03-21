import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';


export default function App() {
  const [name, setName] = useState('Nothing');
  const [count, setCount] = useState(0); // not displayed in this example
  const [skipInitial, setSkipInitial] = useState(true);

  const dataFileName = 'datafile.json';

/**
 * This function will load a json string of all the saved data 
 * We assume that the file is good
 * We assume that all the required object parts are present
 */
  const loadState = async () => {
    try {
      // get the string
      const currentStateString = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + dataFileName
      );
      // convert it to an object
      currentState = JSON.parse(currentStateString)
      // extract all the saved states
      setName(currentState.name);
      setCount(currentState.count);
    } catch (e) {
      console.log(FileSystem.documentDirectory + dataFileName + e);
      // probably there wasn't a saved state, so make one for next time?
      saveState();
    }
  }

/**
 * This function will save the data as a json string 
 */
  const saveState = async () => {
    // build an object of everything we are saving
    const currentState = {"name": name, "count": count};
    try {
      // write the stringified object to the save file
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + dataFileName,
        JSON.stringify(currentState)
      );
   } catch (e) {
     console.log(FileSystem.documentDirectory + dataFileName + e);
   }
  }

  // load on app load, save on app unload
  useEffect(() => {
    loadState();
    return () =>{saveState}
  },[])


  return (
    <View style={styles.container}>
      <Text style={{fontSize: 24}}>What is your name? </Text>
      <TextInput
        style={{fontSize: 24}}
        onChangeText={setName}
        value={name}
        placeholder="useless placeholder"
        onEndEditing={saveState}
        onBlur={saveState}
      />
      {/* These buttons were for development purposes */}
      <Button title="Save State" onPress={saveState}/>
      <Button title="Load State" onPress={loadState}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
