import { View, Text, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { useCart } from "../contexts/CartContext";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HappyBites'>;

export default function OrderSummaryScreen({ navigation }: Props) {
  const { cart, getTotal, clearCart } = useCart(); // <-- added clearCart

  const placeOrder = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        items: cart,
        total: getTotal(),
        timestamp: Timestamp.now(),
      });

      clearCart(); 
      Alert.alert("Success", "Your order has been placed!");
      navigation.navigate("HappyBites");
    } catch (error) {
      Alert.alert("Error", "Failed to place the order. Try again.");
      console.error("Order Error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      {cart.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQty}>x{item.quantity}</Text>
        </View>
      ))}

      <Text style={styles.total}>Total: ${getTotal().toFixed(2)}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Place Order" onPress={placeOrder} color="#FFA500" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  itemName: {
    fontSize: 18,
    color: "#444",
  },
  itemQty: {
    fontSize: 18,
    color: "#888",
  },
  total: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 20,
    marginBottom: 30,
    color: "#222",
  },
  buttonContainer: {
    alignItems: "center",
  },
});
