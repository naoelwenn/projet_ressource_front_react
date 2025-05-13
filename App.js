import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StyleSheet, Text, View, FlatList, Image, useWindowDimensions} from 'react-native';
import {useEffect, useState} from 'react';
import { TextInput} from 'react-native-web';
import HomeScreen from './component/HomeSreen';
import DetailScreen from './component/DetailSreen';
import EditScreen from './component/EditScreen';
import LoginScreen from './component/LoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer styles={styles.container}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="Ressources" component={HomeScreen}/>
        <Stack.Screen name="Ma ressource" component={DetailScreen} />
        <Stack.Screen name="Edition" component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    paddingTop: 20,
  },
});