import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import { checkAuth } from '../utils/authUtils.js';
import { getData } from '../utils/authUtils.js';
import API_CALL from '../constants/service.js';
import GroupPopUp from '../components/GroupPopUp.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JoinPopUp from '../components/JoinPopUp.js';
import { v4 as uuidv4 } from 'uuid';
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


function Groups({ navigation }) {
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

    const [groups, setGroups] = useState([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const getGroupData = async () => {
        const token = await getData();
        if (token !== 'Error') {
            const response = await fetch(API_CALL.showGroups, { headers: { "x-access'token": token } })
            const data = await response.json();
            setGroups(data.groups);
        }
    }
    const navigateAway = (id) => {
        getGroupData();
        navigation.navigate('GroupChat', { id: id });
    }
    useEffect(() => {
        if (!checkAuth()) {
            navigation.navigate('Login');
        } else {
            getGroupData();
        }
    }, []);

    getGroupData();

    if (!fontsLoaded) {
        return <View></View>;
    }
    return (
        <ScrollView style={{ width: "100%", height: '100%', backgroundColor: 'white' }}>
            <View style={appStyles.navbar}>
                <Image source={require("../resources/activelyLogo.jpg")} style={{ width: 100, height: 30, marginLeft: 12, marginTop: 5 }} />
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '40%', marginRight: 12, }}>
                    <Pressable style={[appStyles.genericShadow, appStyles.smallButton]} onPress={() => navigation.navigate('CreateGroup')}>
                        <Text style={{
                            fontFamily: 'OpenSans_400Regular', fontSize: 14, color: '#262626',
                        }} >New Group</Text>
                    </Pressable>
                    <Pressable style={[appStyles.genericShadow, appStyles.smallButton]} onPress={() => { setShowPopUp(true); }}>
                        <Text style={{
                            fontFamily: 'OpenSans_400Regular', fontSize: 14, color: '#262626',
                        }} >Join</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.container}>
                {groups.map((group) => {
                    return (
                        <GroupPopUp nav={navigateAway} group={group} key={`${uuidv4()}`} />
                    )
                })}
            </View>
            {/* <Button title="Create Group" onPress={() => navigation.navigate('CreateGroup')} /> */}
            {(showPopUp) ? <JoinPopUp setShowPopUp={setShowPopUp} navigateAway={navigateAway} refreshGroups={getGroupData} /> : null}
            {/* <Button onPress={() => {
                AsyncStorage.setItem('token', 'Error').then(() => {
                    navigation.navigate('Login');
                })
            }} title="Logout" /> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    navbar: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
});


export default Groups;