import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useCart } from "./context/CartContext";
import { auth, db } from "./firebaseConfig";

export default function Cart() {
    const {
        cart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
    } = useCart();

    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [payment, setPayment] = useState("COD");

    const getTotal = () => {
        return cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    };

    const checkout = async () => {
        if (!phone || !address) {
            Alert.alert("Missing Info", "Please fill phone and address");
            return;
        }

        try {
            await addDoc(collection(db, "orders"), {
                userId: auth.currentUser?.uid,
                items: cart,
                phone,
                address,
                paymentMethod: payment,
                total: getTotal(),
                status: "Pending",
                createdAt: new Date(),
            });

            Alert.alert("Success", "Order placed successfully!");

            clearCart();
            router.push("/(tabs)");
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Checkout failed");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Cart</Text>

            {cart.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                    Your cart is empty
                </Text>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text>₱{item.price}</Text>

                                <Text style={styles.qty}>
                                    Quantity: {item.quantity}
                                </Text>

                                <View style={styles.qtyRow}>
                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() => decreaseQty(item.id)}
                                    >
                                        <Text>-</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() => increaseQty(item.id)}
                                    >
                                        <Text>+</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={() => removeFromCart(item.id)}
                                >
                                    <Text style={{ color: "#fff" }}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    {/* USER INFO (FIXED LABEL STYLE) */}
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.label}>Delivery Address</Text>
                    <TextInput
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                    />

                    {/* PAYMENT */}
                    <Text style={styles.label}>Payment Method</Text>

                    <View style={styles.paymentRow}>
                        <TouchableOpacity onPress={() => setPayment("COD")}>
                            <Text
                                style={
                                    payment === "COD"
                                        ? styles.selected
                                        : styles.option
                                }
                            >
                                COD
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setPayment("PayPal")}>
                            <Text
                                style={
                                    payment === "PayPal"
                                        ? styles.selected
                                        : styles.option
                                }
                            >
                                PayPal
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* TOTAL */}
                    <View style={styles.totalBox}>
                        <Text style={styles.totalText}>
                            Total: ₱{getTotal()}
                        </Text>
                    </View>

                    {/* CHECKOUT */}
                    <TouchableOpacity
                        style={styles.checkoutBtn}
                        onPress={checkout}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                            Checkout
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

/* ---------------- STYLES FIXED ---------------- */

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
        marginBottom: 10,
        borderRadius: 10,
    },

    name: {
        fontSize: 16,
        fontWeight: "bold",
    },

    qty: {
        marginTop: 5,
    },

    qtyRow: {
        flexDirection: "row",
        marginTop: 10,
        gap: 10,
    },

    qtyBtn: {
        padding: 8,
        borderWidth: 1,
        borderRadius: 5,
    },

    removeBtn: {
        marginTop: 10,
        backgroundColor: "red",
        padding: 8,
        borderRadius: 6,
        alignItems: "center",
    },

    label: {
        marginTop: 12,
        marginBottom: 5,
        fontWeight: "600",
        fontSize: 14,
        color: "#333",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
    },

    paymentRow: {
        flexDirection: "row",
        gap: 15,
        marginTop: 10,
    },

    option: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
    },

    selected: {
        padding: 10,
        backgroundColor: "#ff6600",
        color: "#fff",
        borderRadius: 8,
    },

    totalBox: {
        marginTop: 15,
        padding: 15,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
    },

    totalText: {
        fontSize: 18,
        fontWeight: "bold",
    },

    checkoutBtn: {
        marginTop: 15,
        backgroundColor: "green",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
});