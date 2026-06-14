import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

import { auth, db } from "./firebaseConfig";

export default function Orders() {
    const [orders, setOrders] = useState<any[]>([]);


    const loadOrders = async () => {
        try {
            const q = query(
                collection(db, "orders"),
                where("userId", "==", auth.currentUser?.uid)
            );

            const snapshot = await getDocs(q);

            const data: any[] = [];

            snapshot.forEach((item) => {
                data.push({
                    id: item.id,
                    ...item.data(),
                });
            });

            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);


    const cancelOrder = async (id: string) => {
        try {
            await updateDoc(doc(db, "orders", id), {
                status: "Cancelled by user",
            });

            loadOrders();
        } catch (error) {
            console.log(error);
        }
    };


    const formatDate = (timestamp: any) => {
        if (!timestamp) return "No date";
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Orders</Text>

            {orders.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                    No orders yet
                </Text>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.card,
                                item.status === "Cancelled by user" && styles.blurred,
                            ]}
                        >

                            <Text style={styles.label}>
                                {auth.currentUser?.email}
                            </Text>

                            {/* DATE */}
                            <Text style={styles.text}>
                                {formatDate(item.createdAt)}
                            </Text>

                            {/* PHONE */}
                            <Text style={styles.text}> {item.phone}</Text>

                            {/* ADDRESS */}
                            <Text style={styles.text}> {item.address}</Text>

                            {/* ITEMS */}
                            <Text style={styles.text}>
                                Items: {item.items.length}
                            </Text>

                            {/* TOTAL */}
                            <Text style={styles.text}>
                                Total: ₱{item.total}
                            </Text>

                            {/* STATUS */}
                            <Text
                                style={[
                                    styles.status,
                                    item.status === "Cancelled by user"
                                        ? { color: "red" }
                                        : null,
                                ]}
                            >
                                🚦 Status: {item.status}
                            </Text>

                            {/* CANCEL BUTTON */}
                            {item.status === "Pending" && (
                                <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={() => cancelOrder(item.id)}
                                >
                                    <Text style={{ color: "#fff" }}>
                                        Cancel Order
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            )}
        </View>
    );
}

/* ================= STYLES (FIXED) ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
    },

    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },

    blurred: {
        opacity: 0.5,
    },

    label: {
        fontWeight: "bold",
        marginBottom: 5,
    },

    text: {
        marginTop: 3,
    },

    status: {
        marginTop: 8,
        fontWeight: "bold",
    },

    cancelBtn: {
        marginTop: 10,
        backgroundColor: "red",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
});