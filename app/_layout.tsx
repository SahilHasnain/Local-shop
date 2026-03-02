import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          title: "Product Details",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
