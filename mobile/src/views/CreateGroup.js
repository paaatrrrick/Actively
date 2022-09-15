import React, { useState } from 'react';
import { Button, Text, TextInput, View, Image, StyleSheet, Pressable } from 'react-native';
import API_CALL from '../constants/service.js';
import { getData } from '../utils/authUtils.js';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import appStyles from '../constants/stylesheets.js';
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

    const [image, setImage] = useState("https://ucarecdn.com/3d8947a6-2f21-426b-8a24-82e38a284d07/");
    const [displayImage, setDisplayImage] = useState(null);
    const [name, setName] = useState("");

    const submit = async () => {
        if (name === "") {
            alert("Please enter a group name");
        } else {
            const token = await getData();
            if (token !== 'Error') {
                const data = {
                    name: name,
                    description: "Description",
                    sportType: "Tennis",
                    bannerImg: "https://ucarecdn.com/573c9553-615e-4ec9-a9e7-8f90ea43f0ad/",
                    iconImg: image,
                    usualLocation: "None",
                }
                const response = await fetch(API_CALL.createGroup, {

                    method: 'POST',
                    headers: {
                        "x-access'token": token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),

                })
                const myData = await response.json();
                navigation.navigate('GroupChat', { id: myData.id });
            }
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setDisplayImage(result.uri);
            uploadPhoto(result.uri);
        }
    };

    const uploadPhoto = async (photo) => {
        const url = 'https://upload.uploadcare.com/base/';
        let body = new FormData();
        body.append('file', {
            name: 'CoolPhoto',
            type: 'image/jpg',
            uri: photo,
        });
        body.append('UPLOADCARE_PUB_KEY', 'f4e41243b01f35b47391');
        body.append('UPLOADCARE_STORE', '1');

        try {
            let response = await axios.post(url, body, { timeout: 20000 });
            const imageUrl = `https://ucarecdn.com/${response.data.file}/`;
            console.log(imageUrl);
            setImage(imageUrl);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    if (!fontsLoaded) {
        return <View></View>;;
    }

    return (
        <View style={styles.container}>
            <Pressable style={[appStyles.genericShadow, appStyles.smallButton, {
                position: 'absolute',
                top: 30,
                left: 15,
            }]} onPress={() => { navigation.navigate('Home'); }}>
                <Text style={{
                    fontFamily: 'OpenSans_400Regular', fontSize: 14, color: '#262626',
                }} >Go Back</Text>
            </Pressable>
            <Text style={{ fontFamily: 'OpenSans_400Regular', fontSize: 20, marginBottom: 10 }}>
                What's your groups name?
            </Text>
            <TextInput
                style={[appStyles.input, { fontFamily: 'OpenSans_300Light', fontSize: 14 }]}
                placeholder="Group Name"
                onChangeText={newText => setName(newText)}
                defaultValue={name}
            />
            <View style={{ display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <Button title="Optionally, upload a profile image" onPress={pickImage} />
                {/* {displayImage && <Image source={{ uri: displayImage }} style={{ width: 75, height: 75, borderRadius: '100%' }} />} */}
                {displayImage && <Text style={{ fontFamily: 'OpenSans_400Regular', fontSize: 14, marginBottom: 10 }}>
                    Image Successfully Uploaded
                </Text>}
            </View>
            <Pressable style={[appStyles.bigButton, appStyles.genericShadow]} onPress={submit}>
                <Text style={{
                    fontFamily: 'OpenSans_400Regular', fontSize: 14, color: '#262626',
                }} >Submit</Text>
            </Pressable>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
