import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Mobilidad = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosFijos = [
        { id: "mu1", title: "Xiaomi Electric Scooter 4 Pro", price: 699, thumbnail: "https://i01.appmifile.com/webfile/globalimg/pic/Electric-Scooter-4-Pro.png" },
        { id: "mu2", title: "SmartGyro RockWay", price: 629, thumbnail: "https://www.powerplanetonline.com/cdnassets/rockway_certificado800w01_l_sf.webp" },
        { id: "mu3", title: "Segway Ninebot Max G2", price: 799, thumbnail: "https://store-mx.segway.com/media/catalog/product/cache/d3ec3723470ff918c92e447639eaf984/m/a/max_g2_1.png" },
        { id: "mu4", title: "Bicicleta Eléctrica You-Ride", price: 849, thumbnail: "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_154552243/fee_786_587_png" },
        { id: "mu5", title: "Cecotec Bongo Serie Z+", price: 599, thumbnail: "https://media.cecotec.cloud/07306/bongo-z-off-road_6tpr16_1.png" },
        { id: "mu6", title: "Scooter NIU KQi3 Max", price: 899, thumbnail: "https://motoselectricasvalencia.com/wp-content/uploads/2021/11/kqi3negro.png" },
        { id: "mu7", title: "Dualtron Mini Special", price: 1090, thumbnail: "https://www.maxblinker.com/13021-panda_big_default/dualtron-mini-special-long-body-single-motor.jpg" },
        { id: "mu8", title: "Hoverboard Sk8 Go", price: 159, thumbnail: "https://www.sk8urban.es/wp-content/uploads/2018/06/SK8-Go-Plus-Azul-600x350.png" },
        { id: "mu9", title: "Casco Inteligente Livall", price: 129, thumbnail: "https://livall.com/cdn/shop/files/C21MidnightBlack.png?v=1774595908&width=1080" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Mobilidad urbana`);
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
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>MOBILIDAD URBANA</h2>
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
                <div className="text-center mt-5">
                    <Link to="/"><button className="btn btn-dark rounded-pill fw-bold px-5 py-3 text-uppercase">Volver al menú</button></Link>
                </div>
            </div>
        </div>
    );
};