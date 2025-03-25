import { Text, View, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import HomeScreen from "./Screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./Navigation/TabNavigation";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      {isLoggedIn ? <TabNavigation /> : <HomeScreen onLogin={handleLogin} />}
    </View>
  );
}
