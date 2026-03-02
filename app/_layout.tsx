import { auth } from "@/lib/auth";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    // Auto-login on app start
    auth.autoLogin().catch((error) => {
      console.warn("Auto-login failed:", error);
    });
  }, []);

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
