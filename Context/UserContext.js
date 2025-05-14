// context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [userPseudo, setUserPseudo] = useState('');

  const loadUserPseudo = async() => {
    try {
      const pseudo = await AsyncStorage.getItem('userPseudo');
      setUserPseudo(pseudo ? pseudo : "");
    } catch (err) {
      console.error('Erreur chargement user pseudo :', err);
    }
  };

  useEffect(()=>{
    loadUserPseudo();
  }, []);

  return (
    <UserContext.Provider value={{ userPseudo, setUserPseudo, loadUserPseudo }}>
      {children}
    </UserContext.Provider>
  );
};
