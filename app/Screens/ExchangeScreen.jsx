import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../../firebaseConfig";

export default function ExchangeScreen() {
  const db = getFirestore(app);
  const [userTitle, setUserTitle] = useState("");
  const [userPrice, setUserPrice] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [filterByCategory, setFilterByCategory] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Coupons"), (snapshot) => {
      const couponsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoupons(couponsList);
    });

    return () => unsubscribe();
  }, []);

  const filterCoupons = () => {
    let filtered;
    if (filterByCategory) {
      filtered = coupons.filter(
        (coupon) =>
          coupon.category.toLowerCase() === userCategory.toLowerCase() &&
          coupon.title.toLowerCase() !== userTitle.toLowerCase()
      );
    } else {
      filtered = coupons.filter(
        (coupon) =>
          Math.abs(coupon.price - parseInt(userPrice)) === 0 &&
          coupon.title.toLowerCase() !== userTitle.toLowerCase()
      );
    }
    setFilteredCoupons(filtered);
  };

  const handleSubmit = () => {
    if (userTitle && userPrice && userCategory) {
      setSubmitted(true);
      filterCoupons();
    }
  };

  useEffect(() => {
    if (submitted) {
      filterCoupons();
    }
  }, [filterByCategory]);

  const handleClear = () => {
    setUserTitle("");
    setUserPrice("");
    setUserCategory("");
    setFilteredCoupons([]);
    setSubmitted(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="px-4 py-4 bg-purple-600 shadow-lg">
          <Text className="text-white text-2xl font-bold">
            Exchange Coupons
          </Text>
        </View>

        {/* Input Fields */}
        <View className="px-4 mt-4">
          <Text className="text-lg font-bold">Find a Coupon to Swap</Text>

          <TextInput
            placeholder="Coupon Title"
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-md mt-2"
            value={userTitle}
            onChangeText={setUserTitle}
          />

          <TextInput
            placeholder="Price"
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-md mt-2"
            value={userPrice}
            onChangeText={setUserPrice}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Category (e.g., Food, Fashion)"
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-md mt-2"
            value={userCategory}
            onChangeText={setUserCategory}
          />

          <View className="flex-row mt-4 space-x-2">
            <TouchableOpacity
              className="flex-1 bg-green-600 py-3 rounded-lg"
              onPress={handleSubmit}
            >
              <Text className="text-white text-center font-bold">
                Search for Swap
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-red-600 py-3 rounded-lg"
              onPress={handleClear}
            >
              <Text className="text-white text-center font-bold">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Display Results */}
        {submitted && (
          <View className="px-4 mt-6">
            <View className="border-b border-gray-300 my-4" />

            {/* Entered Coupon */}
            <Text className="text-lg font-bold text-indigo-700 mb-2">
              Your Entered Coupon:
            </Text>
            <View className="bg-white shadow-md rounded-lg p-4 mb-3 border border-gray-200">
              <Text className="font-semibold text-lg text-gray-800">
                {userTitle}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Category: {userCategory}
              </Text>
              <Text className="text-sm font-bold text-green-600 mt-1">
                Price: ${userPrice}
              </Text>
            </View>

            <View className="border-b border-gray-300 my-4" />

            {/* Filter Toggle Buttons */}
            <View className="flex-row justify-between items-center my-3">
              <TouchableOpacity
                className={`py-2 px-4 rounded-lg ${
                  filterByCategory ? "bg-blue-600" : "bg-gray-400"
                }`}
                onPress={() => setFilterByCategory(true)}
              >
                <Text className="text-white font-bold">Filter by Category</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`py-2 px-4 rounded-lg ${
                  !filterByCategory ? "bg-blue-600" : "bg-gray-400"
                }`}
                onPress={() => setFilterByCategory(false)}
              >
                <Text className="text-white font-bold">Filter by Price</Text>
              </TouchableOpacity>
            </View>

            {/* Available Coupons List */}
            <Text className="text-lg font-bold text-indigo-700 mt-4">
              Available Coupons to Swap ({filteredCoupons.length} Found)
            </Text>

            <FlatList
              data={filteredCoupons}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity className="bg-white shadow-md rounded-lg p-4 mb-3 border border-gray-200">
                  <Text className="font-semibold text-lg text-gray-800">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    Category: {item.category}
                  </Text>
                  <Text className="text-sm font-bold text-green-600 mt-1">
                    Price: ${item.price}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
