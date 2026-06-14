import { createContext, ReactNode, useContext, useState } from "react";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // ➕ Add item
    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCart((prev) => {
            const exists = prev.find((i) => i.id === item.id);

            if (exists) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }

            return [...prev, { ...item, quantity: 1 }];
        });
    };

    // ➕ increase
    const increaseQty = (id: string) => {
        setCart((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            )
        );
    };

    // ➖ decrease
    const decreaseQty = (id: string) => {
        setCart((prev) =>
            prev
                .map((i) =>
                    i.id === id ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter((i) => i.quantity > 0)
        );
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                increaseQty,
                decreaseQty,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
}