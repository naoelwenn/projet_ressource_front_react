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
      console.log('Tentative de connexion au serveur...');
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
        if (response.status === 401) {
          setLoginError('Email ou mot de passe incorrect');
        } else {
          setLoginError(data.message || 'Une erreur est survenue lors de la connexion');
        }
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        setLoginError('Le serveur n\'est pas accessible. Veuillez vérifier que :\n\n' +
          '1. Le serveur backend est bien démarré\n' +
          '2. L\'adresse du serveur est correcte\n' +
          '3. Vous êtes bien connecté au réseau');
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Connexion</Text>

          {loginError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{loginError}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Entrez votre email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe *</Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="Entrez votre mot de passe"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry
              editable={!isLoading}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={styles.linkText}>
              Pas encore inscrit ? S'inscrire
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff3b30',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
});

export default LoginScreen; 