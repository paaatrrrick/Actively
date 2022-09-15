import React, { useState } from 'react';
import { Button, Text, TextInput, View, Image, StyleSheet, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appStyles from '../constants/stylesheets.js';
import API_CALL from '../constants/service.js';
import { getData } from '../utils/authUtils.js';

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



export default function CreateGroup({ navigation }) {
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

    const logout = async () => {
        AsyncStorage.setItem('token', 'Error').then(() => {
            navigation.navigate('Login');
        })
    }
    const deleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        const token = await getData();
                        if (token !== 'Error') {
                            const reponse = await fetch(API_CALL.deleteProfile, {
                                method: 'POST',
                                headers: {
                                    "x-access'token": token,
                                    'Content-Type': 'application/json',
                                },
                            })
                            logout();
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }
    if (!fontsLoaded) {
        return <View></View>;
    }
    return (
        <View style={styles.container}>
            <Text style={{ fontFamily: 'OpenSans_600SemiBold', fontSize: 40, color: '#262626' }}>Settings</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '60%' }}>
                <Pressable style={[appStyles.smallButton, appStyles.genericShadow]} onPress={logout}>
                    <Text style={{
                        fontFamily: 'OpenSans_400Regular', fontSize: 18, color: '#262626',
                    }} >Logout</Text>
                </Pressable>
                <Pressable style={[appStyles.smallButton, appStyles.genericShadow]} onPress={deleteAccount}>
                    <Text style={{
                        fontFamily: 'OpenSans_400Regular', fontSize: 18, color: '#262626',
                    }} >Delete Account</Text>
                </Pressable>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: '50%',
    },
});
