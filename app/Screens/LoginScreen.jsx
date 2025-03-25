import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const LoginScreen = ({ navigation }) => {
  const handleSignIn = () => {
    navigation.replace("TabNavigation");
  };

  const handleSignUp = () => {
    navigation.replace("TabNavigation");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-8">Login or Sign Up</Text>

      <TouchableOpacity
        className="bg-blue-500 px-8 py-3 rounded-full mb-4"
        onPress={handleSignIn}
      >
        <Text className="text-white text-lg font-semibold">Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-green-500 px-8 py-3 rounded-full"
        onPress={handleSignUp}
      >
        <Text className="text-white text-lg font-semibold">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
