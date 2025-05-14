// component/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../Styles/globalStyles';

const Header = ({ user }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Ressources relationnelles</Text>
      <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            // onPress={() => navigation.navigate("Register")}
            >
            <Text style={styles.link}>Inscription</Text>
          </TouchableOpacity>
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
