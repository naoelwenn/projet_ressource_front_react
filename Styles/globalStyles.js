import {StyleSheet} from 'react-native';

const globalStyle = StyleSheet.create({

    //-- contenu de la page 
    container: {
        flex: 1,
        backgroundColor: "#f0f4f7",
    },

    //-- entete
    header: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#000091',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign:'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    headerLink: {
        color: '#fff', 
        marginHorizontal: 10,
        fontSize: 16, 
    },
    headerButtonGroup: {
        flexDirection: 'row', // changée dynamiquement via `isMobile`
        flexWrap: 'wrap',
        gap: 10,
    },

    //-- champs de saisie (combobox et input text)
    standardInputContainer: {
        paddingHorizontal:10,
        paddingVertical:5
    },
    standardLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    standardInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 5,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    }, 
    standardInputError: {
        borderColor: '#ff3b30',
        backgroundColor: '#fff5f5',
    },
    standardErrorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 5,
        marginLeft: 5,
    }, 

    //input radio
    standardRadioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    standardRadioButton: {
        flex: 1,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    standardRadioButtonSelected: {
        backgroundColor: '#000091',
        borderColor: '#000091',
    },
    standardRadioText: {
        fontSize: 16,
        color: '#333',
    },
    stantardRadioTextSelected: {
        color: '#fff',
    },

    //-- Liste des ressources (blocs)
    listContent: {
        paddingHorizontal: 3,
    },
    columnWrapper: {
        justifyContent: "space-evenly", 
        marginBottom: 7,
    },
    itemContainer: {
        margin: 5,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 5,
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
        marginTop: 4,
        textAlign: "center",
    },
    itemText: {
        fontSize: 14,
        color: "#333",
        marginTop: 2,
        textAlign: "center",
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: "contain",
        alignSelf: "center"
    },
    imageHeader:{
        width: 80,
        height: 80,
        resizeMode: "contain",
        alignSelf: "flex-start",
        borderRadius:8,
    },

    //-- bouton standard
    standardButton: {
        backgroundColor: '#000091',
        paddingVertical: 5,
        paddingHorizontal:10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center'
    },
    standardButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    standardLinkButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    standardLinkText: {
        color: '#000091',
        fontSize: 16,
    },

    //-- fiche ressource
    ressourceTitle: {
        fontSize: 18,
        color: "#333",
        fontWeight: "500",
        marginTop: 8,
        textAlign: "center",
    },

    ressourceText: {
        fontSize: 16,
        color: "#333",
        marginTop: 8,
        textAlign: "center",
    },

    //-- formulaire d'inscription / connexion
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
    errorContainer: {
        backgroundColor: '#fff5f5',
        borderWidth: 1,
        borderColor: '#ff3b30',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },

    // titre standard
    standardTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
});

export default globalStyle;