import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useCart } from "./context/CartContext";
import { db } from "./firebaseConfig";

export default function OrderNow() {
    const { cart, addToCart } = useCart();

    const [foods, setFoods] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const loadFoods = async () => {
        const snapshot = await getDocs(collection(db, "foods"));

        const data: any[] = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        setFoods(data);
    };

    useEffect(() => {
        loadFoods();
    }, []);

    const categories = ["All", "Food", "Drinks", "Snacks"];

    const filtered = foods.filter((item) => {
        const matchSearch = item.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =
            category === "All" || item.category === category;

        return matchSearch && matchCategory;
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}> Order Now</Text>

            {/* SEARCH */}
            <TextInput
                placeholder="Search food..."
                value={search}
                onChangeText={setSearch}
                style={styles.search}
            />

            {/* CATEGORIES */}
            <FlatList
                data={categories}
                horizontal
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.cat,
                            category === item && styles.active,
                        ]}
                        onPress={() => setCategory(item)}
                    >
                        <Text>{item}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* NAV */}
            <View style={styles.nav}>
                <TouchableOpacity onPress={() => router.push("/(tabs)")}>
                    <Text>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/cart")}>
                    <Text> Cart ({cart.length})</Text>
                </TouchableOpacity>
            </View>

            {/* FOOD LIST */}
            <FlatList
                data={filtered}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>{item.name}</Text>
                        <Text>₱{item.price}</Text>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => addToCart(item)}
                        >
                            <Text style={{ color: "#fff" }}>Add</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    title: { fontSize: 24, fontWeight: "bold" },

    search: {
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
    },

    cat: {
        padding: 10,
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 20,
        marginTop: 10,
    },

    active: {
        backgroundColor: "#ff6600",
    },

    nav: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    card: {
        padding: 15,
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 10,
    },

    btn: {
        backgroundColor: "green",
        padding: 8,
        marginTop: 5,
        borderRadius: 8,
        alignItems: "center",
    },
});