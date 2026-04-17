import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import { Link } from "react-router-dom";

export const Accesorios = () => {
    const { store, dispatch } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productosFijos = [
        { id: "acc1", title: "Logitech MX Master 3S", price: 129, thumbnail: "" },
        { id: "acc2", title: "Keychron K2 V2 Wireless", price: 99, thumbnail: "https://keychron.com.es/cdn/shop/files/1745114949_0_2048x.png?v=1282386202502886265" },
        { id: "acc3", title: "Sony WH-1000XM5", price: 349, thumbnail: "https://www.powerplanetonline.com/cdnassets/sony_wh_1000xm5_negro_001_l_sf.webp" },
        { id: "acc4", title: "Elgato Stream Deck MK.2", price: 149, thumbnail: "https://media.lifeinformatica.com/contents/assets/STELG000/imgs/10GBA9901-01.png" },
        { id: "acc5", title: "Samsung T7 Shield 2TB", price: 180, thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl_E2f-xkJJNZrsWnhV2gN98i2ZV-l09-L3g&s" },
        { id: "acc6", title: "Razer BlackWidow V4", price: 199, thumbnail: "https://assets3.razerzone.com/vU-2VHqbcwmBoDl_78_x_1BshhA=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh8f%2Fh57%2F9640099217438%2Fblackwidow-v4-black-x-500x500.png" },
        { id: "acc7", title: "SteelSeries Arctis Nova 7", price: 179, thumbnail: "https://images.ctfassets.net/hmm5mo4qf4mf/4Oc8npNxtFFS4OigQkDlnC/063cac64ca5dda1156ff0f0fb1b00322/arctis_nova_7_black_pdp_img_buy_04.png__1920x1080_crop-fit_optimize_subsampling-2-180.png" },
        { id: "acc8", title: "HyperX SoloCast Mic", price: 65, thumbnail: "https://media.game.es/COVERV2/3D_L/258/258392.png" },
        { id: "acc9", title: "Logitech C920 HD Pro", price: 85, thumbnail: "https://www.neobyte.es/9878-thickbox_default/webcam-logitech-c920-pro.jpg" }
    ];

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products?category=Accesorios`);
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
                    <h2 className="display-5 fw-bold text-uppercase" style={{ color: "#423629" }}>ACCESORIOS</h2>
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