import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);

    const load = async () => {
        const snap = await getDocs(collection(db, "orders"));
        const data: any[] = [];
        snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
        setOrders(data);
    };

    useEffect(() => {
        load();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        await updateDoc(doc(db, "orders", id), { status });
        load();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📦 Orders</Text>

            <FlatList
                data={orders}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text> {item.phone}</Text>
                        <Text> {item.address}</Text>
                        <Text> ₱{item.total}</Text>
                        <Text> {item.status}</Text>

                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => updateStatus(item.id, "Preparing")}>
                                <Text>Preparing</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => updateStatus(item.id, "On the way")}>
                                <Text>On the way</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => updateStatus(item.id, "Delivered")}>
                                <Text>Delivered</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    title: { fontSize: 22, fontWeight: "bold" },

    card: {
        padding: 15,
        borderWidth: 1,
        marginTop: 10,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
});