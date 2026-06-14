import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function AdminLogin() {
    const handleLogin = () => {
        // TEMP shortcut (we will connect Firebase later)
        router.replace("/admin/dashboard");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Login</Text>

            <TextInput placeholder="Admin Email" style={styles.input} />
            <TextInput placeholder="Password" secureTextEntry style={styles.input} />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login as Admin</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 },
    button: { backgroundColor: "black", padding: 15, borderRadius: 8 },
    buttonText: { color: "white", textAlign: "center" }
});