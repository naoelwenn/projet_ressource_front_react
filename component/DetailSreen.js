import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert  } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView} from 'react-native';


export default function DetailsScreen({ navigation, route }) {
  const [ressource, setRessource] = useState(null);
  const [file, setFile] = useState("");

  //-- liste les ressources
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
      const confirmed = window.confirm("Voulez-vous vraiment supprimer cette ressource ?");
      resolve(confirmed);
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
  
  //-- affiche Loading si les infos ne sont pas récupérées
  if (!ressource) {
    return <Text>Loading...</Text>;
  }else{
    console.log(ressource);
  }

  //-- Affichage
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* fiche de la ressource */}
        <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/32/716/716784.png" }} // icone dossier pour exemple
            style={styles.image}
        />
        <Text style={styles.title}>{ressource.titre}</Text>
        <Text style = {styles.text}>Crée le : {ressource.dateCreation}</Text>
        <Text style = {styles.text}>Relation : {ressource.type_relation?.map(tr => tr.libelle).join(", ")}</Text>
        <Text style = {styles.text}>Catégorie : {ressource.categorie_ressource.libelle}</Text>
        <Text style = {styles.text}>Type : {ressource.type_ressource.libelle}</Text>
        <Text style = {styles.text}>{ressource.contenu}</Text>

        {/* bouton de téléchargement */}

        {file != "" && (
        <TouchableOpacity
        style={styles.editButton}
        onPress={handleDownload}
        >
        <Text style={styles.editButtonText}>Télécharger le fichier</Text>
        </TouchableOpacity>
        )}

        {file != "" && (
          <Text>Fichier : {file}</Text>
        )}

        {/* bouton de modification */}
        <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('Edition', { ressourceId: ressource.id })}
        >
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>

        {/* bouton de suppression */}
        <TouchableOpacity
        style={styles.editButton}
        onPress={deleteRessource}>
          <Text style={styles.editButtonText}>Supprimer</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center"
  },
  title: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    textAlign: "center",
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
  }
});