import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Product } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyListingsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUserProducts = async () => {
    try {
      const authenticated = await auth.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const data = await api.getUserProducts();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error loading user products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUserProducts();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadUserProducts();
  };

  const handleMarkAsSold = async (product: Product) => {
    Alert.alert("Mark as Sold", `Mark "${product.title}" as sold?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark Sold",
        onPress: async () => {
          try {
            await api.markAsSold(product.$id, product.edit_code);
            Alert.alert("Success", "Product marked as sold!");
            loadUserProducts(); // Refresh list
          } catch (error) {
            Alert.alert("Error", "Failed to mark as sold");
          }
        },
      },
    ]);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="bg-white rounded-lg overflow-hidden shadow-sm mb-4 mx-4"
      onPress={() => router.push(`/product/${item.$id}`)}
    >
      <View className="flex-row">
        <Image
          source={{ uri: api.getImageUrl(item.images[0]) }}
          className="w-24 h-24"
          resizeMode="cover"
        />
        <View className="flex-1 p-3">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="font-semibold text-base flex-1" numberOfLines={2}>
              {item.title}
            </Text>
            {item.status === "sold" && (
              <View className="bg-red-500 px-2 py-1 rounded ml-2">
                <Text className="text-white text-xs font-semibold">SOLD</Text>
              </View>
            )}
          </View>
          <Text className="text-blue-600 font-bold text-lg mb-1">
            {formatPrice(item.price)}
          </Text>
          <Text className="text-gray-500 text-sm mb-2" numberOfLines={1}>
            {item.description}
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400 text-xs">
              {formatDate(item.$createdAt)}
            </Text>
            {item.status === "available" && (
              <TouchableOpacity
                className="bg-orange-500 px-3 py-1 rounded"
                onPress={() => handleMarkAsSold(item)}
              >
                <Text className="text-white text-xs font-semibold">
                  Mark Sold
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-8">
        <Ionicons name="person-outline" size={64} color="#d1d5db" />
        <Text className="text-gray-400 mt-4 text-base text-center">
          Post your first item to see your listings here
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg mt-4"
          onPress={() => router.push("/(tabs)/post")}
        >
          <Text className="text-white font-semibold">Start Selling</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="cube-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 text-base">
              No listings yet
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg mt-4"
              onPress={() => router.push("/(tabs)/post")}
            >
              <Text className="text-white font-semibold">
                Create First Listing
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
