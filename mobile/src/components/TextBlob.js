import { Text, View, Image, StyleSheet, TouchableHighlight } from 'react-native';

function GroupPopUp(props) {
    const { user, message } = props;
    return (
        <TouchableHighlight onPress={clicked} underlayColor='lightgray'>
            <View style={styles.container}>
                <Image source={{ uri: icon }} style={{ width: 45, height: 45, borderRadius: '50%' }} />
                <View style={styles.textContainer}>
                    <Text style={{ fontSize: 18 }}>{name}</Text>
                    <Text>{mostRecentMessage}</Text>
                </View>
            </View >
        </TouchableHighlight>
    );
}

export default GroupPopUp;
