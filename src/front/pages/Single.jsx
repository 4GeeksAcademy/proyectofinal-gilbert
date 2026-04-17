import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store";

export const Single = () => {
    const { store, dispatch } = useContext(Context);
    const { theid } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const numericId = Number(theid);
            if (!Number.isInteger(numericId)) {
                const fallback = store.products.find(item => item.id === theid);
                if (fallback) {
                    setProduct(fallback);
                    setLoading(false);
                    return;
                }
                setError("Producto no encontrado");
                setLoading(false);
                return;
            }

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
                const response = await fetch(`${backendUrl}/api/products/${numericId}`);
                if (!response.ok) throw new Error("No se encontró el producto");
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                const fallback = store.products.find(item => item.id === theid || item.id === numericId);
                if (fallback) {
                    setProduct(fallback);
                } else {
                    setError("Producto no encontrado");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [theid, store.products]);

    const handleAddToCart = () => {
        if (!product) return;
        dispatch({
            type: "add_to_cart",
            payload: {
                product_id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
            },
        });
    };

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-dark"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container-fluid py-5 text-center">
                <h3>{error || "Producto no encontrado"}</h3>
                <Link to="/" className="btn btn-dark rounded-pill mt-4">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#CFD6EA", minHeight: "100vh" }}>
            <div className="container bg-white p-5 rounded-4 shadow-sm">
                <div className="row">
                    <div className="col-md-6 text-center mb-4 mb-md-0">
                        <img src={product.thumbnail} alt={product.title} className="img-fluid" style={{ maxHeight: "400px" }} />
                    </div>
                    <div className="col-md-6">
                        <h2 className="fw-bold text-uppercase mb-3" style={{ color: "#423629" }}>{product.title}</h2>
                        <p className="lead mb-4">{product.description || "Aquí encontrarás la información principal del producto."}</p>
                        <h3 className="fw-bold mb-4">{product.price.toLocaleString("es-ES")} €</h3>
                        <button className="btn btn-dark btn-lg rounded-pill px-5 fw-bold mb-4" onClick={handleAddToCart}>AÑADIR AL CARRITO</button>
                        <br />
                        <Link to="/" className="text-dark fw-bold text-uppercase" style={{ fontSize: "0.8rem" }}>Volver al inicio</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};