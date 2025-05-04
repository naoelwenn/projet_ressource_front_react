import { StyleSheet, Text, View, FlatList, Image, useWindowDimensions, TouchableOpacity, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import{Picker} from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

const SearchRessource = ({navigation}) =>{
  const[text, setText] = useState("");
  const[filtreRessources, setFiltreRessources] = useState([]);
  const[ressources, setRessources] = useState([]);
  const[type_relation, setType_Relation] = useState([]);
  const[selectedTypeRelation, setSelectedTypeRelation] = useState(null);
  const[categorie_ressource, setCategorie_Ressource] = useState([]);
  const[selectedCategorieRessource, setSelectedCategorieRessource] = useState(null);
  const[type_ressource, setType_Ressource] = useState([]);
  const[selectedTypeRessource, setSelectedTypeRessource] = useState(null);

  const window = useWindowDimensions(); // récupère la largeur de l'écran
  // Définir la taille d’un bloc (carte ressource)
  const ITEM_WIDTH = 300; // en px
  const SPACING = ITEM_WIDTH/10; // on veut un espace égal à la largeur d’un bloc / 10
  // Calcul dynamique du nombre de colonnes selon la taille de l'écran
  const numColumns = Math.max(1, Math.floor(window.width / (ITEM_WIDTH + SPACING)));

  //-- liste les ressources
  const fetchRessources = async()=>{
    try{
      const reponse = await fetch("http://localhost:8080/api/ressources"); 
      if (!reponse.ok) throw new Error("Reponse réseau non ok");
  
      const data = await reponse.json();
  
      if(Array.isArray(data)){
        setRessources(data);
        setFiltreRessources(data);
      }else{
        console.error("Données inattendues");
      }
  
    } catch(error){
      console.error("Erreur de fetch", error);
    };
  }

  //-- Rafraichit les données à chaque fois que l'écran est affiché 
  useFocusEffect(
    React.useCallback(()=> {
    fetchRessources();
  },[])
  );

  //-- applique les filtres
  useEffect(()=>{
    let result = ressources;
    //-- filtre sur le texte du titre
    if (text.length > 2){
        result = result.filter((ressource)=> 
            ressource.titre.toLowerCase().includes(text.toLowerCase())
        );
    }
    //-- filtre sur le type de relation
    if(selectedTypeRelation){
        result = result.filter((ressource) =>
          ressource.type_relation.some((type)=>type.id === parseInt(selectedTypeRelation))
        );
    }
    //-- filtre sur la catégorie de ressource
    if(selectedCategorieRessource){
      result = result.filter((ressource) =>
        ressource.categorie_ressource.id === parseInt(selectedCategorieRessource)
      );
    }
    //-- filtre sur le type de ressource
    if(selectedTypeRessource){
      result = result.filter((ressource) =>
        ressource.type_ressource.id === parseInt(selectedTypeRessource)
      );
    }
    setFiltreRessources(result);
  }, [text, ressources, selectedTypeRelation, selectedCategorieRessource, selectedTypeRessource]);

  //-- Récupère la liste des type_relation
  useEffect(()=>{
    const fetchType_Relation = async()=>{
        try{
          const reponse = await fetch("http://localhost:8080/api/type_relation"); 
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

  //-- Récupère la liste des categories de ressource
  useEffect(()=>{
    const fetchCategorie_Ressource = async()=>{
        try{
          const reponse = await fetch("http://localhost:8080/api/categorie_ressource"); 
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
            const reponse = await fetch("http://localhost:8080/api/type_ressource"); 
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

  const dataToDisplay = filtreRessources;

  //-- affichage 
  return (
    <View style={styles.container}>

      {/* bouton de création d'une ressource */}
      <TouchableOpacity
      style={styles.editButton}
      onPress={() => navigation.navigate('Edition')}>
        <Text style={styles.editButtonText}>Créer une ressource</Text>
      </TouchableOpacity>

      {/* combobox type de relation */}
      <Picker
        selectedValue={selectedTypeRelation}
        style={styles.searchressource}
        onValueChange={(itemValue)=>setSelectedTypeRelation(itemValue)}
      >
        <Picker.Item label="Tous les types de relation" value=""/>
        {type_relation.map((type)=> (
          <Picker.Item
            key = {type.id}
            label = {type.libelle ?? "Type inconnu"}
            value = {type.id}
          />
        ))}
      </Picker>

      {/* combobox Catégorie de ressource */}
      <Picker
        selectedValue={selectedCategorieRessource}
        style={styles.searchressource}
        onValueChange={(itemValue)=>setSelectedCategorieRessource(itemValue)}
      >
        <Picker.Item label="Toutes les catégories" value=""/>
        {categorie_ressource.map((type)=> (
          <Picker.Item
            key = {type.id}
            label = {type.libelle ?? "Catégorie inconnue"}
            value = {type.id}
          />
        ))}
      </Picker>

      {/* combobox type de ressource */}
      <Picker
        selectedValue={selectedTypeRessource}
        style={styles.searchressource}
        onValueChange={(itemValue)=>setSelectedTypeRessource(itemValue)}
      >
        <Picker.Item label="Tous les types de ressource" value=""/>
        {type_ressource.map((type)=> (
          <Picker.Item
            key = {type.id}
            label = {type.libelle ?? "Type inconnu"}
            value = {type.id}
          />
        ))}
      </Picker>
      
      {/* barre de recherche textuelle */}
      <TextInput 
        style={styles.searchressource}
        placeholder="Rechercher une ressource"
        onChangeText={setText}
        value={text} 
      />

      {/* Liste des ressources */}
      <FlatList
          data={dataToDisplay}
          numColumns={numColumns}
          columnWrapperStyle={
            numColumns > 1 ? styles.columnWrapper : null
          } // ajoute de l'espacement horizontal
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.itemContainer, { width: ITEM_WIDTH }]}>
              {/* clicable */}
              <TouchableOpacity
                onPress={()=>
                navigation.navigate("Ma ressource", {ressourceId: item.id})
              }>
                {/* Image */}
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/32/716/716784.png" }} // icone dossier pour exemple 
                  style={styles.image}
                />
                {/* Titre */}
                <Text style={styles.itemTitleText}>
                  {item?.titre ?? "Nom inconnu"}
                </Text>
                {/* Types de relation */}
                <Text style={styles.itemText}>
                  Relation : {item.type_relation?.map(tr => tr.libelle).join(", ")}
                </Text>
                {/* Catégorie de ressource */}
                <Text style={styles.itemText}>
                  Catégorie : {item.categorie_ressource.libelle}
                </Text>
                {/* Type de ressource */}
                <Text style={styles.itemText}>
                  Type : {item.type_ressource.libelle}
                </Text>
              </TouchableOpacity>
            </View>
          )}
      />
    </View>
  );
}

//-- style 
const styles = StyleSheet.create({

  searchressource: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 10,
    marginBottom: 15,
    elevation: 2, // pour un peu d’ombre sur Android
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },  
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    paddingTop: 20,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  columnWrapper: {
    justifyContent: "space-evenly", // espace égal entre les blocs
    marginBottom: 20, // espace vertical entre les rangées
  },
  itemContainer: {
    margin: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  itemTitleText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  itemText: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center"
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center'
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SearchRessource;