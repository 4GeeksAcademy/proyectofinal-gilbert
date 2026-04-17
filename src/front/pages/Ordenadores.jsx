import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Ordenadores = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosFijos = [
        { id: "pc1", title: "MacBook Air M3 13\"", price: 1299, thumbnail: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/mba_13_m3_2024_hero.png" },
        { id: "pc2", title: "Dell XPS 13 Plus", price: 1499, thumbnail: "https://amso.eu/hpeciai/806c7ac1673c59aff27dcef6c9b89be7/spa_pl_Dell-XPS-13-PLUS-9320-Graphite-i7-1260P-16GB-1TB-SSD-3840x2400-Nuevo-Windows-11-Professional-261596_1.webp" },
        { id: "pc3", title: "HP Victus 16 Gaming", price: 849, thumbnail: "https://www.hp.com/content/dam/sites/omen/worldwide/laptops/2023-victus-16-intel/Hero%20Image%203@2x.png" },
        { id: "pc4", title: "Lenovo Legion Slim 5", price: 1399, thumbnail: "https://p3-ofp.static.pub//fes/cms/2025/03/11/bqvn6m2uj43afntp59yynzmg2culsz550213.png" },
        { id: "pc5", title: "Asus Zenbook Duo 2024", price: 2099, thumbnail: "https://dlcdnwebimgs.asus.com/gain/e1c062dc-b3ad-4b84-b310-eda9f5984d2c/" },
        { id: "pc6", title: "iMac 24\" M3 Blue", price: 1619, thumbnail: "https://photos5.appleinsider.com/price_guide/imac-24-inch-m3-pg-header.png" },
        { id: "pc7", title: "MSI Katana 15", price: 1199, thumbnail: "https://storage-asset.msi.com/global/picture/image/feature/nb/GF/Katana-15-A13V/photo15-1.png" },
        { id: "pc8", title: "Microsoft Surface Laptop 5", price: 999, thumbnail: "https://www.ecopc.com/30277-large_default/microsoft-surface-laptop-5-silver-tactil-intel-core-i5-1245u-14-qhd.jpg" },
        { id: "pc9", title: "Acer Predator Helios Neo", price: 1249, thumbnail: "https://media.flixcar.com/webp/synd-asset/Acer-143358620-predator-helios-neo-16-phn16-72-4zone-backlit-on-wallpaper-black-01-wid-560-h-zoom.png" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Ordenadores`);
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
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>ORDENADORES</h2>
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
                                            <button
                                                className="btn btn-dark rounded-pill fw-bold py-2 mt-auto w-100"
                                                onClick={() => dispatch({ type: "add_to_cart", payload: item })}
                                            >
                                                AÑADIR AL CARRITO
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-5">
                            <Link to="/">
                                <button className="btn btn-dark rounded-pill fw-bold px-5 py-3 shadow-sm text-uppercase">
                                    Volver al menú
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};