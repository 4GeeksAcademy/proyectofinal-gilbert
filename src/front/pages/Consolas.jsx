import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Consolas = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosFijos = [
        { id: "con1", title: "PlayStation 5 Slim", price: 549, thumbnail: "https://cstech.store/cdn/shop/files/PS5-Digital30-Hero-1_800x.webp?v=1727739682" },
        { id: "con2", title: "Xbox Series X", price: 499, thumbnail: "https://cms-assets.xboxservices.com/assets/f0/8d/f08dfa50-f2ef-4873-bc8f-bcb6c34e48c0.png?n=642227_Hero-Gallery-0_C2_857x676.png" },
        { id: "con3", title: "Nintendo Switch OLED", price: 349, thumbnail: "https://ssr.col.movistar.es/api/v3/get-pic/content/dam/movistar/estaticos/imagenes/dispositivos/nintendo/switch-oled-02.png?oe=png&v=mny8fttf" },
        { id: "con4", title: "Steam Deck OLED", price: 569, thumbnail: "https://www.powerplanetonline.com/cdnassets/Steam-Deck-OLED-blanco-001_l_sf.webp" },
        { id: "con5", title: "Asus ROG Ally", price: 699, thumbnail: "https://dlcdnwebimgs.asus.com/gain/9FB97117-16EB-43F0-9E8D-79A98D860708" },
        { id: "con6", title: "PlayStation Portal", price: 219, thumbnail: "https://static.xtralife.com/conversions/98CX-Z5Q3464310-medium_w640_h480_q75-playstationportalconsola-1696339620.png" },
        { id: "con7", title: "Nintendo Switch Lite", price: 199, thumbnail: "https://media.lifeinformatica.com/contents/assets/VCNIN033/imgs/10002292-01.png" },
        { id: "con8", title: "Xbox Series S", price: 299, thumbnail: "https://cms-assets.xboxservices.com/assets/bf/b0/bfb06f23-4c87-4c58-b4d9-ed25d3a739b9.png?n=389964_Hero-Gallery-0_A1_857x676.png" },
        { id: "con9", title: "Meta Quest 3", price: 549, thumbnail: "https://lookaside.fbsbx.com/elementpath/media/?media_id=501577935807376&version=1748439923&transcode_extension=webp" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Consolas`);
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
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>CONSOLAS</h2>
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