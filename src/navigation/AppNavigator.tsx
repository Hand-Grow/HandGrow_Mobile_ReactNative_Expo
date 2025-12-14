import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Import other screen.
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Home Page' }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: 'Detail Screen' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
