import React, { useEffect, useState } from 'react';
import { Button, TextInput, Text, View, StyleSheet, Pressable } from 'react-native';
import { getData } from '../utils/authUtils.js';
import API_CALL from '../constants/service.js';
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


function JoinPopUp(props) {
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
    const { setShowPopUp, navigateAway, getGroupData } = props;
    const [failedSearch, setFailedSearch] = useState(false);
    const [groupCode, setGroupCode] = useState('');

    const tryToJoin = async () => {
        const token = await getData();
        if (token !== 'Error') {
            const response = await fetch(API_CALL.joinGroupByCode, {

                method: 'POST',
                headers: {
                    "x-access'token": token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: groupCode }),

            })
            const data = await response.json();
            if (data === 'failure' || data === 'alreadyJoined') {
                setFailedSearch(true);
            } else {
                setFailedSearch(false);
                setGroupCode('');
                getGroupData();
                navigateAway(data);
            }
        }
    }
    return (
        <View style={styles.container}>
            <Pressable style={styles.closeButton} onPress={() => { setShowPopUp(false); }}>
                <Text style={{
                    fontFamily: 'OpenSans_700Bold', fontSize: 14, color: '#262626',
                }} >X</Text>
            </Pressable>
            <Text style={{
                fontFamily: 'OpenSans_600SemiBold', fontSize: 16, color: '#262626',
            }} >Enter Group Code</Text>
            <TextInput
                style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14, marginTop: 10 }]}
                onChangeText={text => setGroupCode(text)}
                value={groupCode}
                placeholder="Enter Code"
            />
            {(failedSearch) ? <Text style={{
                fontFamily: 'OpenSans_400Regular', marginBottom: 10, fontSize: 12, color: '#262626',
            }} >Group Not Found</Text> : null}
            <Pressable style={[appStyles.bigButton, appStyles.genericShadow]} onPress={tryToJoin}>
                <Text style={{
                    fontFamily: 'OpenSans_400Regular', fontSize: 14, color: '#262626',
                }} >Join</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f8',
        position: 'absolute',
        top: '40%',
        left: '15%',
        width: '70%',
        height: 185,
        borderRadius: 20,
        padding: 10,
    },
    closeButton: {
        position: 'absolute',
        width: 22,
        height: 22,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#80fbbd',
        bottom: 12,
        left: 12,
    }
});
export default JoinPopUp;