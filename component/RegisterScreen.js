import React, { useState } from 'react';
import {  StyleSheet,  View,  Text,  TextInput,  TouchableOpacity,  SafeAreaView,  KeyboardAvoidingView,  Platform,  Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import globalStyle from '../Styles/globalStyles';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pseudo: '',
    ville: '',
    codepostal: '',
    anneenaissance: '',
    etatcivil: 'H',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)){
          error = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre';
        }
        break;
      case 'pseudo':
        if (!value) {
          error = 'Le pseudo est requis';
        }
        break;
      case 'ville':
        if (!value) {
          error = 'La ville est requise';
        }
        break;
      case 'codepostal':
        if (!value) {
          error = 'Le code postal est requis';
        } else if (!/^\d{5}$/.test(value)) {
          error = 'Le code postal doit contenir 5 chiffres';
        }
        break;
      case 'anneenaissance':
        if (!value) {
          error = 'L\'année de naissance est requise';
        } else {
          const year = parseInt(value);
          if (isNaN(year)) {
            error = 'L\'année doit être un nombre';
          } else if (year < 1900) {
            error = 'L\'année doit être après 1900';
          } else if (year > new Date().getFullYear()) {
            error = 'L\'année ne peut pas être dans le futur';
          }
        }
        break;
    }
    return error;
  };

  const handleChange = (field, value) => {
    // Mise à jour du formulaire
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validation en temps réel
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || null
    }));
  };

  const storeUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('Données utilisateur stockées:', userData);
    } catch (error) {
      console.error('Erreur lors du stockage des données:', error);
    }
  };

  const handleRegister = async () => {
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
    console.log('URL de l\'API:', process.env.EXPO_PUBLIC_API_URL);
    console.log('Données envoyées:', formData);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        pseudo: formData.pseudo,
        ville: formData.ville,
        codepostal: formData.codepostal,
        anneenaissance: parseInt(formData.anneenaissance),
        etatcivil: formData.etatcivil,
        actif: true
      };

      console.log('Tentative de connexion à l\'API...');
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + 'utilisateurs/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
      });

      console.log('Statut de la réponse:', response.status);
      let data;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          data = await response.json();
          console.log('Réponse JSON:', data);
        } else {
          const textData = await response.text();
          console.log('Réponse texte:', textData);
          throw new Error(textData);
        }
      } catch (error) {
        console.error('Erreur de parsing:', error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
        return;
      }

      if (response.ok) {
        console.log('Inscription réussie, préparation de la redirection...');
        // Stocker les données utilisateur
        await storeUserData(data);
        
        // Redirection directe sans alerte
        console.log('Tentative de redirection directe...');
        try {
          navigation.navigate('Ressources');
          console.log('Navigation effectuée');
        } catch (error) {
          console.error('Erreur de navigation:', error);
          // Si la navigation échoue, on essaie une autre approche
          try {
            console.log('Tentative de navigation alternative...');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Ressources' }],
              })
            );
            console.log('Navigation alternative effectuée');
          } catch (error2) {
            console.error('Erreur de navigation alternative:', error2);
          }
        }
      } else {
        if (data && typeof data === 'object') {
          setErrors(data);
        } else {
          Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert(
        'Erreur',
        'Impossible de se connecter au serveur. Vérifiez votre connexion.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyle.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={globalStyle.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
          <View style={globalStyle.formContainer}>
            <Text style={globalStyle.standardTitle}>Inscription</Text>

            <View style={globalStyle.standardInputContainer}>
              <Text style={globalStyle.label}>Email *</Text>
              <TextInput
                style={[globalStyle.standardInput, errors.email ? globalStyle.standardInputError : null]}
                placeholder="Entrez votre email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email ? <Text style={globalStyle.standardErrorText}>{errors.email}</Text> : null}
            </View>

            <View style={globalStyle.standardInputContainer}>
              <Text style={globalStyle.label}>Mot de passe *</Text>
              <TextInput
                style={[globalStyle.standardInput, errors.password ? globalStyle.standardInputError : null]}
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password ? <Text style={globalStyle.standardErrorText}>{errors.password}</Text> : null}
            </View>

            <View style={globalStyle.standardInputContainer}>
              <Text style={globalStyle.label}>Pseudo *</Text>
              <TextInput
                testID="pseudoInput"
                style={[globalStyle.standardInput, errors.pseudo ? globalStyle.standardInputError : null]}
                placeholder="Choisissez un pseudo"
                value={formData.pseudo}
                onChangeText={(value) => handleChange('pseudo', value)}
                editable={!isLoading}
              />
              {errors.pseudo ? <Text style={globalStyle.standardErrorText}>{errors.pseudo}</Text> : null}
            </View>

            <View style={globalStyle.standardInputContainer}>
              <Text style={globalStyle.label}>Ville *</Text>
              <TextInput
                testID='villeInput'
                style={[globalStyle.standardInput, errors.ville ? globalStyle.standardInputError : null]}
                placeholder="Entrez votre ville"
                value={formData.ville}
                onChangeText={(value) => handleChange('ville', value)}
                editable={!isLoading}
              />
              {errors.ville ? <Text style={globalStyle.standardErrorText}>{errors.ville}</Text> : null}
            </View>

            <View style={globalStyle.standardInputContainer}>
              <Text style={globalStyle.label}>Code postal *</Text>
              <TextInput
                testID='cpInput'
                style={[globalStyle.standardInput, errors.codepostal ? globalStyle.standardInputError : null]}
                placeholder="Entrez votre code postal"
                value={formData.codepostal}
                onChangeText={(value) => handleChange('codepostal', value)}
                keyboardType="numeric"
                maxLength={5}
                editable={!isLoading}
              />
              {errors.codepostal ? <Text style={globalStyle.standardErrorText}>{errors.codepostal}</Text> : null}
            </View>

            <View style={globalStyle.standardInputContainer}>
              <Text style={globalStyle.label}>Année de naissance *</Text>
              <TextInput
                testID='birthdayInput'
                style={[globalStyle.standardInput, errors.anneenaissance ? globalStyle.standardInputError : null]}
                placeholder="Entrez votre année de naissance"
                value={formData.anneenaissance}
                onChangeText={(value) => handleChange('anneenaissance', value)}
                keyboardType="numeric"
                maxLength={4}
                editable={!isLoading}
              />
              {errors.anneenaissance ? <Text style={globalStyle.standardErrorText}>{errors.anneenaissance}</Text> : null}
            </View>

            <View style={globalStyle.standardInputContainer}>
              <Text style={globalStyle.label}>État civil</Text>
              <View style={globalStyle.standardRadioContainer}>
                <TouchableOpacity
                  style={[
                    globalStyle.standardRadioButton,
                    formData.etatcivil === 'H' && globalStyle.standardRadioButtonSelected
                  ]}
                  onPress={() => handleChange('etatcivil', 'H')}
                  disabled={isLoading}
                >
                  <Text style={[
                    globalStyle.standardRadioText,
                    formData.etatcivil === 'H' && globalStyle.stantardRadioTextSelected
                  ]}>Homme</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    globalStyle.standardRadioButton,
                    formData.etatcivil === 'F' && globalStyle.standardRadioButtonSelected
                  ]}
                  onPress={() => handleChange('etatcivil', 'F')}
                  disabled={isLoading}
                >
                  <Text style={[
                    globalStyle.standardRadioText,
                    formData.etatcivil === 'F' && globalStyle.stantardRadioTextSelected
                  ]}>Femme</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[globalStyle.standardButton, isLoading && globalStyle.buttonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={globalStyle.standardButtonText}>
                {isLoading ? 'Inscription...' : 'S\'inscrire'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={globalStyle.standardLinkButton}
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={globalStyle.standardLinkText}>
                Déjà inscrit ? Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen; 

