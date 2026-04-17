import React from "react";

export const Context = React.createContext(null);

export const initialStore = () => {
  return {
    token: localStorage.getItem("token") || null,
    user: null,
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    products: [],
    tech_categories: [
      "Ordenadores",
      "Teléfonos",
      "Tablets",
      "Zona Apple",
      "Electrodomésticos",
      "Otros",
      "Consolas",
      "Mobilidad urbana",
      "Accesorios",
    ],
  };
};

export default function storeReducer(store, action) {
  switch (action.type) {
    case "login":
      localStorage.setItem("token", action.payload.token);
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
        cart: savedCart,
      };

    case "logout":
      localStorage.setItem("cart", JSON.stringify(store.cart));
      localStorage.removeItem("token");
      return {
        ...store,
        token: null,
        user: null,
      };

    case "set_products":
      return { ...store, products: action.payload };

    case "add_to_cart":
      const newCart = [...store.cart, action.payload];
      localStorage.setItem("cart", JSON.stringify(newCart));
      if (store.token) {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        fetch(backendUrl + "/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.token}`,
          },
          body: JSON.stringify(action.payload),
        }).catch((err) => console.error("Error saving to cart:", err));
      }
      return { ...store, cart: newCart };

    case "remove_from_cart":
      const filteredCart = store.cart.filter(
        (item, index) => index !== action.payload,
      );
      localStorage.setItem("cart", JSON.stringify(filteredCart));
      if (store.token) {
        const removedItem = store.cart[action.payload];
        if (removedItem && removedItem.id) {
          const backendUrl =
            import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
          fetch(backendUrl + `/api/cart/${removedItem.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          }).catch((err) => console.error("Error removing from cart:", err));
        }
      }
      return {
        ...store,
        cart: filteredCart,
      };

    case "load_cart":
      return { ...store, cart: action.payload };

    case "update_cart_for_user":
      return { ...store, cart: action.payload };

    default:
      return store;
  }
}
