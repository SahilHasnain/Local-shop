import { api } from "@/lib/api";
import { CATEGORIES, Product } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BrowseScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadProducts = async () => {
    try {
      const data = await api.getProducts(
        selectedCategory === "All" ? undefined : selectedCategory,
        searchQuery,
      );
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const handleSearch = () => {
    setLoading(true);
    loadProducts();
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="w-[48%] mb-4 bg-white rounded-lg overflow-hidden shadow-sm"
      onPress={() => router.push(`/product/${item.$id}`)}
    >
      <Image
        source={{ uri: api.getImageUrl(item.images[0]) }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="font-semibold text-base mb-1" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-blue-600 font-bold text-lg mb-1">
          {formatPrice(item.price)}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-500 text-xs">{item.location}</Text>
          <Text className="text-gray-400 text-xs">
            {formatDate(item.$createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white p-4 shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Category Filter */}
      <View className="bg-white px-4 py-2 border-b border-gray-200">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={["All", ...CATEGORIES]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedCategory === item ? "bg-blue-500" : "bg-gray-200"
              }`}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                className={`${
                  selectedCategory === item
                    ? "text-white font-semibold"
                    : "text-gray-700"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="cube-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 text-base">
              No products found
            </Text>
          </View>
        }
      />
    </View>
  );
}
