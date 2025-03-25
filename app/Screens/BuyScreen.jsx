import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../../firebaseConfig";

export default function BuyScreen() {
  const db = getFirestore(app);
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [discountFilter, setDiscountFilter] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Coupons"), (snapshot) => {
      const couponsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoupons(couponsList);
      setFilteredCoupons(couponsList);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    "Food",
    "Clothes",
    "Fashion",
    "Travel",
    "Electronics",
    "Online Gaming",
    "Beauty",
    "Health & Wellness",
    "Entertainment",
    "Education",
    "Sports & Fitness",
    "Home & Living",
    "Automobile",
    "Others",
  ];

  const applyFilters = () => {
    let filtered = [...coupons];

    if (categoryFilter) {
      filtered = filtered.filter(
        (coupon) => coupon.category === categoryFilter
      );
    }

    if (priceFilter) {
      filtered = filtered.filter((coupon) => {
        const price = parseFloat(coupon.price);
        if (priceFilter === "Low") return price < 100;
        if (priceFilter === "Medium") return price >= 100 && price <= 500;
        if (priceFilter === "High") return price > 500;
      });
    }

    if (discountFilter) {
      filtered = filtered.filter((coupon) => {
        const discount = parseFloat(coupon.discount);
        if (discountFilter === "10%+") return discount >= 10;
        if (discountFilter === "20%+") return discount >= 20;
        if (discountFilter === "50%+") return discount >= 50;
      });
    }

    if (searchText) {
      filtered = filtered.filter((coupon) =>
        coupon.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredCoupons(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [categoryFilter, priceFilter, discountFilter, searchText]);

  const categorizedCoupons = filteredCoupons.reduce((acc, coupon) => {
    if (!acc[coupon.category]) acc[coupon.category] = [];
    acc[coupon.category].push(coupon);
    return acc;
  }, {});

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 py-4 bg-indigo-600 shadow-lg">
        <Text className="text-white text-2xl font-bold">Browse Coupons</Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 mt-4">
        <TextInput
          placeholder="Search for coupons..."
          className="border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-md"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      {/* Filter Button */}
      <View className="px-4 mt-4">
        <TouchableOpacity
          className="bg-purple-600 py-3 rounded-lg"
          onPress={() => setFilterModalVisible(true)}
        >
          <Text className="text-white text-center font-bold">
            Adjust Filters
          </Text>
        </TouchableOpacity>
      </View>

      {/* Coupons List - Grouped by Category */}
      <ScrollView className="px-4 mt-4">
        {Object.keys(categorizedCoupons).length === 0 ? (
          <Text className="text-center text-gray-500 mt-5">
            No coupons available.
          </Text>
        ) : (
          Object.entries(categorizedCoupons).map(([category, coupons]) => (
            <View key={category} className="mb-6">
              <Text className="text-xl font-bold text-indigo-700 mb-2">
                {category}
              </Text>
              {coupons.map((coupon) => (
                <TouchableOpacity
                  key={coupon.id}
                  className="bg-white shadow-md rounded-lg p-4 mb-3 border border-gray-200"
                  onPress={() => setSelectedCoupon(coupon)}
                >
                  <Text className="font-semibold text-lg text-gray-800">
                    {coupon.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {coupon.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View className="absolute top-20 left-5 right-5 bg-white rounded-lg p-6 shadow-lg border border-gray-300">
          <Text className="text-xl font-bold">Filters</Text>

          {/* Category Filter */}
          <Text className="mt-4 font-semibold">Category</Text>
          <ScrollView horizontal className="flex-row mt-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`px-4 py-2 mr-2 rounded-lg ${
                  categoryFilter === category ? "bg-indigo-600" : "bg-gray-300"
                }`}
                onPress={() =>
                  setCategoryFilter(categoryFilter === category ? "" : category)
                }
              >
                <Text className="text-white">{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Price Filter */}
          <Text className="mt-4 font-semibold">Price</Text>
          <ScrollView horizontal className="flex-row mt-2">
            {["Low", "Medium", "High"].map((range) => (
              <TouchableOpacity
                key={range}
                className={`px-4 py-2 mr-2 rounded-lg ${
                  priceFilter === range ? "bg-green-600" : "bg-gray-300"
                }`}
                onPress={() =>
                  setPriceFilter(priceFilter === range ? "" : range)
                }
              >
                <Text className="text-white">{range}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Discount Filter */}
          <Text className="mt-4 font-semibold">Discount</Text>
          <ScrollView horizontal className="flex-row mt-2">
            {["10%+", "20%+", "50%+"].map((discount) => (
              <TouchableOpacity
                key={discount}
                className={`px-4 py-2 mr-2 rounded-lg ${
                  discountFilter === discount ? "bg-red-500" : "bg-gray-300"
                }`}
                onPress={() =>
                  setDiscountFilter(discountFilter === discount ? "" : discount)
                }
              >
                <Text className="text-white">{discount}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            className="mt-6 bg-red-500 py-3 rounded-lg"
            onPress={() => setFilterModalVisible(false)}
          >
            <Text className="text-white text-center font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
