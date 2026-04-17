import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Otros = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosFijos = [
        { id: "o1", title: "DJI Mini 4 Pro", price: 999, thumbnail: "https://se-cdn.djiits.com/tpc/uploads/spu/cover/4ea419b081f38056785ae8665d473190@ultra.png" },
        { id: "o2", title: "Meta Quest 3 128GB", price: 549, thumbnail: "https://ssr.col.movistar.es/api/v3/get-pic/content/dam/movistar/estaticos/imagenes/accesorios/meta-quest-3-02.png?oe=png&v=mny8fttf" },
        { id: "o3", title: "GoPro HERO 12 Black", price: 399, thumbnail: "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_113093693/fee_786_587_png" },
        { id: "o4", title: "Amazon Echo Studio", price: 199, thumbnail: "https://m.media-amazon.com/images/G/30/kindle/journeys/fZx1QPegskpGAKpH/OGJhMDI0Y2Ut._CB799851361_.png" },
            { id: "o5", title: "Raspberry Pi 5 8GB", price: 85, thumbnail: "https://www.kubii.com/14207-full_default/raspberry-pi-5.jpg" },
            { id: "o6", title: "Anker 737 Power Bank", price: 149, thumbnail: "https://cdn.shopify.com/s/files/1/0765/2137/3999/files/4_c83967ac-fc36-4dc6-aca8-cb5fcb68984e.png?v=1724736462" },
        { id: "o7", title: "Philips Hue Light Bar", price: 139, thumbnail: "https://res-5.cloudinary.com/grover/image/upload/e_trim/c_limit,f_auto,fl_png8.lossy,h_500,q_auto,w_500/v1592928648/p5a1ioiyefu34slkchzp.png" },
        { id: "o8", title: "Bose SoundLink Flex", price: 149, thumbnail: "https://www.hdsbcn.com/3132-home_default/bose-soundlink-flex.jpg" },
        { id: "o9", title: "Sony SRS-XG300", price: 299, thumbnail: "https://www.sony.es/image/cab22dd4ddf51a6b3c44d29985ca9f10?fmt=png-alpha&wid=676&hei=400" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Otros`);
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
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>OTROS GADGETS</h2>
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