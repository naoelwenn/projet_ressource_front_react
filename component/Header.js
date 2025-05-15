// component/Header.js
import React, {useEffect, useState, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView , useWindowDimensions, Platform, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../Styles/globalStyles';
import { UserContext } from '../Context/UserContext';

const Header = ({ user }) => {
  const {userPseudo, setUserPseudo} = useContext(UserContext);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 600; // seuil à adapter si besoin
  
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
    <View style={[globalStyles.header, isMobile && { flexDirection: 'row', alignItems: 'flex-end' }]}>

      {/* Titre Ressources relationnelles à gauche */}
      <Image
        source={require('../assets/ressourcesRelationnelles.png')}
        style={globalStyles.imageHeader}
      />

      {/* Boutons */}
      <View style={[globalStyles.headerButtonGroup, isMobile && { flexDirection: 'column', alignItems: 'flex-end' }]}>

        {/* SI l'utilisateur est connecté : nom de l'utilisateur + btn déconnexion*/}
        {/* SI l'utilisateur n'est pas connecté : connexion + inscription*/}
        {userPseudo ? (
          <>
          <Text style={globalStyles.headerLink}>Bonjour, {userPseudo} !</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Edition')}>
              <Text style={globalStyles.headerLink}>Créer une ressource</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
              <Text style={globalStyles.headerLink}>Déconnexion</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={globalStyles.headerLink}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={globalStyles.headerLink}>Inscription</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

    </View>
  );
};

export default Header;
