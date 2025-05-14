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
import RegisterScreen from './component/RegisterScreen';
import { UserProvider } from './Context/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer styles={styles.container}>
        <Stack.Navigator initialRouteName="Ressources">
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Ressources" component={HomeScreen}/>
          <Stack.Screen name="Ma ressource" component={DetailScreen} />
          <Stack.Screen name="Edition" component={EditScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    paddingTop: 20,
  },
});