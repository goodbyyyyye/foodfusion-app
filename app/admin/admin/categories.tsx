import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebaseConfig";

export default function Categories() {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState<any[]>([]);

    const load = async () => {
        const snap = await getDocs(collection(db, "categories"));
        const data: any[] = [];
        snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
        setCategories(data);
    };

    useEffect(() => {
        load();
    }, []);

    const addCategory = async () => {
        if (!name) return;

        await addDoc(collection(db, "categories"), {
            name,
        });

        setName("");
        load();
    };

    const deleteCat = async (id: string) => {
        await deleteDoc(doc(db, "categories", id));
        load();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📂 Categories</Text>

            <TextInput
                placeholder="New Category"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TouchableOpacity style={styles.addBtn} onPress={addCategory}>
                <Text style={{ color: "#fff" }}>Add</Text>
            </TouchableOpacity>

            <FlatList
                data={categories}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>{item.name}</Text>

                        <TouchableOpacity onPress={() => deleteCat(item.id)}>
                            <Text style={{ color: "red" }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    title: { fontSize: 22, fontWeight: "bold" },
    input: { borderWidth: 1, padding: 10, marginTop: 10 },
    addBtn: { backgroundColor: "green", padding: 10, marginTop: 10 },
    card: {
        padding: 15,
        borderWidth: 1,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});