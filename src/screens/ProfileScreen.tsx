import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const menuItems = [
    { icon: "person-circle-outline", label: "Personal Details" },
    { icon: "home-outline", label: "Address Details" },
    { icon: "receipt-outline", label: "Orders" },
    { icon: "settings-outline", label: "Settings" },
    { icon: "help-circle-outline", label: "Help" },
    { icon: "log-out-outline", label: "Logout", action: handleLogout },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/woman.png")} // Replace with your profile image
        style={styles.profileImage}
      />
      <Text style={styles.username}>Hello, User!</Text>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.action || (() => {})}
          >
            <Ionicons name={item.icon as any} size={24} color="#6200EE" />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center",backgroundColor: "#FFF9C4",paddingTop: 40, paddingBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  username: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  menu: { width: "90%" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f0",
    marginBottom: 10,
  },
  menuLabel: { marginLeft: 15, fontSize: 16, fontWeight: "500" },
});
