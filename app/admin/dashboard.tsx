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

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";

import { router } from "expo-router";
import { db } from "../firebaseConfig";

export default function AdminDashboard() {
    const [foods, setFoods] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);

    const [foodName, setFoodName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [catName, setCatName] = useState("");

    const loadFoods = async () => {
        const snap = await getDocs(collection(db, "foods"));
        setFoods(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    const loadCategories = async () => {
        const snap = await getDocs(collection(db, "categories"));
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    const loadOrders = async () => {
        const snap = await getDocs(collection(db, "orders"));
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    useEffect(() => {
        loadFoods();
        loadCategories();
        loadOrders();
    }, []);

    const addFood = async () => {
        if (!foodName || !price || !categoryId) return;

        await addDoc(collection(db, "foods"), {
            name: foodName,
            price: Number(price),
            categoryId,
        });

        setFoodName("");
        setPrice("");
        setCategoryId("");
        loadFoods();
    };

    const addCategory = async () => {
        if (!catName) return;

        await addDoc(collection(db, "categories"), {
            name: catName,
        });

        setCatName("");
        loadCategories();
    };

    const deleteFood = async (id: string) => {
        await deleteDoc(doc(db, "foods", id));
        loadFoods();
    };

    const deleteCategory = async (id: string) => {
        await deleteDoc(doc(db, "categories", id));
        loadCategories();
    };

    const updateStatus = async (id: string, status: string) => {
        await updateDoc(doc(db, "orders", id), { status });
        loadOrders();
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: () => router.replace("/login"),
            },
        ]);
    };

    return (
        <FlatList
            data={[1]}
            keyExtractor={() => "admin"}
            renderItem={() => (
                <View style={styles.container}>

                    <Text style={styles.title}>Admin Panel</Text>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.btnText}>Logout</Text>
                    </TouchableOpacity>

                    {/* FOOD */}
                    <Text style={styles.section}>Add Food</Text>

                    <TextInput placeholder="Food Name" value={foodName} onChangeText={setFoodName} style={styles.input} />
                    <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} />

                    <TextInput placeholder="Category ID" value={categoryId} onChangeText={setCategoryId} style={styles.input} />

                    <TouchableOpacity style={styles.addBtn} onPress={addFood}>
                        <Text style={styles.btnText}>Add Food</Text>
                    </TouchableOpacity>

                    {foods.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Text>{item.name}</Text>
                            <Text>₱{item.price}</Text>

                            <TouchableOpacity onPress={() => deleteFood(item.id)}>
                                <Text style={styles.delete}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* CATEGORY */}
                    <Text style={styles.section}>Categories</Text>

                    <TextInput placeholder="Category Name" value={catName} onChangeText={setCatName} style={styles.input} />

                    <TouchableOpacity style={styles.addBtn} onPress={addCategory}>
                        <Text style={styles.btnText}>Add Category</Text>
                    </TouchableOpacity>

                    {categories.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Text>{item.name}</Text>

                            <TouchableOpacity onPress={() => deleteCategory(item.id)}>
                                <Text style={styles.delete}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* ORDERS */}
                    <Text style={styles.section}>Orders</Text>

                    {orders.length === 0 ? (
                        <Text>No orders yet</Text>
                    ) : (
                        orders.map((item) => (
                            <View key={item.id} style={styles.orderCard}>

                                <Text>User: {item.userEmail || "N/A"}</Text>
                                <Text>Phone: {item.phone}</Text>
                                <Text>Address: {item.address}</Text>
                                <Text>Total: ₱{item.total}</Text>
                                <Text>Status: {item.status}</Text>

                                <Text style={styles.sub}>Items:</Text>

                                {item.items?.map((p: any, i: number) => (
                                    <Text key={i}>
                                        {p.name} x{p.quantity || 1}
                                    </Text>
                                ))}

                                <View style={styles.row}>
                                    <Text onPress={() => updateStatus(item.id, "Pending")} style={styles.btn}>Pending</Text>
                                    <Text onPress={() => updateStatus(item.id, "Preparing")} style={styles.btn}>Prep</Text>
                                    <Text onPress={() => updateStatus(item.id, "On the Way")} style={styles.btn}>On Way</Text>
                                    <Text onPress={() => updateStatus(item.id, "Delivered")} style={styles.btn}>Done</Text>
                                </View>

                            </View>
                        ))
                    )}

                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: "#fff" },

    title: { fontSize: 24, fontWeight: "bold" },

    section: { fontSize: 18, fontWeight: "bold", marginTop: 15 },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginTop: 8,
        borderRadius: 8,
    },

    addBtn: {
        backgroundColor: "green",
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
        alignItems: "center",
    },

    logoutBtn: {
        backgroundColor: "red",
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontWeight: "bold",
    },

    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
    },

    orderCard: {
        borderWidth: 1,
        borderColor: "#aaa",
        padding: 12,
        marginTop: 10,
        borderRadius: 10,
    },

    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        gap: 10,
    },

    btn: {
        backgroundColor: "#ff6600",
        color: "#fff",
        padding: 5,
        marginRight: 5,
        borderRadius: 5,
    },

    delete: {
        color: "red",
        marginTop: 5,
    },

    sub: {
        marginTop: 8,
        fontWeight: "bold",
    },
});