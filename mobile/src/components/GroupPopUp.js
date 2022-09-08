import { Text, View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import {
    useFonts,
    OpenSans_300Light,
    OpenSans_300Light_Italic,
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_600SemiBold,
    OpenSans_600SemiBold_Italic,
    OpenSans_700Bold,
    OpenSans_700Bold_Italic,
    OpenSans_800ExtraBold,
    OpenSans_800ExtraBold_Italic,
} from '@expo-google-fonts/open-sans';
import appStyles from '../constants/stylesheets.js';

function GroupPopUp(props) {
    let [fontsLoaded] = useFonts({
        OpenSans_300Light,
        OpenSans_300Light_Italic,
        OpenSans_400Regular,
        OpenSans_400Regular_Italic,
        OpenSans_600SemiBold,
        OpenSans_600SemiBold_Italic,
        OpenSans_700Bold,
        OpenSans_700Bold_Italic,
        OpenSans_800ExtraBold,
        OpenSans_800ExtraBold_Italic,
    });
    const { mostRecentMessage, mostRecentDate, name, icon } = props.group;
    const clicked = () => {
        props.nav(props.group.id);
    };
    return (
        <TouchableHighlight onPress={clicked} underlayColor='lightgray'>
            <View style={{ display: 'flex', width: '100%', height: 60 }}>
                <View style={styles.container}>
                    <Image source={{ uri: icon }} style={{ width: 45, height: 45, borderRadius: '50%' }} />
                    <View style={styles.textContainer}>
                        <Text style={{ fontSize: 18, fontFamily: 'OpenSans_600SemiBold' }}>{name}</Text>
                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans_400Regular' }}>{mostRecentMessage}</Text>
                    </View>
                </View >
                <View style={{
                    width: '80%',
                    borderBottomColor: 'lightgray',
                    borderBottomWidth: 1,
                    marginLeft: '15%'
                }} />
            </View>
        </TouchableHighlight>
    );
}

export default GroupPopUp;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: '5%',
    },
});