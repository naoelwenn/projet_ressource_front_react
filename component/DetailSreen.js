import { Text, View, Image, TouchableOpacity, Alert, Platform  } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView} from 'react-native';
import Header from '../component/Header';
import globalStyles from '../Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function DetailsScreen({ navigation, route }) {
  const [ressource, setRessource] = useState(null);
  const [file, setFile] = useState("");
  const [userId, setUserId] = useState(null);

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

  //-- récupère les infos de la ressource
  const fetchRessource = (id) => {
    fetch(process.env.EXPO_PUBLIC_API_URL + `ressources/${id}`)
      .then((res) => {
        console.log("Status de la réponse:", res.status); 
        if (!res.ok) throw new Error("Réponse réseau non OK");
        return res.json();
      })
      .then((data) => setRessource(data))
      .catch((err) => console.error("Erreur de fetch :", err));
  };

  //-- charge les infos de la ressource
  useEffect(() => {
    const { ressourceId } = route.params;
    fetchRessource(ressourceId)
  }, [route.params]);

  //-- mise a jour des infos si modifications 
  useEffect(() => {
    if (route.params?.refresh) {
      fetchRessource(route.params.ressourceId)
    }
  }, [route.params?.refresh]);

  //-- fonction de suppression de la ressource
  const deleteRessource = async () => {
    const isConfirmed =  await confirmation(); // Attendre la confirmation de l'utilisateur
    if (isConfirmed) {
      try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + `ressources/${ressource.id}`, {
          method: 'DELETE',
        });
    
        if (response.status === 204) {
          navigation.navigate("Ressources");
        } else {
          console.error("Échec de la suppression");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  //-- demande la confirmation avant suppression
  const confirmation = () => {
    return new Promise((resolve) => {
      if (Platform.OS === 'web') {
        const confirmed = window.confirm("Voulez-vous vraiment supprimer cette ressource ?");
        resolve(confirmed);
      }else{
        Alert.alert(
          "Confirmation",
          "Voulez-vous vraiment supprimer cette ressource ?",
          [
            {
              text: "Annuler",
              style: "cancel",
              onPress: () => resolve(false),
            },
            {
              text: "Supprimer",
              style: "destructive",
              onPress: () => resolve(true),
            },
          ],
          { cancelable: true }
        );
      }

    });
  };

  //-- controle la présence d'un fichier uploadé
  useEffect(()=>{
    const fileExist = async()=>{
      try{
        const { ressourceId } = route.params;
        const reponse = await fetch(process.env.EXPO_PUBLIC_API_URL + `ressources/${ressourceId}/fileExist`); 
        if (!reponse.ok) throw new Error("Reponse réseau non ok");
    
        const data = await reponse.text();
        setFile(data);
      } catch(error){
        console.error("FileExist : Erreur de fetch", error);
      };
    };
    fileExist();
  }, []); 

  //-- téléchargement du fichier de la ressource
  const handleDownload = () => {
    const downloadUrl = process.env.EXPO_PUBLIC_API_URL + `ressources/${ressource.id}/download`;
    window.open(downloadUrl, '_blank');
  };

  //-- format de date : 15/05/2025 15:19
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois de 0 à 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  
  //-- affiche Loading si les infos ne sont pas récupérées
  if (!ressource) {
    return <Text>Loading...</Text>;
  }else{
    console.log(ressource);
  }

  //-- Affichage
  return (
    <SafeAreaView style={globalStyles.container}>
      <Header/>
      <View style={globalStyles.container}>
        {/* fiche de la ressource */}
        <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/32/716/716784.png" }} // icone dossier pour exemple
            style={globalStyles.image}
        />
        <Text style={globalStyles.ressourceTitle}>{ressource.titre}</Text>
        <Text style = {globalStyles.ressourceText}>Crée le : {formatDate(ressource.dateCreation)} par {ressource.utilisateur.pseudo}</Text>
        <Text style = {globalStyles.ressourceText}>Relation : {ressource.type_relation?.map(tr => tr.libelle).join(", ")}</Text>
        <Text style = {globalStyles.ressourceText}>Catégorie : {ressource.categorie_ressource.libelle}</Text>
        <Text style = {globalStyles.ressourceText}>Type : {ressource.type_ressource.libelle}</Text>
        <Text style = {globalStyles.ressourceText}>{ressource.contenu}</Text>

        {/* bouton de téléchargement : seulement si un fichier est présent*/}
        {file != "" && (
          <TouchableOpacity style={globalStyles.standardButton} onPress={handleDownload}>
            <Text style={globalStyles.standardButtonText}>Télécharger le fichier</Text>
          </TouchableOpacity>
        )}

        {file != "" && (<Text style = {globalStyles.ressourceText}>Fichier : {file}</Text>)}

        {/* bouton de modification : seulement pour l'auteur de la ressource */}
        {userId == ressource.utilisateur.id && (
          <TouchableOpacity style={globalStyles.standardButton} onPress={() => navigation.navigate('Edition', { ressourceId: ressource.id })}>
            <Text style={globalStyles.standardButtonText}>Modifier</Text>
          </TouchableOpacity>
        )}

        {/* bouton de suppression : seulement pour l'auteur de la ressource */}
        {userId == ressource.utilisateur.id && (
          <TouchableOpacity
          style={globalStyles.standardButton}
          onPress={deleteRessource}>
            <Text style={globalStyles.standardButtonText}>Supprimer</Text>
          </TouchableOpacity>
        )}

      </View>
    </SafeAreaView>
  );
}
