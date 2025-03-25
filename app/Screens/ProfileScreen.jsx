import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

export default function ProfileScreen() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    couponsBought: 12,
    couponsSold: 5,
  };

  return (
    <View className="flex-1 items-center bg-gray-100 p-6">
      {/* Profile Image Container */}
      <View className="mt-16 mb-6">
        <View className="relative">
          <Image
            source={require("../../assets/images/profile.webp")}
            className="w-32 h-32 rounded-full shadow-lg border-4 border-white bg-gray-200"
          />
          {/* Online Indicator */}
          <View className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border border-white" />
        </View>
      </View>

      {/* User Info */}
      <View className="items-center mb-6">
        <Text className="text-3xl font-bold text-gray-900">{user.name}</Text>
        <Text className="text-lg text-gray-500">{user.email}</Text>
      </View>

      {/* Stats Container */}
      <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <View className="flex flex-row justify-between mb-4">
          <View className="items-center">
            <Text className="text-lg font-semibold text-blue-600">Bought</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {user.couponsBought}
            </Text>
          </View>
          <View className="border-r border-l border-gray-300 h-10 mx-4" />
          <View className="items-center">
            <Text className="text-lg font-semibold text-purple-600">Sold</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {user.couponsSold}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mt-4">
          <Text className="text-sm text-gray-500 mb-1">Activity Progress</Text>
          <View className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <View
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-3"
              style={{
                width: `${Math.min(
                  (user.couponsBought + user.couponsSold) * 5,
                  100
                )}%`,
              }}
            />
          </View>
        </View>
      </View>

      {/* User Actions */}
      <View className="mt-8 w-full max-w-sm">
        <TouchableOpacity className="bg-blue-600 py-3 rounded-full shadow-md mb-4">
          <Text className="text-white text-lg font-semibold text-center">
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-purple-600 py-3 rounded-full shadow-md">
          <Text className="text-white text-lg font-semibold text-center">
            View History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
