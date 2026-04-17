import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Electrodomesticos = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosFijos = [
        { id: "el1", title: "Frigorífico LG Instaview", price: 1899, thumbnail: "https://www.lg.com/es/lg-experience/images/essential-module/instaview.png" },
        { id: "el2", title: "Lavadora Samsung EcoBubble", price: 549, thumbnail: "https://www.lacasadelelectrodomestico.com/public/storage/producto/192378/lavadora-11kg-negra-ai-ecobubble8482-clasificaci243n-energ233tica-a-ww11dg5b25abec_3-600px.png" },
        { id: "el3", title: "Microondas Cecotec ProClean", price: 89, thumbnail: "https://media.cecotec.cloud/01546/proclean-4010_8qpwan_1.png" },
        { id: "el4", title: "Lavavajillas Bosch Serie 4", price: 499, thumbnail: "https://assets.mmsrg.com/isr/166325/c1/-/pixelboxx-mss-79422701/fee_786_587_png" },
        { id: "el5", title: "Horno Pirolítico Balay", price: 389, thumbnail: "https://www.electroprecio.com/media/catalog/product/cache/1/thumbnail/600x400/9df78eab33525d08d6e5fb8d27136e95/2/5/25076048_3hb5879b7_stp_def.png" },
        { id: "el6", title: "Aspiradora Dyson V15", price: 699, thumbnail: "https://ssr.col.movistar.es/api/v3/get-pic/content/dam/movistar/estaticos/imagenes/accesorios/dyson-v15-detect-absolute-01.png?oe=png&v=mnok7mr9" },
        { id: "el7", title: "Cafetera De'Longhi Magnifica", price: 329, thumbnail: "https://www.powerplanetonline.com/cdnassets/delonghi_magnifica_ecam220_22_gb_negro_01_l_sf.webp" },
        { id: "el8", title: "Tostadora Smeg Retro", price: 149, thumbnail: "https://owp.klarna.com/product/500x500/3003982710/Smeg-50-s-Style-TSF01BLMEU.jpg?ph=true" },
        { id: "el9", title: "Robot de Cocina KitchenAid", price: 599, thumbnail: "https://www.electroprecio.com/media/catalog/product/cache/1/thumbnail/600x400/9df78eab33525d08d6e5fb8d27136e95/5/k/5ksm70jpxeob.png" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Electrodomésticos`);
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
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>ELECTRODOMÉSTICOS</h2>
                    <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: "#423629" }}></div>
                </div>
                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-dark"></div></div>
                ) : (
                    <>
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
                        <div className="text-center mt-5">
                            <Link to="/"><button className="btn btn-dark rounded-pill fw-bold px-5 py-3 shadow-sm text-uppercase">Volver al menú</button></Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};