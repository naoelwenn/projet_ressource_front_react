import {View, StyleSheet} from "react-native";
import SearchRessource from "./SearchRessource";
import globalStyles from '../Styles/globalStyles';
export default function HomeScreen({navigation}){
    return(
        <View style={globalStyles.container}>
            <SearchRessource navigation={navigation}/>
        </View>
    );
}