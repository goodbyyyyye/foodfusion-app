import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { CartProvider } from "./context/CartContext";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <CartProvider>

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="register" />
          <Stack.Screen name="admin/dashboard" />
          <Stack.Screen name="cart" />
        </Stack>

        <StatusBar style="dark" />

      </CartProvider>
    </ThemeProvider>
  );
}