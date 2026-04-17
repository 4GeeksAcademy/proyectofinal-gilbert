import React, { useContext, useState } from "react";
import { Context } from "../store";
import { Link, useNavigate } from "react-router-dom";

export const Carrito = () => {
    const { store, dispatch } = useContext(Context);
    const [showCheckout, setShowCheckout] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const navigate = useNavigate();

    const total = store.cart.reduce((acc, item) => acc + item.price, 0);
    const subtotal = (total / 1.21).toFixed(2);
    const iva = (total - parseFloat(subtotal)).toFixed(2);

    const handleCardChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 16) value = value.slice(0, 16);
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        setCardNumber(formattedValue);
    };

    const handleFinalPay = (e) => {
        e.preventDefault();
        const rawNumbers = cardNumber.replace(/\s/g, "");

        if (rawNumbers.length < 16) {
            alert("Error: El número de tarjeta debe tener exactamente 16 dígitos.");
            return;
        }

        alert("¡Pago procesado con éxito! Gracias por tu compra.");

        store.cart.forEach(() => {
            dispatch({ type: "remove_from_cart", payload: 0 });
        });

        navigate("/");
    };

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#CFD6EA", minHeight: "100vh" }}>
            <div className="container">
                <div className="bg-white rounded-4 shadow-lg p-4 p-md-5 border-0">

                    {!showCheckout ? (
                        <>
                            <div className="text-center mb-5">
                                <h2 className="display-6 fw-bold text-uppercase" style={{ color: "#423629" }}>
                                    Tu Carrito
                                </h2>
                                <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: "#423629" }}></div>
                            </div>

                            {store.cart.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="mb-4">
                                        <i className="fas fa-shopping-cart fa-4x text-muted opacity-25"></i>
                                    </div>
                                    <p className="fs-4 text-muted">No hay productos en el carrito</p>
                                    <Link to="/" className="btn btn-dark rounded-pill px-5 py-3 mt-3 fw-bold text-uppercase shadow-sm">
                                        Volver al menú
                                    </Link>
                                </div>
                            ) : (
                                <div className="row g-5">
                                    <div className="col-lg-7">
                                        <div className="table-responsive">
                                            <table className="table align-middle border-0">
                                                <thead>
                                                    <tr className="text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>
                                                        <th className="border-0 pb-3">Producto</th>
                                                        <th className="border-0 pb-3 text-end">Precio</th>
                                                        <th className="border-0 pb-3 text-end"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {store.cart.map((item, index) => (
                                                        <tr key={index} className="border-bottom">
                                                            <td className="py-4 border-0">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-light rounded-3 p-2 me-3" style={{ width: "60px", height: "60px" }}>
                                                                        <img src={item.thumbnail} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                                                    </div>
                                                                    <div>
                                                                        <span className="fw-bold d-block" style={{ fontSize: "0.85rem", color: "#423629" }}>{item.title}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-end fw-bold border-0" style={{ color: "#212529" }}>
                                                                {item.price.toLocaleString("es-ES")} €
                                                            </td>
                                                            <td className="text-end border-0">
                                                                <button
                                                                    className="btn btn-sm text-danger border-0 p-2 btn-delete-custom"
                                                                    onClick={() => dispatch({ type: "remove_from_cart", payload: index })}
                                                                >
                                                                    <i className="fas fa-trash-alt fs-5"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="col-lg-5">
                                        <div className="card border-0 rounded-4 shadow-sm p-4 h-100" style={{ backgroundColor: "#F9FAFB" }}>
                                            <h5 className="fw-bold mb-4 text-uppercase" style={{ letterSpacing: "1px", color: "#423629" }}>Detalle del pedido</h5>

                                            <div className="d-flex justify-content-between mb-3">
                                                <span className="text-muted">Subtotal (sin IVA)</span>
                                                <span className="fw-bold">{parseFloat(subtotal).toLocaleString("es-ES")} €</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-3">
                                                <span className="text-muted">IVA (21%)</span>
                                                <span className="fw-bold">{parseFloat(iva).toLocaleString("es-ES")} €</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-4">
                                                <span className="text-muted">Envío</span>
                                                <span className="text-success fw-bold text-uppercase">Gratis</span>
                                            </div>

                                            <div className="d-flex justify-content-between border-top pt-4 mb-5">
                                                <span className="h4 fw-bold text-uppercase">Total</span>
                                                <span className="h4 fw-bold text-dark">{total.toLocaleString("es-ES")} €</span>
                                            </div>

                                            <button
                                                className="btn btn-dark w-100 rounded-pill py-3 fw-bold mb-4 text-uppercase shadow-sm"
                                                onClick={() => setShowCheckout(true)}
                                                style={{ letterSpacing: "1px" }}
                                            >
                                                Pagar ahora
                                            </button>

                                            <div className="text-center mt-auto">
                                                <div className="d-flex justify-content-center gap-3 fs-2 opacity-25">
                                                    <i className="fab fa-cc-visa"></i>
                                                    <i className="fab fa-cc-mastercard"></i>
                                                    <i className="fab fa-apple-pay"></i>
                                                    <i className="fab fa-cc-paypal"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="row justify-content-center py-4">
                            <div className="col-md-8 col-lg-6">
                                <div className="text-center mb-5">
                                    <h3 className="fw-bold text-uppercase" style={{ color: "#423629" }}>Pasarela de Pago</h3>
                                    <div className="mx-auto" style={{ width: "40px", height: "3px", backgroundColor: "#423629" }}></div>
                                </div>

                                <form onSubmit={handleFinalPay} className="bg-light p-4 p-md-5 rounded-4 shadow-sm border">
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Nombre en la tarjeta</label>
                                        <input type="text" className="form-control border-0 py-3 shadow-sm" required placeholder="Juan Pérez" style={{ borderRadius: "10px" }} />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Número de tarjeta</label>
                                        <div className="input-group shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
                                            <span className="input-group-text bg-white border-0"><i className="fas fa-credit-card text-muted"></i></span>
                                            <input
                                                type="text"
                                                className="form-control border-0 py-3"
                                                value={cardNumber}
                                                onChange={handleCardChange}
                                                required
                                                placeholder="0000 0000 0000 0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-4 mb-4">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Expiración</label>
                                            <input type="text" className="form-control border-0 py-3 shadow-sm" required placeholder="MM/YY" maxLength="5" style={{ borderRadius: "10px" }} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">CVV</label>
                                            <input type="password" className="form-control border-0 py-3 shadow-sm" required placeholder="123" maxLength="3" style={{ borderRadius: "10px" }} />
                                        </div>
                                    </div>

                                    <div className="alert alert-secondary py-3 border-0 mt-2 mb-4 text-center" style={{ borderRadius: "10px", backgroundColor: "#e9ecef" }}>
                                        Total a pagar: <span className="fw-bold">{total.toLocaleString("es-ES")} €</span>
                                    </div>

                                    <div className="d-grid gap-3">
                                        <button type="submit" className="btn btn-dark btn-lg rounded-pill fw-bold py-3 text-uppercase shadow">
                                            Confirmar Pago
                                        </button>
                                        <button type="button" className="btn btn-link text-muted text-decoration-none small text-uppercase fw-bold" onClick={() => setShowCheckout(false)}>
                                            Cancelar y volver
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .btn-delete-custom { transition: all 0.2s ease; opacity: 0.7; }
                .btn-delete-custom:hover { opacity: 1; transform: scale(1.1); }
                .table tr:last-child { border-bottom: 0 !important; }
            `}</style>
        </div>
    );
};