import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Telefonos = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosTelefonos = [
        { id: "t1", title: "IPHONE 15 PRO", price: 1219, thumbnail: "https://techify.es/wp-content/uploads/2024/06/iphone15pro-1.png" },
        { id: "t2", title: "SAMSUNG GALAXY S24 ULTRA", price: 1399, thumbnail: "https://imageservice.asgoodasnew.com/540/21761/71/title-0000.jpg" },
        { id: "t3", title: "GOOGLE PIXEL 8 PRO", price: 950, thumbnail: "https://eshopfrontend.orange.es/dw/image/v2/BJWB_PRD/on/demandware.static/-/Sites-devices-master-catalog/default/dw53fe3616/images/3061369/google_pixel_8_pro_5g_blanco_Frontback.png?sw=960&sh=720&sm=fit" },
        { id: "t4", title: "XIAOMI 14 ULTRA", price: 1499, thumbnail: "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MP_137560173/fee_786_587_png" },
        { id: "t5", title: "ONEPLUS 12", price: 949, thumbnail: "https://image01.oneplus.net/media/202405/28/b96848b7acd10dafde32203d12f6fea7.png" },
        { id: "t6", title: "NOTHING PHONE (2)", price: 649, thumbnail: "https://comprasmartphone.com/_next/image?url=https%3A%2F%2Fstorage.comprasmartphone.com%2Fsmartphones%2Fnothing-phone-2.png&w=640&q=75" },
        { id: "t7", title: "OPPO FIND X6 PRO", price: 1199, thumbnail: "https://comprasmartphone.com/_next/image?url=https%3A%2F%2Fstorage.comprasmartphone.com%2Fsmartphones%2Foppo-find-x6-pro.png&w=640&q=75" },
        { id: "t8", title: "ASUS ROG PHONE 7", price: 899, thumbnail: "https://dlcdnwebimgs.asus.com/gain/4A2BCCC6-B9D8-47A5-AD7F-501E30A462A9" },
        { id: "t9", title: "MOTOROLA EDGE 40 PRO", price: 699, thumbnail: "https://storage.comprasmartphone.com/smartphones/motorola-edge-40-pro.png" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Teléfonos`);
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
            setProducts(productosTelefonos);
            dispatch({ type: "set_products", payload: productosTelefonos });
            setLoading(false);
        };
        fetchProducts();
    }, [dispatch]);

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#CFD6EA", minHeight: "100vh" }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>TELÉFONOS</h2>
                    <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: "#423629" }}></div>
                </div>

                <div className="row g-4">
                    {products.map((item, index) => (
                        <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                            <div className="card h-100 border-0 shadow-sm p-4 text-center rounded-4"
                                style={{
                                    transition: "0.3s",
                                    backgroundColor: hoveredIndex === index ? "#E2E7F3" : "#FFFFFF",
                                    transform: hoveredIndex === index ? "translateY(-10px)" : "none"
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}>

                                <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: "200px" }}>
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=No+Image"; }}
                                    />
                                </div>

                                <h6 className="fw-bold text-uppercase" style={{ color: "#423629", fontSize: "0.9rem" }}>{item.title}</h6>
                                <p className="fs-4 fw-bold mb-3">{item.price.toLocaleString("es-ES")} €</p>
                                <button
                                    className="btn btn-dark rounded-pill fw-bold py-2 w-100 mb-2 text-uppercase"
                                    onClick={() => dispatch({ type: "add_to_cart", payload: item })}
                                >
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-5 pt-4">
                    <Link to="/">
                        <button className="btn btn-dark rounded-pill px-5 py-3 fw-bold shadow-sm text-uppercase">
                            Volver al menú
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};