import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View, Image, StyleSheet, Pressable } from 'react-native';
import API_CALL from '../constants/service.js';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkAuth } from '../utils/authUtils.js';
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

function Login({ navigation }) {
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

    //check if font is loaded

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const redirect = async (res) => {
        if (res.data.user) {
            setUserName('');
            setPassword('');
            try {
                await AsyncStorage.setItem('token', res.data.token);
                navigation.navigate('Home');
            } catch (e) {
                alert('Sorry Data Not Found');
            }
        } else {
            alert('Sorry Data Not Found');
        };
    }

    const submitButtonPressed = async () => {
        if (username === '' || password === '') {
            alert('Please enter username and password');
        } else {
            const user = {
                email: username,
                password: password
            }
            axios.post(API_CALL.login, user)
                .then(res => redirect(res))
        }
    }
    const auth = async () => {
        const auth = await checkAuth();
        if (auth) {
            navigation.navigate('Home');
        }
    }
    useEffect(() => {
        auth();
    }, []);

    if (!fontsLoaded) {
        return <View></View>;;
    }

    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <Image source={require("../resources/activelyLogo.jpg")} style={{ width: 180, height: 55 }} />
                <View>
                    <Text style={{ fontFamily: 'OpenSans_600SemiBold', fontSize: 20, marginBottom: 10 }}>
                        Login
                    </Text>
                    <TextInput
                        style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14 }]}
                        placeholder="Email"
                        autoCapitalize='none'
                        onChangeText={newText => setUserName(newText)}
                        defaultValue={username}
                    />
                    <TextInput
                        style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14 }]}
                        placeholder="Password"
                        autoCapitalize='none'
                        onChangeText={newText => setPassword(newText)}
                        defaultValue={password}
                        secureTextEntry={true}
                    />

                    <Pressable style={[appStyles.bigButton, appStyles.genericShadow]} onPress={submitButtonPressed}>
                        <Text style={{
                            fontFamily: 'OpenSans_400Regular', fontSize: 14, color: '#262626',
                        }} >Login</Text>
                    </Pressable>
                </View>
                <View style={{ height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'OpenSans_300Light', fontSize: 14, color: '#262626' }}>Don't have an account?</Text>
                    <View style={[appStyles.genericShadow, appStyles.smallButton]}>
                        <Text style={{ color: '#262626', }} onPress={() => navigation.navigate('Join')}>Join</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    container2: {
        width: '100%',
        height: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    box: {
        backgroundColor: "#61dafb",
        width: 80,
        height: 80,
        borderRadius: 4,
    },
});


export default Login;