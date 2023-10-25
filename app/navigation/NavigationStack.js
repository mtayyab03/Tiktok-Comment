import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

//screens
import SplashScreen from "../screens/SplashScreen";

const Stack = createStackNavigator();

export default function NavigationStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerMode: "false" }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
    </Stack.Navigator>
  );
}
