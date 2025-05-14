import React, { useState } from 'react';
import {  StyleSheet,  View,  Text,  TextInput,  TouchableOpacity,  SafeAreaView,  KeyboardAvoidingView,  Platform,  Alert, ScrollView
} from 'react-native';

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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Validation en temps réel
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
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

      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + 'utilisateurs/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'http://localhost:8081'
        },
        body: JSON.stringify(userData),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        Alert.alert(
          'Succès',
          'Inscription réussie ! Vous pouvez maintenant vous connecter.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        if (typeof data === 'object' && data !== null) {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Inscription</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Entrez votre email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe *</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pseudo *</Text>
              <TextInput
                style={[styles.input, errors.pseudo && styles.inputError]}
                placeholder="Choisissez un pseudo"
                value={formData.pseudo}
                onChangeText={(value) => handleChange('pseudo', value)}
                editable={!isLoading}
              />
              {errors.pseudo && <Text style={styles.errorText}>{errors.pseudo}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ville *</Text>
              <TextInput
                style={[styles.input, errors.ville && styles.inputError]}
                placeholder="Entrez votre ville"
                value={formData.ville}
                onChangeText={(value) => handleChange('ville', value)}
                editable={!isLoading}
              />
              {errors.ville && <Text style={styles.errorText}>{errors.ville}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Code postal *</Text>
              <TextInput
                style={[styles.input, errors.codepostal && styles.inputError]}
                placeholder="Entrez votre code postal"
                value={formData.codepostal}
                onChangeText={(value) => handleChange('codepostal', value)}
                keyboardType="numeric"
                maxLength={5}
                editable={!isLoading}
              />
              {errors.codepostal && <Text style={styles.errorText}>{errors.codepostal}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Année de naissance *</Text>
              <TextInput
                style={[styles.input, errors.anneenaissance && styles.inputError]}
                placeholder="Entrez votre année de naissance"
                value={formData.anneenaissance}
                onChangeText={(value) => handleChange('anneenaissance', value)}
                keyboardType="numeric"
                maxLength={4}
                editable={!isLoading}
              />
              {errors.anneenaissance && <Text style={styles.errorText}>{errors.anneenaissance}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>État civil</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.etatcivil === 'H' && styles.radioButtonSelected
                  ]}
                  onPress={() => handleChange('etatcivil', 'H')}
                  disabled={isLoading}
                >
                  <Text style={[
                    styles.radioText,
                    formData.etatcivil === 'H' && styles.radioTextSelected
                  ]}>Homme</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.etatcivil === 'F' && styles.radioButtonSelected
                  ]}
                  onPress={() => handleChange('etatcivil', 'F')}
                  disabled={isLoading}
                >
                  <Text style={[
                    styles.radioText,
                    formData.etatcivil === 'F' && styles.radioTextSelected
                  ]}>Femme</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Inscription...' : 'S\'inscrire'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>
                Déjà inscrit ? Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
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
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  radioButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
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
});

export default RegisterScreen; 

