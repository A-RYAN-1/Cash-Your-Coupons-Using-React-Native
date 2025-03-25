import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";

export default function SellScreen() {
  const db = getFirestore(app);
  const [coupons, setCoupons] = useState([]);
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

  useEffect(() => {
    getCoupons();
  }, []);

  const getCoupons = async () => {
    const querySnapshot = await getDocs(collection(db, "Coupons"));
    const couponsList = querySnapshot.docs.map((doc) => doc.data());
    setCoupons(couponsList);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 py-4 bg-blue-600">
        <Text className="text-white text-2xl font-bold">Sell Your Coupon</Text>
      </View>

      <ScrollView className="px-4 mt-4">
        <Formik
          initialValues={{
            title: "",
            category: "",
            price: "",
            percentageOff: "",
            contact: "",
            description: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            if (!values.title || !values.category || !values.price) {
              Alert.alert("Error", "Please fill in all required fields.");
              return;
            }

            try {
              await addDoc(collection(db, "Coupons"), {
                ...values,
                price: parseFloat(values.price),
              });

              // Reset form BEFORE showing alert
              resetForm();

              Alert.alert("Success", "Coupon submitted successfully!");
            } catch (error) {
              console.error("Error adding document: ", error);
              Alert.alert("Error", "Failed to submit. Please try again.");
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
          }) => (
            <View className="bg-white shadow-md rounded-lg p-5 border border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Title
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4 text-lg bg-white"
                placeholder="Enter the name of the brand"
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
              />

              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Category
              </Text>
              <View className="border border-gray-300 rounded-lg bg-white mb-4">
                <Picker
                  selectedValue={values.category}
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                >
                  <Picker.Item
                    label="Select a category"
                    value=""
                    enabled={false}
                  />
                  {categories.map((category, index) => (
                    <Picker.Item
                      key={index}
                      label={category}
                      value={category}
                    />
                  ))}
                </Picker>
              </View>

              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Price
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4 text-lg bg-white"
                placeholder="Enter price at which you want to sell"
                value={values.price}
                onChangeText={handleChange("price")}
                onBlur={handleBlur("price")}
                keyboardType="numeric"
              />

              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Percentage Off on Coupon
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4 text-lg bg-white"
                placeholder="Enter discount percentage"
                value={values.percentageOff}
                onChangeText={handleChange("percentageOff")}
                onBlur={handleBlur("percentageOff")}
                keyboardType="numeric"
              />

              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Contact Details
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4 text-lg bg-white"
                placeholder="Enter contact details"
                value={values.contact}
                onChangeText={handleChange("contact")}
                onBlur={handleBlur("contact")}
              />

              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4 text-lg bg-white h-24"
                placeholder="Enter coupon details"
                value={values.description}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity
                className="bg-blue-600 py-3 rounded-lg mt-4"
                onPress={handleSubmit}
              >
                <Text className="text-white text-xl font-bold text-center">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}
