import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useCart } from "../context/CartContext";
import { db } from "../firebaseConfig";

export default function Home() {
  const { cart, addToCart } = useCart();

  const [foods, setFoods] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ================= LOAD FOODS =================
  const loadFoods = async () => {
    const snap = await getDocs(collection(db, "foods"));

    const data: any[] = [];
    snap.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    setFoods(data);
  };

  // ================= LOAD CATEGORIES =================
  const loadCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));

    const data: any[] = [];
    snap.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    setCategories(data);
  };

  useEffect(() => {
    loadFoods();
    loadCategories();
  }, []);

  const handleAddToCart = (item: any) => {
    addToCart(item);
    Alert.alert("Added", item.name);
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          router.replace("/login");
        },
      },
    ]);
  };

  // ================= FILTER FOODS =================
  const filteredFoods = foods.filter((item) => {
    const matchSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "All" || item.categoryId === category;

    return matchSearch && matchCategory;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FoodFusion</Text>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* TOP BUTTONS */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/cart")}
        >
          <Text style={styles.buttonText}>
            My Cart ({cart.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/orders")}
        >
          <Text style={styles.buttonText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      {/* ORDER NOW */}
      <TouchableOpacity
        style={styles.orderBtn}
        onPress={() => router.push("/order-now")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Order Now
        </Text>
      </TouchableOpacity>

      {/* SEARCH */}
      <TextInput
        placeholder="Search food..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* CATEGORIES */}
      <FlatList
        horizontal
        data={[{ id: "All", name: "All" }, ...categories]}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.catBtn,
              category === item.id && styles.catActive,
            ]}
            onPress={() => setCategory(item.id)}
          >
            <Text
              style={{
                color: category === item.id ? "#fff" : "#000",
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* FOOD LIST */}
      {filteredFoods.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No items found
        </Text>
      ) : (
        <FlatList
          data={filteredFoods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text>₱{item.price}</Text>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={{ color: "#fff" }}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
  },

  logoutBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  button: {
    backgroundColor: "#ff6600",
    padding: 10,
    borderRadius: 8,
    width: "48%",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  orderBtn: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  catBtn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },

  catActive: {
    backgroundColor: "#ff6600",
  },

  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 10,
  },

  foodName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  addBtn: {
    marginTop: 10,
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
});