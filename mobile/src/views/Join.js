import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Image, View, TextInput, Text, Pressable } from 'react-native';
import { checkAuth } from '../utils/authUtils.js';
import { getData } from '../utils/authUtils.js';
import API_CALL from '../constants/service.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
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


function Join({ navigation }) {

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

    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");

    useEffect(() => {
        if (checkAuth() === true) {
            navigation.navigate('Home');
        }
    }, []);

    const Join = async () => {
        if (first === "" || last === "" || email === "" || password === "" || phone === "" || age === "") {
            alert("Please fill out all fields");
        } else {
            const response = await fetch(API_CALL.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state: 'Iowa',
                    city: 'Iowa City',
                    sports: ['Tennis'],
                    first: first,
                    last: last,
                    email: email,
                    password: password,
                    phone: phone,
                    age: age,
                    groups: [],
                }),
            });
            const res = await response.json();
            if (res === 'taken') {
                alert('sorry that email is already taken');
            } else {
                await AsyncStorage.setItem('token', res.token);
                navigation.navigate('Home');
            }
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <Image source={require("../resources/activelyLogo.jpg")} style={{ width: 180, height: 55, marginTop: -50, marginBottom: 40 }} />
            <Text style={{ fontFamily: 'OpenSans_600SemiBold', fontSize: 20, marginBottom: 10, width: '75%', textAlign: 'left' }}>
                Join Actively
            </Text>
            <View style={styles.container}>
                <TextInput
                    style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14, width: 140, marginRight: 5 }]}
                    placeholder="First Name"
                    onChangeText={newText => setFirst(newText)}
                    defaultValue={first}
                />
                <TextInput
                    style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14, width: 140, marginLeft: 5 }]}
                    placeholder="Last Name"
                    onChangeText={newText => setLast(newText)}
                    defaultValue={last}
                />
            </View>
            <View style={styles.container}>

                <TextInput
                    style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14, width: 140, marginRight: 5 }]}
                    placeholder="Email"
                    onChangeText={newText => setEmail(newText)}
                    defaultValue={email}
                />
                <TextInput
                    style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14, width: 140, marginLeft: 5 }]}
                    placeholder="Password"
                    onChangeText={newText => setPassword(newText)}
                    defaultValue={password}
                />
            </View>

            <View style={styles.container}>

                <TextInput
                    style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14, width: 140, marginRight: 5 }]}
                    placeholder="Phone"
                    onChangeText={newText => setPhone(newText)}
                    defaultValue={phone}
                />
                <TextInput
                    style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14, width: 140, marginLeft: 5 }]}
                    placeholder="Age"
                    onChangeText={newText => setAge(newText)}
                    defaultValue={age}
                />
            </View>
            <Pressable style={[appStyles.bigButton, appStyles.genericShadow]} onPress={Join}>
                <Text style={{
                    fontFamily: 'OpenSans_400Regular', fontSize: 14, color: '#262626',
                }} >Submit</Text>
            </Pressable>
            <View style={{ height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontFamily: 'OpenSans_300Light', fontSize: 14, color: '#262626' }}>Already Have an Account?</Text>
                <View style={[appStyles.genericShadow, appStyles.smallButton]}>
                    <Text style={{ color: '#262626', }} onPress={() => navigation.navigate('Login')}>Login</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default Join;