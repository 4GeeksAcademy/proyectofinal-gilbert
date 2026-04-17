import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Apple = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosFijos = [
        { id: "a1", title: "iPad Pro M4 13-inch", price: 1569, thumbnail: "https://ipowerresale.com/cdn/shop/files/media_b69809b8-c1ac-4bd2-b825-cd876e94b543_1946x.png?v=1771398538" },
        { id: "a2", title: "Apple Watch Ultra 2", price: 899, thumbnail: "https://www.powerplanetonline.com/cdnassets/products/96535/Apple-Watch-Ultra-2-GPS-+-Cellular-49mm-Bronceado-001_l.webp" },
        { id: "a3", title: "AirPods Max", price: 579, thumbnail: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-max-select-pink-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604022365000" },
        { id: "a4", title: "Mac Studio M2 Ultra", price: 4199, thumbnail: "https://static.wixstatic.com/media/30a41e_826d00da52e04e13959992b4d5d2a232~mv2.png/v1/fill/w_560,h_560,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/30a41e_826d00da52e04e13959992b4d5d2a232~mv2.png" },
        { id: "a5", title: "MacBook Pro 14 M3", price: 1999, thumbnail: "https://ssr.col.movistar.es/api/v3/get-pic/content/dam/movistar/estaticos/imagenes/dispositivos/apple/macbook/macbook-pro-14-m3-space-grey-01.png?oe=png&v=mnok7mr9" },
        { id: "a6", title: "Apple TV 4K 128GB", price: 189, thumbnail: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=1076&hei=1040&fmt=jpeg&qlt=90&.v=1664394625512" },
        { id: "a7", title: "iMac 24-inch M3", price: 1619, thumbnail: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/imac-24-blue-selection-hero-202310?wid=904&hei=840&fmt=p-jpg&qlt=80&.v=1697303033333" },
        { id: "a8", title: "Magic Keyboard TouchID", price: 159, thumbnail: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MK293?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1623348123000" },
        { id: "a9", title: "AirTag Pack 4", price: 129, thumbnail: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airtag-4pack-select-202104?wid=904&hei=840&fmt=p-jpg&qlt=80&.v=1617761672000" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Zona Apple`);
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
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>ZONA APPLE</h2>
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