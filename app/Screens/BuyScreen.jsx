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
      const couponsList = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamp to JavaScript Date if expiryDate is a Timestamp
        if (
          data.expiryDate &&
          typeof data.expiryDate === "object" &&
          "toDate" in data.expiryDate
        ) {
          data.expiryDate = data.expiryDate.toDate();
        }
        return {
          id: doc.id,
          ...data,
        };
      });
      setCoupons(couponsList);
      setFilteredCoupons(couponsList);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    "Food",
    "Clothes",
    "Travel",
    "Electronics",
    "Online Gaming",
    "Beauty",
    "Health & Wellness",
    "Others",
  ];

  const applyFilters = () => {
    let filtered = [...coupons];

    // Apply filters
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

    // Group coupons by expiration date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const oneWeek = new Date(today);
    oneWeek.setDate(today.getDate() + 7);
    oneWeek.setHours(0, 0, 0, 0);

    const oneMonth = new Date(today);
    oneMonth.setDate(today.getDate() + 30);
    oneMonth.setHours(0, 0, 0, 0);

    const groupedCoupons = {
      expiringToday: [],
      expiringTomorrow: [],
      expiringWithinOneWeek: [],
      expiringWithinOneMonth: [],
      expired: [],
    };

    filtered.forEach((coupon) => {
      if (!coupon.expiryDate) {
        // If expiryDate is missing, place it in expired section as a fallback
        groupedCoupons.expired.push(coupon);
        return;
      }

      const expiry = new Date(coupon.expiryDate);
      expiry.setHours(0, 0, 0, 0); // Reset time for comparison

      if (expiry < today) {
        groupedCoupons.expired.push(coupon);
      } else if (expiry.getTime() === today.getTime()) {
        groupedCoupons.expiringToday.push(coupon);
      } else if (expiry.getTime() === tomorrow.getTime()) {
        groupedCoupons.expiringTomorrow.push(coupon);
      } else if (expiry <= oneWeek) {
        groupedCoupons.expiringWithinOneWeek.push(coupon);
      } else if (expiry <= oneMonth) {
        groupedCoupons.expiringWithinOneMonth.push(coupon);
      } else {
        // Coupons expiring after one month are not shown as per requirement
      }
    });

    // Sort each section by expiryDate in ascending order
    Object.keys(groupedCoupons).forEach((key) => {
      groupedCoupons[key].sort((a, b) => a.expiryDate - b.expiryDate);
    });

    setFilteredCoupons(groupedCoupons);
  };

  useEffect(() => {
    applyFilters();
  }, [categoryFilter, priceFilter, discountFilter, searchText]);

  // Helper function to format the date for display
  const formatDate = (date) => {
    if (!date) return "N/A"; // Handle cases where expiryDate might be missing
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

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

      {/* Coupons List - Grouped by Expiry Date Ranges */}
      <ScrollView className="px-4 mt-4">
        {typeof filteredCoupons === "object" &&
        Object.keys(filteredCoupons).length === 0 ? (
          <Text className="text-center text-gray-500 mt-5">
            No coupons available.
          </Text>
        ) : (
          <>
            {/* Expiring Today */}
            {filteredCoupons.expiringToday?.length > 0 && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-indigo-700 mb-2">
                  Expiring Today
                </Text>
                {filteredCoupons.expiringToday.map((coupon) => (
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
                    <Text className="text-sm text-gray-500 mt-1">
                      Expires: {formatDate(coupon.expiryDate)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Expiring Tomorrow */}
            {filteredCoupons.expiringTomorrow?.length > 0 && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-indigo-700 mb-2">
                  Expiring Tomorrow
                </Text>
                {filteredCoupons.expiringTomorrow.map((coupon) => (
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
                    <Text className="text-sm text-gray-500 mt-1">
                      Expires: {formatDate(coupon.expiryDate)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Expiring Within One Week */}
            {filteredCoupons.expiringWithinOneWeek?.length > 0 && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-indigo-700 mb-2">
                  Expiring Within One Week
                </Text>
                {filteredCoupons.expiringWithinOneWeek.map((coupon) => (
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
                    <Text className="text-sm text-gray-500 mt-1">
                      Expires: {formatDate(coupon.expiryDate)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Expiring Within One Month */}
            {filteredCoupons.expiringWithinOneMonth?.length > 0 && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-indigo-700 mb-2">
                  Expiring Within One Month
                </Text>
                {filteredCoupons.expiringWithinOneMonth.map((coupon) => (
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
                    <Text className="text-sm text-gray-500 mt-1">
                      Expires: {formatDate(coupon.expiryDate)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Expired Coupons */}
            {filteredCoupons.expired?.length > 0 && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-indigo-700 mb-2">
                  Expired Coupons
                </Text>
                {filteredCoupons.expired.map((coupon) => (
                  <TouchableOpacity
                    key={coupon.id}
                    className="bg-gray-200 shadow-md rounded-lg p-4 mb-3 border border-gray-300 opacity-70"
                    onPress={() => setSelectedCoupon(coupon)}
                  >
                    <Text className="font-semibold text-lg text-gray-600">
                      {coupon.title}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {coupon.description}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      Expired: {formatDate(coupon.expiryDate)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
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
