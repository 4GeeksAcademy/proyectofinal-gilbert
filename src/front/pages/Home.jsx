import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store";

export const Home = () => {
    const { store } = useContext(Context);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const categoryImages = {
        "Ordenadores": "https://cdn.uc.assets.prezly.com/5b79cc3a-6778-4bc7-a620-346a387dc95d/aspire-vero_16-03.jpg",
        "Teléfonos": "https://eshopfrontend.orange.es/dw/image/v2/BJWB_PRD/on/demandware.static/-/Sites-devices-master-catalog/default/dw1cff043e/images/3004218/samsung_galaxy_s26_ultra_5g_morado_Frontback.png?sw=960&sh=720&sm=fit",
        "Tablets": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMxWB98zK5GNAwTDtRyynvkXqATXGMmYjbFQ&s",
        "Zona Apple": "https://www.pngmart.com/files/10/Apple-Logo-PNG-Photos.png",
        "Electrodomésticos": "https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/202311/28/00104721419812____37__1200x1200.jpg",
        "Otros": "https://storage.googleapis.com/catalog-pictures-carrefour-es/catalog/pictures/hd_510x_/8436589073265_1.jpg",
        "Consolas": "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$",
        "Mobilidad urbana": "https://catalogo.jazztel.com/catalogo/Imagenes/Dispositivos/xiaomi_electric_scooter_4_negro_Front.webp",
        "Accesorios": "https://images.ctfassets.net/hmm5mo4qf4mf/3amFutEPE0c8ogqBydJh0j/c8498e03f4aec03528328c08c2768670/arctis_nova_7_black_pdp_img_buy_06.png__1920x1080_crop-fit_optimize_subsampling-2-182.png?fm=webp&q=90&fit=scale&w=1920"
    };

    const getPath = (name) => {
        if (name === "Zona Apple") return "/apple";
        if (name === "Mobilidad urbana") return "/mobilidad";
        return `/${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
    };

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#CFD6EA", minHeight: "100vh" }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h1 className="display-3 fw-bold text-uppercase" style={{ color: "var(--taupe-dark)" }}>TECNOHOUSE</h1>
                    <p className="lead" style={{ color: "var(--grey-olive)" }}>Innovación premium en armonía con tu estilo.</p>
                </div>

                <div className="row g-4 justify-content-center">
                    {store.tech_categories.map((cat, index) => (
                        <div className="col-12 col-md-6 col-lg-4" key={cat}>
                            <Link to={getPath(cat)} className="text-decoration-none">
                                <div
                                    className="card h-100 border-0 text-center p-4 rounded-4 shadow-sm"
                                    style={{
                                        transition: "all 0.4s ease",
                                        backgroundColor: hoveredIndex === index ? "var(--pale-slate)" : "#FFFFFF",
                                        transform: hoveredIndex === index ? "translateY(-10px)" : "none"
                                    }}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: "180px" }}>
                                        <img
                                            src={categoryImages[cat] || "https://via.placeholder.com/200"}
                                            alt={cat}
                                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                                        />
                                    </div>
                                    <h2 className="fw-bold text-uppercase h5 m-0" style={{ color: "var(--olive-leaf)" }}>{cat}</h2>
                                    <p className="mt-2 text-muted small text-uppercase fw-bold">Ver catálogo</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};