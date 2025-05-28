import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Button,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FoodItem, { MenuItem } from "../components/FoodItem";
import { db } from "../services/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigation'; // Adjust the relative path

type Props = NativeStackScreenProps<RootStackParamList, 'HappyBites'>;

type CartItem = MenuItem & { qty: number };

export default function MenuScreen({ navigation }: Props) {
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "food_items"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[];
      setFoodItems(items);
      setFilteredItems(items);
      console.log("Fetched from Firebase:", items);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filtered = foodItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.storeName.toLowerCase().includes(lower)
    );
    setFilteredItems(filtered);
  }, [search, foodItems]);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [...prev, { ...item, qty: 1 }];
      }
    });
  }


  function changeQty(itemId: string, delta: number) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (!existing && delta > 0) {
        const newItem = foodItems.find((f) => f.id === itemId);
        if (!newItem) return prev;
        return [...prev, { ...newItem, qty: 1 }];
      }
      if (!existing) return prev;

      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        return prev.filter((i) => i.id !== itemId);
      }
      return prev.map((i) =>
        i.id === itemId ? { ...i, qty: newQty } : i
      );
    });
  }


  function getQty(itemId: string) {
    const found = cart.find((i) => i.id === itemId);
    return found ? found.qty : 0;
  }

  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food or store..."
          placeholderTextColor="#555"
          value={search}
          onChangeText={(text) => {
  setSearch(text);
  setShowDropdown(true);
}}
          onBlur={Keyboard.dismiss}
        />
      </View>

      {/* Dropdown Suggestion */}
      {search.trim() !== "" && filteredItems.length > 0 && showDropdown && (
  <View style={styles.dropdownOverlay}>
    <TouchableOpacity
      style={styles.cancelIcon}
      onPress={() => {
        setShowDropdown(false);
        setSearch(""); // optional
        Keyboard.dismiss();
      }}
    >
      <Text style={styles.cancelIconText}>❌</Text>
    </TouchableOpacity>

    <View style={styles.dropdownContainer}>
      <FlatList
        data={filteredItems.slice(0, 5)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const qty = getQty(item.id);
          return (
            <View style={styles.dropdownItem}>
              <TouchableOpacity
                onPress={() => {
                  setSearch(item.name);
                  setShowDropdown(false);
                  Keyboard.dismiss();
                }}
                style={{ flex: 1 }}
              >
                <FoodItem item={item} />
              </TouchableOpacity>
              <View style={styles.qtyButtons}>
                <TouchableOpacity
                  onPress={() => changeQty(item.id, -1)}
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{qty}</Text>
                <TouchableOpacity
                  onPress={() => changeQty(item.id, 1)}
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  </View>
)}




      {/* Posters */}
      <View style={styles.posterContainer}>
        <Image
          source={require("../assets/poster2.png")}
          style={styles.largePoster}
        />
        <View style={styles.gridRow}>
          <Image
            source={require("../assets/poster1.png")}
            style={styles.smallPoster}
          />
          <Image
            source={require("../assets/poster3.png")}
            style={styles.smallPoster}
          />
          <Image
            source={require("../assets/poster4.png")}
            style={styles.smallPoster}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.iconRow}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={30} color="white" />
          <Text style={styles.footerText}>Cart ({cart.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconRow} onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={32} color="white" />
          <Text style={styles.footerText}>You</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 15,
    zIndex: 2,
  },
  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    fontSize: 16,
    color: "#000",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    position: "absolute",
    top: 80,
    left: 15,
    right: 15,
    zIndex: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 600,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)", // semi-transparent black background
  zIndex: 4, // Should be less than dropdownContainer but above main content
  justifyContent: "flex-start",
  paddingTop: 80, // To match where your dropdown starts
},

  qtyButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    backgroundColor: "#FFD700",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "600",
  },
  posterContainer: {
    margin: 10,
    zIndex: 0,
  },
  largePoster: {
    width: "100%",
    height: 380,
    borderRadius: 10,
    marginBottom: 15,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallPoster: {
    width: "32%",
    height: 290,
    borderRadius: 10,
  },
  footer: {
    backgroundColor: "black", // Darker yellow
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
    color: "#fff", // Make footer label text white for contrast
  },
  iconRow: {
    alignItems: "center",
  },
  icon: {
    color: "#fff", // White icons
  },
  cancelContainer: {
  alignItems: "flex-end",
  padding: 10,
  backgroundColor: "#fff",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
},

cancelText: {
  color: "#FF5252",
  fontSize: 16,
  fontWeight: "600",
},
cancelIcon: {
  position: "absolute",
  top: 70,
  right: 25,
  zIndex: 10,
  backgroundColor: "#fff",
  padding: 6,
  borderRadius: 20,
  elevation: 5,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
},

cancelIconText: {
  fontSize: 13,
  color: "#333"
},


});
