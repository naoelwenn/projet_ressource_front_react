import {View, StyleSheet} from "react-native";
import SearchRessource from "./SearchRessource";
export default function HomeScreen({navigation}){
    return(
        <View style={styles.container}>
            <SearchRessource navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f4f7",
        paddingTop: 20,
      }
})