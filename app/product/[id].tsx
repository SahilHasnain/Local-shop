import { api } from "@/lib/api";
import { Product } from "@/lib/types";
import { formatDate, formatPrice, getEditCode } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMarkSold, setShowMarkSold] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [hasEditCode, setHasEditCode] = useState(false);

  useEffect(() => {
    loadProduct();
    checkEditCode();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await api.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      Alert.alert("Error", "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const checkEditCode = async () => {
    const code = await getEditCode(id);
    setHasEditCode(!!code);
    if (code) setEditCode(code);
  };

  const handleCall = () => {
    if (product) {
      Linking.openURL(`tel:${product.seller_phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (product) {
      const message = `Hi, I'm interested in your ${product.title} listed for ${formatPrice(product.price)}`;
      Linking.openURL(
        `whatsapp://send?phone=91${product.seller_phone}&text=${encodeURIComponent(message)}`,
      );
    }
  };

  const handleMarkAsSold = async () => {
    if (!editCode.trim()) {
      Alert.alert("Error", "Please enter your edit code");
      return;
    }

    try {
      await api.markAsSold(id, editCode.trim());
      Alert.alert("Success", "Product marked as sold!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Invalid edit code or failed to update");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Product not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        {/* Image Carousel */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {product.images.map((imageId, index) => (
              <Image
                key={index}
                source={{ uri: api.getImageUrl(imageId) }}
                style={{ width, height: 300 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Indicator */}
          {product.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {product.images.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </View>
          )}

          {/* Status Badge */}
          {product.status === "sold" && (
            <View className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded-full">
              <Text className="text-white font-semibold">SOLD</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="p-4">
          <Text className="text-2xl font-bold mb-2">{product.title}</Text>
          <Text className="text-3xl font-bold text-blue-600 mb-4">
            {formatPrice(product.price)}
          </Text>

          {/* Details */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Condition</Text>
              <Text className="font-semibold capitalize">
                {product.condition}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Category</Text>
              <Text className="font-semibold">{product.category}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Location</Text>
              <Text className="font-semibold">{product.location}</Text>
            </View>
          </View>

          {/* Description */}
          {product.description && (
            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">Description</Text>
              <Text className="text-gray-700 leading-6">
                {product.description}
              </Text>
            </View>
          )}

          {/* Seller Info */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="text-lg font-semibold mb-2">
              Seller Information
            </Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <Text className="ml-2 text-gray-700">{product.seller_name}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="call-outline" size={20} color="#6b7280" />
              <Text className="ml-2 text-gray-700">{product.seller_phone}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color="#6b7280" />
              <Text className="ml-2 text-gray-500">
                Posted {formatDate(product.$createdAt)}
              </Text>
            </View>
          </View>

          {/* Mark as Sold Section */}
          {hasEditCode && product.status === "available" && (
            <View className="mb-4">
              {!showMarkSold ? (
                <TouchableOpacity
                  className="bg-orange-500 p-4 rounded-lg items-center"
                  onPress={() => setShowMarkSold(true)}
                >
                  <Text className="text-white font-semibold text-base">
                    Mark as Sold
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="bg-gray-50 p-4 rounded-lg">
                  <Text className="font-semibold mb-2">Enter Edit Code</Text>
                  <TextInput
                    className="bg-white p-3 rounded-lg mb-3 text-base"
                    placeholder="Enter your edit code"
                    value={editCode}
                    onChangeText={setEditCode}
                    autoCapitalize="characters"
                  />
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 bg-gray-300 p-3 rounded-lg items-center"
                      onPress={() => setShowMarkSold(false)}
                    >
                      <Text className="font-semibold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-orange-500 p-3 rounded-lg items-center"
                      onPress={handleMarkAsSold}
                    >
                      <Text className="text-white font-semibold">Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Contact Buttons */}
      {product.status === "available" && (
        <View className="p-4 border-t border-gray-200 flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-blue-500 p-4 rounded-lg flex-row items-center justify-center"
            onPress={handleCall}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text className="text-white font-semibold ml-2 text-base">
              Call
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-green-500 p-4 rounded-lg flex-row items-center justify-center"
            onPress={handleWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text className="text-white font-semibold ml-2 text-base">
              WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
