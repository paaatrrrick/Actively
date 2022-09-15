import React, { useRoute, useState, useEffect } from "react";
import { getData } from '../utils/authUtils.js';
import API_CALL from '../constants/service.js';
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Pressable, Image } from 'react-native';
import io from "socket.io-client";
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



let socket;
function GroupChat({ route, navigation }) {
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
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [counter, setCounter] = useState(0);
    const [groupCode, setGroupCode] = useState('');
    const groupId = route.params.id;

    const modifyMessage = (inputMessages, inputUsers) => {
        let modifiedMessages = [];
        for (let i = 0; i < inputMessages.length; i++) {
            let message = inputMessages[i];
            let user = inputUsers.find(user => user._id === message.sender);
            let modifiedMessage = {
                text: message.message,
                senderFirst: user.firstName,
                senderLast: user.lastName,
                picture: user.profileImg,
                userId: user._id
            }
            modifiedMessages.push(modifiedMessage);
        }
        return modifiedMessages;
    }

    useEffect(() => {
        socket = io(API_CALL.ENDPOINT);
        getGroupData();
        return () => {
            socket.emit("abortTheRoom");
            socket.off();
        };
    }, [API_CALL.ENDPOINT]);

    const getGroupData = async () => {
        const token = await getData();
        if (token !== 'Error') {
            const response = await fetch(`${API_CALL.groupMessages}/${route.params.id}`, { headers: { "x-access'token": token } })
            const data = await response.json();
            const newMessages = modifyMessage(data.messages, data.usersInGroup);
            setMessages(newMessages);
            setCounter(counter + 1);
            setGroupCode(data.groupCode);
            const userId = data.userId;
            setUserId(userId);
            await socket.emit("join", { userId, groupId });
            const users = data.usersInGroup;
            socket.on("message", myProps => {
                const modMessage = { sender: myProps.user, message: myProps.message };
                const newMessages = modifyMessage([modMessage], users);
                setMessages(messages => [...messages, ...newMessages]);
            });
        }
    }

    const sendMessage = () => {
        if (message && message.length > 0) {
            const currDate = new Date();
            socket.emit("sendMessage", { message, currDate });
            setMessage("");
        }
    };
    if (!fontsLoaded) {
        return <View></View>;
    }
    return (
        <View style={{ width: "100%", height: '100%', backgroundColor: 'white', display: 'flex', alignItems: 'center' }} >
            <View style={[appStyles.navbar, { backgroundColor: 'white' }]}>
                <Image source={require("../resources/activelyLogo.jpg")} style={{ width: 100, height: 30, marginLeft: 12, marginTop: 5 }} />
                <Text style={{ fontFamily: 'OpenSans_600SemiBold', fontSize: 12, color: '#262626', marginLeft: 20 }}>Join Code: {groupCode}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '40%', marginRight: 12, }}>
                    <Pressable style={[appStyles.genericShadow, { marginLeft: 80, borderWidth: 1, padding: 6, borderColor: '#262626', borderRadius: 10 }]} onPress={() => { navigation.navigate('Home'); }}>
                        <Text style={{
                            fontFamily: 'OpenSans_400Regular', fontSize: 14, color: '#262626',
                        }} >Go Back</Text>
                    </Pressable>
                </View>
            </View>
            <ScrollView style={{ width: '100%', height: '40%' }} >
                {messages.map((message, index) => {
                    return (
                        <View key={index} style={{
                            width: '100%', display: 'flex', flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: message.userId === userId ? 'flex-end' : 'flex-start',
                            marginBottom: 10
                        }}>
                            <View style={{
                                display: 'flex',
                                alignItems: message.userId === userId ? 'flex-end' : 'flex-start',
                                justifyContent: 'center',
                                width: '100%',
                                marginRight: message.userId === userId ? 15 : 0,
                                marginLeft: message.userId === userId ? 0 : 15,
                            }}>
                                <Text style={{ marginBottom: 2, fontSize: 10, fontFamily: 'OpenSans_300Light' }}>{message.senderFirst} {message.senderLast}</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', maxWidth: '60%', backgroundColor: '#80fbbd', borderRadius: 10, padding: 8, paddingTop: 5, paddingBottom: 5 }}>
                                    <Text style={{ color: '#262626', fontFamily: 'OpenSans_400Regular', }}>{message.text}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%', height: 50, marginBottom: '90%' }}>
                <TextInput
                    style={{
                        height: 40,
                        width: '80%',
                        borderColor: 'gray',
                        borderWidth: 1,
                        placeholderTextColor: 'gray',
                        borderRadius: 5,
                    }}
                    autoFocus={true}
                    onChangeText={text => setMessage(text)}
                    value={message}
                    placeholder="Type"
                />
                <Button
                    title="Send"
                    onPress={sendMessage}
                />
            </View>

        </View >

    );
}

export default GroupChat;