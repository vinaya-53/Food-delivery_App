import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useCart } from "../contexts/CartContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppNavigation";
import { imageMap } from "../assets/imageMap"; // Adjust path if needed

type Props = NativeStackScreenProps<RootStackParamList, 'HappyBites'>;

export default function CartScreen({ navigation }: Props) {
  const { cart, loadCart, getTotal } = useCart();

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const normalizedKey = item.imageUrl?.trim().replace(/\s/g, "_");
          const imageSource = imageMap[normalizedKey];

          return (
            <View style={styles.cartItem}>
              <Image
                source={imageSource}
                style={styles.foodImage}
                resizeMode="cover"
              />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.store}>{item.storeName}</Text>
                <Text style={styles.qty}>Qty: {item.quantity}</Text>
                <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>Cart is empty.</Text>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${getTotal().toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate("OrderSummary")}
          disabled={cart.length === 0}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: { fontSize: 18, fontWeight: "600" },
  store: { fontSize: 14, color: "#666" },
  qty: { fontSize: 16 },
  price: { fontSize: 16, fontWeight: "bold" },
  footer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
  },
  total: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  checkoutBtn: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: { fontSize: 18, fontWeight: "bold" },
});
