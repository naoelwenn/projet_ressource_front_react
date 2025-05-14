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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    // Validation des champs
    if (!formData.email || !formData.password || !formData.pseudo || 
        !formData.ville || !formData.codepostal || !formData.anneenaissance) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    // Validation de l'année de naissance
    const year = parseInt(formData.anneenaissance);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear) {
      Alert.alert('Erreur', 'Veuillez entrer une année de naissance valide');
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

      console.log('Données envoyées au serveur:', userData);

      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + 'utilisateurs/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      
      console.log('Status:', response.status);
      console.log('Réponse du serveur:', data);

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
        let errorMessage = 'Erreur lors de l\'inscription';
        if (typeof data === 'object' && data !== null) {
          errorMessage = Object.values(data).join('\n');
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        Alert.alert('Erreur', errorMessage);
      }
    } catch (error) {
      console.error('Erreur complète:', error);
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
                style={styles.input}
                placeholder="Entrez votre email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pseudo *</Text>
              <TextInput
                style={styles.input}
                placeholder="Choisissez un pseudo"
                value={formData.pseudo}
                onChangeText={(value) => handleChange('pseudo', value)}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ville *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre ville"
                value={formData.ville}
                onChangeText={(value) => handleChange('ville', value)}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Code postal *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre code postal"
                value={formData.codepostal}
                onChangeText={(value) => handleChange('codepostal', value)}
                keyboardType="numeric"
                maxLength={5}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Année de naissance *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre année de naissance"
                value={formData.anneenaissance}
                onChangeText={(value) => handleChange('anneenaissance', value)}
                keyboardType="numeric"
                maxLength={4}
                editable={!isLoading}
              />
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

