import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Perifericos = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosFijos = [
        { id: "p1", title: "Monitor LG UltraGear 27\"", price: 399, thumbnail: "https://www.lg.com/es/images/monitores/md07538965/gallery/D-01.jpg" },
        { id: "p2", title: "Razer Huntsman V3 Pro", price: 249, thumbnail: "https://assets2.razerzone.com/images/pnx.assets/d2448496152a5146747d0669b3017a0a/razer-huntsman-v3-pro-500x500.png" },
        { id: "p3", title: "Logitech G PRO X Superlight", price: 159, thumbnail: "https://resource.logitechg.com/w_386,ar_1.0,c_limit,f_auto,q_auto,dpr_2.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-black-gallery-1.png?v=1" },
        { id: "p4", title: "Corsair Virtuoso RGB", price: 209, thumbnail: "https://cwsmgmt.corsair.com/pdp/virtuoso-rgb-wireless/images/virtuoso_wireless_carbon_01.png" },
        { id: "p5", title: "Blue Yeti USB Microphone", price: 129, thumbnail: "https://resource.logitech.com/w_600,c_limit,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/logitech/en/products/microphones/yeti/gallery/yeti-blackout-gallery-1.png?v=1" },
        { id: "p6", title: "Elgato Facecam 1080p60", price: 149, thumbnail: "https://gc-uploads.elgato.com/products/facecam/gallery/facecam-01.png" },
        { id: "p7", title: "Asus ROG Rapture GT-AX11000", price: 449, thumbnail: "https://dlcdnwebimgs.asus.com/gain/B57065C7-306C-45CA-9457-3B21272635CD/w1000/h732" },
        { id: "p8", title: "Wacom Cintiq 16 Tablet", price: 649, thumbnail: "https://estore.wacom.com/media/catalog/product/c/i/cintiq-16-1.png" },
        { id: "p9", title: "Impresora HP Color LaserJet Pro", price: 329, thumbnail: "https://ssl-images-amazon.com/images/I/610tX+E6VUL._AC_SL1500_.jpg" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Periféricos`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length) {
                        setProducts(data);
                        dispatch({ type: "set_products", payload: data });
                        setLoading(false);
                        return;
                    }
                }
            } catch (error) { }
            setProducts(productosFijos);
            dispatch({ type: "set_products", payload: productosFijos });
            setLoading(false);
        };
        fetchProducts();
    }, [dispatch]);

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#CFD6EA", minHeight: "100vh" }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>PERIFÉRICOS</h2>
                    <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: "#423629" }}></div>
                </div>
                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-dark"></div></div>
                ) : (
                    <div className="row g-4">
                        {products.map((item, index) => (
                            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                                <div className="card h-100 border-0 shadow-sm p-4 text-center rounded-4"
                                    style={{ transition: "0.3s", backgroundColor: hoveredIndex === index ? "#E2E7F3" : "#FFFFFF", transform: hoveredIndex === index ? "translateY(-10px)" : "none" }}
                                    onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                                    <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: "200px" }}>
                                        <img src={item.thumbnail} alt={item.title} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                                    </div>
                                    <div className="card-body p-0 d-flex flex-column">
                                        <h6 className="fw-bold mb-2 text-uppercase" style={{ color: "#423629", fontSize: "0.85rem", height: "2.5rem", overflow: "hidden" }}>{item.title}</h6>
                                        <p className="fs-4 fw-bold mb-3" style={{ color: "#333" }}>{item.price.toLocaleString("es-ES")} €</p>
                                        <button className="btn btn-dark rounded-pill fw-bold py-2 mt-auto w-100" onClick={() => dispatch({ type: "add_to_cart", payload: item })}>AÑADIR AL CARRITO</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};