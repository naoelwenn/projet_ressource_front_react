import {StyleSheet} from 'react-native';

const globalStyle = StyleSheet.create({

    //-- contenu de la page 
    container: {
        flex: 1,
        backgroundColor: "#f0f4f7",
        },

    //-- entete de page 
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginHorizontal: 10,
        marginBottom: 10,
        marginTop: 10,
        gap: 10,
    },

    //-- bouton de l'entete
    smallButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    
    //-- texte des boutons de l'entete
    smallButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    //-- champs de saisie (combobox et input text)
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 10,
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        elevation: 2, // pour un peu d’ombre sur Android
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        marginHorizontal: 10,
    },  

    //-- Liste des ressources (blocs)
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
        width: 50,
        height: 50,
        resizeMode: "contain",
        alignSelf: "center"
    },

    //-- bouton standard
    standardButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center'
    },
    standardButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    //-- titre d'une ressource
    title: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
        marginTop: 8,
        textAlign: "center",
    },

    //-- texte d'une ressource
    text: {
        fontSize: 14,
        color: "#333",
        marginTop: 8,
        textAlign: "center",
    },
});

export default globalStyle;