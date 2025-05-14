import React, { useState } from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../Styles/globalStyles';

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'email':
        if (!value) {
          error = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Format d\'email invalide (ex: nom@domaine.com)';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Le mot de passe est requis';
        }
        break;
    }
    return error;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || null
    }));
  };

  // const storeUserData = async (userData) => {
  //   try {
  //     await AsyncStorage.setItem('userData', JSON.stringify(userData));
  //     console.log('Données utilisateur stockées:', userData);
  //   } catch (error) {
  //     console.error('Erreur lors du stockage des données:', error);
  //   }
  // };

  const handleLogin = async () => {
    // Réinitialiser l'erreur de connexion
    setLoginError('');
    
    // Validation de tous les champs
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + 'utilisateurs/connexion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Réponse du serveur:', data);

      if (response.ok) {
        // Stockage des données utilisateur
        await storeToken(data.token, data.id, data.pseudo);
        navigation.navigate('Ressources')
      } else {
        // Si le serveur répond avec un statut d'erreur
        if (response.status === 401) {
          setLoginError('Email ou mot de passe incorrect');
        } else {
          setLoginError(data.message || 'Une erreur est survenue lors de la connexion : Email ou mot de passe incorrect');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Seulement si c'est une erreur réseau
      if (error.message.includes('Network request failed')) {
        setLoginError('Impossible de se connecter au serveur. Vérifiez que le serveur est bien lancé.');
      } else {
        setLoginError('Une erreur est survenue lors de la connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const storeToken = async (token, id, pseudo) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userPseudo', pseudo);
    } catch (e) {
      console.error('Erreur stockage token :', e);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={globalStyles.keyboardAvoidingView}
      >
        <View style={globalStyles.formContainer}>
          <Text style={globalStyles.standardTitle}>Connexion</Text>

          {loginError ? (
            <View style={globalStyles.errorContainer}>
              <Text style={globalStyles.standardErrorText}>{loginError}</Text>
            </View>
          ) : null}

          <View style={globalStyles.standardInputContainer}>
            <Text style={globalStyles.label}>Email *</Text>
            <TextInput
              style={[globalStyles.standardInput, errors.email ? globalStyles.standardInputError : null]}
              placeholder="Entrez votre email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.email ? <Text style={globalStyles.standardErrorText}>{errors.email}</Text> : null}
          </View>

          <View style={globalStyles.standardInputContainer}>
            <Text style={globalStyles.label}>Mot de passe *</Text>
            <TextInput
              style={[globalStyles.standardInput, errors.password ? globalStyles.standardInputError : null]}
              placeholder="Entrez votre mot de passe"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry
              editable={!isLoading}
            />
            {errors.password ? <Text style={globalStyles.standardErrorText}>{errors.password}</Text> : null}
          </View>

          <TouchableOpacity 
            style={[globalStyles.standardButton, isLoading && globalStyles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={globalStyles.standardButtonText}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.standardLinkButton}
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={globalStyles.standardLinkText}>
              Pas encore inscrit ? S'inscrire
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen; 