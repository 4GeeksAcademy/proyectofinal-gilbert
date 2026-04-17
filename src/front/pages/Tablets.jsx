import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Tablets = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosFijos = [
        { id: "tab1", title: "iPad Pro M4 13\"", price: 1549, thumbnail: "https://yabloki.ua/media/cache/sylius_shop_product_original/d7/59/ipad-pro-13-m4-2024-wi-fi-256gb-space-black_0ac4a715-1f5b-4ca7-a6ee-6b5b9b05d1f1-1.png.webp" },
        { id: "tab2", title: "Samsung Galaxy Tab S9 Ultra", price: 1339, thumbnail: "https://images.samsung.com/is/image/samsung/p6pim/sa_en/2307/gallery/sa-en-galaxy-tab-s9-ultra-wifi-x910-sm-x910nzaemea-537336411?$Q90_1248_936_F_PNG$" },
        { id: "tab3", title: "iPad Air M2", price: 699, thumbnail: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/ipad-air-11-inch-m2.png" },
        { id: "tab4", title: "Microsoft Surface Pro 9", price: 1299, thumbnail: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/RE59GDk_slim-pen-2_platinum?fmt=png-alpha" },
        { id: "tab5", title: "Xiaomi Pad 6", price: 399, thumbnail: "https://i05.appmifile.com/322_item_es/28/06/2023/ce81c6db25ed8317e885436c24149552.png" },
        { id: "tab6", title: "Lenovo Tab P12 Pro", price: 799, thumbnail: "https://p2-ofp.static.pub/fes/cms/2021/10/28/juqs65pgl1gh3dysi7yv1tnvtsiqva364946.png?width=328&height=328" },
        { id: "tab7", title: "iPad Mini 6", price: 649, thumbnail: "https://stratanetworks.com/wp-content/uploads/2023/03/iPad-mini-6-1.png" },
        { id: "tab8", title: "Google Pixel Tablet", price: 679, thumbnail: "https://storage.googleapis.com/support-kms-prod/DwjEEz9EqLvL0HHbIZsdtjj2uMWg5KttRFxa" },
        { id: "tab9", title: "Amazon Fire HD 10", price: 164, thumbnail: "https://m.media-amazon.com/images/G/01/kindle/journeys/4gCupHtQJsWrVUKPAi7wxYCJfJV9FvBepbpY37PEvSA3D/Y2ZiNWIyYmMt._CB562506559_.png" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Tablets`);
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
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>TABLETS</h2>
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