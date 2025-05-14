// component/Header.js
import React, {useEffect, useState, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../Styles/globalStyles';
import { UserContext } from '../Context/UserContext';

const Header = ({ user }) => {
  const {userPseudo, setUserPseudo} = useContext(UserContext);
  const navigation = useNavigation();
  
  //-- récupère le nom de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const pseudo = await AsyncStorage.getItem('userPseudo');
        if (pseudo){
          setUserPseudo(pseudo);
        }
      } catch (err) {
        console.error('Erreur chargement user:', err);
      }
    };
    fetchUser();
  }, []);

  //-- déconnexion
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userPseudo');
    await AsyncStorage.removeItem('userId');
    setUserPseudo('');
    navigation.replace('Ressources');
  }

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Ressources relationnelles</Text>
      <View style={styles.buttonGroup}>

      {/* SI l'utilisateur est connecté : nom de l'utilisateur + btn déconnexion*/}
      {/* SI l'utilisateur n'est pas connecté : connexion + inscription*/}
      {userPseudo ? (
          <>
            <Text style={styles.userText}>Bonjour, {userPseudo}</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.link}>Déconnexion</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Inscription</Text>
            </TouchableOpacity>
          </>
        )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  userText: { color: '#fff', fontSize: 16 },
  link: { color: '#fff', marginHorizontal: 10 },
  buttonGroup: { flexDirection: 'row' }
});

export default Header;
