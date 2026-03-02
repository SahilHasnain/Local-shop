import { api } from "@/lib/api";
import { CATEGORIES, CONDITIONS, ProductCondition } from "@/lib/types";
import { generateEditCode, storeEditCode } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PostScreen() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<ProductCondition>("good");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Limit Reached", "You can upload maximum 5 images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 5) {
      Alert.alert("Limit Reached", "You can upload maximum 5 images");
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (images.length === 0) {
      Alert.alert("Error", "Please add at least one image");
      return;
    }
    if (!price || isNaN(Number(price))) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }
    if (!sellerName.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (!sellerPhone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Please enter your location");
      return;
    }

    setLoading(true);

    try {
      // Upload images
      const imageIds = await api.uploadImages(images);

      // Generate edit code
      const editCode = generateEditCode();

      // Create product
      const product = await api.createProduct({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        condition,
        category,
        images: imageIds,
        seller_name: sellerName.trim(),
        seller_phone: sellerPhone.trim(),
        location: location.trim(),
        status: "available",
        edit_code: editCode,
      });

      // Store edit code locally (non-critical)
      try {
        await storeEditCode(product.$id, editCode);
      } catch (error) {
        console.warn("Could not store edit code locally:", error);
      }

      // Show success with edit code
      Alert.alert(
        "Success!",
        `Your product is now live!\n\nEdit Code: ${editCode}\n\nSave this code to mark your item as sold later.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setImages([]);
              setTitle("");
              setDescription("");
              setPrice("");
              setCondition("good");
              setCategory(CATEGORIES[0]);
              setSellerName("");
              setSellerPhone("");
              setLocation("");

              // Navigate to browse
              router.push("/(tabs)");
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error creating product:", error);
      Alert.alert("Error", "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          {/* Images */}
          <Text className="text-lg font-semibold mb-3">Photos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            {images.map((uri, index) => (
              <View key={index} className="mr-3 relative">
                <Image source={{ uri }} className="w-24 h-24 rounded-lg" />
                <TouchableOpacity
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 5 && (
              <>
                <TouchableOpacity
                  className="w-24 h-24 bg-gray-200 rounded-lg justify-center items-center mr-3"
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={32} color="#9ca3af" />
                  <Text className="text-xs text-gray-500 mt-1">Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-24 h-24 bg-gray-200 rounded-lg justify-center items-center"
                  onPress={pickImage}
                >
                  <Ionicons name="images" size={32} color="#9ca3af" />
                  <Text className="text-xs text-gray-500 mt-1">Gallery</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>

          {/* Title */}
          <Text className="text-base font-semibold mb-2">Title *</Text>
          <TextInput
            className="bg-white p-3 rounded-lg mb-4 text-base"
            placeholder="e.g., iPhone 13 Pro Max"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <Text className="text-base font-semibold mb-2">Description</Text>
          <TextInput
            className="bg-white p-3 rounded-lg mb-4 text-base"
            placeholder="Describe your item..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Price */}
          <Text className="text-base font-semibold mb-2">Price (₹) *</Text>
          <TextInput
            className="bg-white p-3 rounded-lg mb-4 text-base"
            placeholder="e.g., 50000"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          {/* Condition */}
          <Text className="text-base font-semibold mb-2">Condition *</Text>
          <View className="bg-white rounded-lg mb-4 overflow-hidden">
            <Picker selectedValue={condition} onValueChange={setCondition}>
              {CONDITIONS.map((c) => (
                <Picker.Item key={c.value} label={c.label} value={c.value} />
              ))}
            </Picker>
          </View>

          {/* Category */}
          <Text className="text-base font-semibold mb-2">Category *</Text>
          <View className="bg-white rounded-lg mb-4 overflow-hidden">
            <Picker selectedValue={category} onValueChange={setCategory}>
              {CATEGORIES.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          {/* Seller Info */}
          <Text className="text-lg font-semibold mb-3 mt-2">
            Your Contact Info
          </Text>

          <Text className="text-base font-semibold mb-2">Name *</Text>
          <TextInput
            className="bg-white p-3 rounded-lg mb-4 text-base"
            placeholder="Your name"
            value={sellerName}
            onChangeText={setSellerName}
          />

          <Text className="text-base font-semibold mb-2">Phone Number *</Text>
          <TextInput
            className="bg-white p-3 rounded-lg mb-4 text-base"
            placeholder="e.g., 9876543210"
            value={sellerPhone}
            onChangeText={setSellerPhone}
            keyboardType="phone-pad"
          />

          <Text className="text-base font-semibold mb-2">Location *</Text>
          <TextInput
            className="bg-white p-3 rounded-lg mb-6 text-base"
            placeholder="e.g., Gandey, Giridih"
            value={location}
            onChangeText={setLocation}
          />

          {/* Submit Button */}
          <TouchableOpacity
            className={`p-4 rounded-lg items-center ${loading ? "bg-gray-400" : "bg-blue-500"}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Post Listing
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
