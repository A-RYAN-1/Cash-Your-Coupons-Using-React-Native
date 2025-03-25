import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

export default function HomeScreen({ onLogin }) {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-[0.9]">
        <Image
          source={require("../../assets/images/loginScreen.jpg")}
          className="w-full h-[300px] object-cover"
        />
      </View>
      <View className="flex-[1.1] items-center justify-start px-6 pt-6 mt-08 rounded-t-10xl">
        <Text className="text-[30px] font-bold text-black">
          CASH YOUR COUPONS
        </Text>
        <Text className="text-[18px] text-gray-500 mt-2 text-center px-4">
          Buy and Sell Marketplace where you can sell unused coupons to make
          real money!
        </Text>
        <View className="flex flex-row items-center justify-center mt-10">
          <TouchableOpacity
            onPress={onLogin}
            className="mt-4 bg-blue-500 px-6 py-3 rounded-full mt-30"
          >
            <Text className="text-white text-center text-[18px] font-semibold">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
