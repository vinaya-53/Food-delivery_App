import { View, Text, Image, StyleSheet, Button } from "react-native";
import React from "react";
import { useCart } from "../contexts/CartContext";
import {imageMap } from "../assets/imageMap"; // or correct relative path



export type MenuItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
  storeName: string;
};

type Props = {
  item: MenuItem;
};


export default function FoodItem({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();  // <-- get addToCart from context

  const normalizedKey = item.imageUrl ? item.imageUrl.trim().replace(/\s/g, "_") : "";
  const imageSource = imageMap?.[normalizedKey];

  if (!imageSource) {
    console.warn("Missing image for:", normalizedKey, "Falling back to default.");
  }

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text style={styles.store}>{item.storeName}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Button 
          title="Add to Cart" 
          onPress={() => addToCart(item, 1)}  // <-- call addToCart with quantity 1
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  store: {
    color: "#666",
    marginTop: 2,
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
  },
});
