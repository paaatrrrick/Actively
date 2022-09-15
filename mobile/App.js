import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Groups from './src/views/Groups.js';
import Login from './src/views/Login.js';
import Join from './src/views/Join.js';
import GroupChat from './src/views/GroupChat.js';
import CreateGroup from './src/views/CreateGroup.js';
import Settings from './src/views/Settings.js';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ title: 'Overview' }}>
        <Stack.Screen name="Home" component={Groups} options={{ title: 'Groups', headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="GroupChat" component={GroupChat} options={{ title: 'Group Chat', headerShown: false }} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ title: 'Create Group', headerShown: false }} />
        <Stack.Screen name="Join" component={Join} options={{ title: 'Join', headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ title: 'Join', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

