import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput,Dimensions, Button  } from 'react-native';
import { Suspense, use } from 'react';
import { useState, useEffect } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import{Picker} from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import Header from '../component/Header';
import globalStyles from '../Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width; //-- récupère la largeur de la fenetre


export default function EditScreen({ navigation, route }) {
  const isEditMode = !!route.params?.ressourceId; //- en mode création ou édition
  const[ressource, setRessource] = useState(null);
  const[categorie_ressource, setCategorie_Ressource] = useState([]);
  const[selectedCategorieRessource, setSelectedCategorieRessource] = useState(null);
  const[type_ressource, setType_Ressource] = useState([]);
  const[selectedTypeRessource, setSelectedTypeRessource] = useState(null);
  const[type_relation, setType_Relation] = useState([]);
  const[selectedTypeRelation, setSelectedTypeRelation] = useState([]);
  const[titre, setTitre] = useState("");
  const[contenu, setContenu] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState(null);

  //-- valeur de ressource par defaut
  const defaultRessource = {
    id: null,
    titre: '',
    contenu: '',
    dateCreation: new Date().toISOString(),
    valide: true,
    suspendu: false,
    utilisateur: userId, 
    categorie_ressource: null,
    type_ressource: null,
    type_relation: [],
  };

  //-- récupère l'id de l'utilisateur connecté
  useEffect(()=>{
    const fetchUser = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
      } catch (err) {
        console.error('Erreur chargement user id:', err);
      }
    };
    fetchUser();
  })

  //-- Récupère les infos de la ressource ou ressource par defaut si création
  useEffect(() => {
    if(isEditMode){
      const { ressourceId } = route.params;
      fetch(process.env.EXPO_PUBLIC_API_URL + `ressources/${ressourceId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Réponse réseau non OK");
        return res.json();
      })
      .then((data) =>{
        setRessource(data);
        setTitre(data.titre || "");
        setSelectedCategorieRessource(data.categorie_ressource?.id || null);
        setSelectedTypeRessource(data.type_ressource?.id || null);
        setSelectedTypeRelation(data.type_relation?.map((tr) => tr.id) || []);
        setContenu(data.contenu || "");
      })
      .catch((err) => console.error("Erreur de fetch :", err));
    }else{
      setRessource(defaultRessource);
      setTitre(defaultRessource.titre);
      setContenu(defaultRessource.contenu);
      setSelectedCategorieRessource(defaultRessource.categorie_ressource);
      setSelectedTypeRessource(defaultRessource.type_ressource);
      setSelectedTypeRelation(defaultRessource.type_relation);
    }
  }, [route.params]);

  //-- Récupère la liste des categories de ressource
  useEffect(()=>{
    const fetchCategorie_Ressource = async()=>{
      try{
        const reponse = await fetch(process.env.EXPO_PUBLIC_API_URL + "categorie_ressource"); 
        if (!reponse.ok) throw new Error("Reponse réseau non ok");

        const data = await reponse.json();

        if(Array.isArray(data)){
          setCategorie_Ressource(data);
        }else{
          console.error("Données inattendues");
        }
      } catch(error){
        console.error("Erreur de fetch", error);
      };
    }
    fetchCategorie_Ressource();
  }, []);

  //-- Récupère la liste des types de ressource
  useEffect(()=>{
    const fetchType_Ressource = async()=>{
      try{
        const reponse = await fetch(process.env.EXPO_PUBLIC_API_URL + "type_ressource"); 
        if (!reponse.ok) throw new Error("Reponse réseau non ok");
    
        const data = await reponse.json();
    
        if(Array.isArray(data)){
          setType_Ressource(data);
        }else{
          console.error("Données inattendues");
        }
    
      } catch(error){
        console.error("Erreur de fetch", error);
      };
    }
    fetchType_Ressource();
  }, []);  

  //-- Récupère la liste des type_relation
  useEffect(()=>{
    const fetchType_Relation = async()=>{
      try{
        const reponse = await fetch(process.env.EXPO_PUBLIC_API_URL + "type_relation"); 
        if (!reponse.ok) throw new Error("Reponse réseau non ok");
    
        const data = await reponse.json();
    
        if(Array.isArray(data)){
            setType_Relation(data);
        }else{
            console.error("Données inattendues");
        }
    
      } catch(error){
        console.error("Erreur de fetch", error);
      };
    }
    fetchType_Relation();
  }, []);

  //-- fonction pour enregistrer
  const handleSave = async () => {
    const method = isEditMode ? 'PUT' : 'POST';

    const url = isEditMode 
    ? process.env.EXPO_PUBLIC_API_URL + `ressources/${ressource.id}` 
    : process.env.EXPO_PUBLIC_API_URL + `ressources`;

    const userIdRessource = isEditMode
    ? ressource.utilisateur.id
    : userId;

    const ressourceModifiee = {
      id: isEditMode ? ressource.id : undefined,
      titre: titre,
      contenu: contenu,
      dateCreation: ressource.dateCreation,
      valide:ressource.valide,
      suspendu: ressource.suspendu,
      utilisateur: {id: userIdRessource},
      categorie_ressource: { id: selectedCategorieRessource },
      type_ressource: { id: selectedTypeRessource },
      type_relation: selectedTypeRelation.map(id => ({ id }))
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ressourceModifiee)
      });
  
      if (!response.ok) {
        throw new Error("Échec de la mise à jour de la ressource.");
      }
            
      // Si c'est une modification (edit), retour à DetailScreen avec rafraîchissement
      if (isEditMode) {
        if(selectedFile!= null){
          uploadFile(ressourceModifiee.id, selectedFile);
        }
        navigation.replace("Ma ressource", { ressourceId: ressourceModifiee.id, refresh: true });
      } else {
        // Si c'est une création, ouverture de la nouvelle ressource en detail
        const newRessource = await response.json(); // Récupère la ressource créée
        if(selectedFile!= null){
          uploadFile(newRessource.id, selectedFile);
        }
        navigation.replace("Ma ressource", { ressourceId: newRessource.id });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  //-- selection d'un nouveau fichier
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  //-- envoi du fichier vers l'API
  const uploadFile = async (ressourceId, file) => {
    console.log(file);
    const url = process.env.EXPO_PUBLIC_API_URL + `ressources/${ressourceId}/upload`;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de l’upload');
      }
  
      const result = await response.text();
      console.log('Réponse serveur :', result);
      //alert('Fichier uploadé avec succès !');
    } catch (error) {
      console.error('Erreur upload :', error);
      alert('Erreur upload : ' + error.message);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>

      {/*Entete*/}
      <View>
        <Header/>
      </View>

      <View style={globalStyles.container}>

        {/* Image dossier */}
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/32/716/716784.png" }} // icone dossier pour exemple
          style={globalStyles.image}
        />

        {/* Titre : text input*/}
        <View style={globalStyles.standardInputContainer}>
          <TextInput 
            style={globalStyles.standardInput}
            placeholder="Titre"
            onChangeText={setTitre}
            value={titre} 
          />
        </View>

        {/* Date de creation */}
        {/* <Text style = {styles.text}>Crée le : {ressource.dateCreation}</Text> */}

        {/* type(s) de relation : multiselect */}
        <View style={globalStyles.standardInputContainer}>
          <MultiSelect
          style = {globalStyles.standardInput}
          items={type_relation}
          uniqueKey="id"
          onSelectedItemsChange={setSelectedTypeRelation}
          selectedItems={selectedTypeRelation}
          selectText="Relation(s)"
          searchInputPlaceholderText="Rechercher..."
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#000"
          selectedItemTextColor="#007AFF"
          selectedItemIconColor="#007AFF"
          itemTextColor="#000"
          displayKey="libelle"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#007AFF"
          submitButtonText="Valider"
          />
        </View>

        {/* Catégorie de ressource : combobox */}
        <View style={globalStyles.standardInputContainer}>
          <Picker
          selectedValue={selectedCategorieRessource}
          style={globalStyles.standardInput}
          onValueChange={(itemValue)=>setSelectedCategorieRessource(itemValue)}
          >
            {categorie_ressource.map((type)=> (
            <Picker.Item
              key = {type.id}
              label = {type.libelle ?? "Catégorie inconnue"}
              value = {type.id}
            />
            ))}
          </Picker>
        </View>

        {/* Type de ressource : combobox */}
        <View style={globalStyles.standardInputContainer}>
          <Picker
            selectedValue={selectedTypeRessource}
            style={globalStyles.standardInput}
            onValueChange={(itemValue)=>setSelectedTypeRessource(itemValue)}
          >
          {type_ressource.map((type)=> (
          <Picker.Item
            key = {type.id}
            label = {type.libelle ?? "Type inconnu"}
            value = {type.id}
          />
          ))}
          </Picker>
        </View>

        {/* Contenu : text input*/}
        <View style={globalStyles.standardInputContainer}>
          <TextInput 
            style={globalStyles.standardInput}
            placeholder="Contenu"
            onChangeText={setContenu}
            value={contenu} 
          />
        </View>

        {/* Uploader un document / fichier : en mode web uniquement */}
        {Platform.OS === 'web' && (
          <input type="file" onChange={handleFileChange} style={{ margin: 10 }}/>
        )}
        {selectedFile && <Text>Fichier sélectionné : {selectedFile.name}</Text>}

        {/* Enregistrer */}
        <TouchableOpacity style={globalStyles.standardButton} onPress={handleSave}>
          <Text style={globalStyles.standardButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      
      </View>
    </SafeAreaView>
  );
}