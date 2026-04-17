import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store";
import { useNavigate, Link } from "react-router-dom";

export const Profile = () => {
    const { store, dispatch } = useContext(Context);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {
        if (!store.token) {
            navigate("/login");
        } else {
            setLoading(false);
        }
    }, [store.token, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (password && password.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
            const resp = await fetch(backendUrl + "/api/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + store.token
                },
                body: JSON.stringify({ email: email || undefined, password: password || undefined })
            });
            if (resp.ok) {
                alert("Perfil actualizado correctamente");
                setEmail("");
                setPassword("");
                fetchUserData();
            } else {
                const errorData = await resp.json();
                alert(errorData.msg || "Error al actualizar perfil");
            }
        } catch (error) { console.error(error); }
    };

    const handleLogout = () => {
        dispatch({ type: "logout" });
        navigate("/login");
    };

    const handleDelete = async () => {
        if (window.confirm("¿Eliminar cuenta permanentemente? Esta acción no se puede deshacer.")) {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
                const resp = await fetch(backendUrl + "/api/user", {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + store.token }
                });
                if (resp.ok) {
                    dispatch({ type: "logout" });
                    navigate("/");
                } else {
                    alert("Error al eliminar la cuenta");
                }
            } catch (error) { console.error(error); }
        }
    };

    const handleRemoveFromCart = (index) => {
        dispatch({ type: "remove_from_cart", payload: index });
    };

    const cartTotal = store.cart.reduce((acc, item) => acc + item.price, 0);

    if (loading) {
        return (
            <div className="container-fluid py-5" style={{ backgroundColor: "#CFD6EA", minHeight: "100vh" }}>
                <div className="text-center"><p>Cargando...</p></div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#CFD6EA", minHeight: "100vh" }}>
            <div className="container">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-3 mb-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "20px" }}>
                            <h5 className="fw-bold mb-4" style={{ color: "#423629" }}>Mi Cuenta</h5>
                            <div className="d-flex flex-column gap-2">
                                <button
                                    className={`btn text-start ${activeTab === "info" ? "btn-dark" : "btn-light"}`}
                                    onClick={() => setActiveTab("info")}
                                    style={{ borderRadius: "8px" }}
                                >
                                    <i className="fas fa-user me-2"></i> Mi Información
                                </button>
                                <button
                                    className={`btn text-start ${activeTab === "security" ? "btn-dark" : "btn-light"}`}
                                    onClick={() => setActiveTab("security")}
                                    style={{ borderRadius: "8px" }}
                                >
                                    <i className="fas fa-lock me-2"></i> Seguridad
                                </button>
                                <button
                                    className={`btn text-start ${activeTab === "cart" ? "btn-dark" : "btn-light"}`}
                                    onClick={() => setActiveTab("cart")}
                                    style={{ borderRadius: "8px" }}
                                >
                                    <i className="fas fa-shopping-cart me-2"></i> Mi Carrito ({store.cart.length})
                                </button>
                                <hr />
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline-secondary text-start w-100"
                                    style={{ borderRadius: "8px" }}
                                >
                                    <i className="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-9">
                        {activeTab === "info" && (
                            <div className="card border-0 shadow-sm rounded-4 p-5">
                                <h3 className="fw-bold mb-4" style={{ color: "#423629" }}>Mi Información</h3>

                                {store.user ? (
                                    <div className="mb-5 p-4 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <p className="text-muted small mb-1">EMAIL</p>
                                                <h5 className="fw-bold">{store.user.email || "No disponible"}</h5>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <p className="text-muted small mb-1">ID DE USUARIO</p>
                                                <h5 className="fw-bold">#{store.user.id || "No disponible"}</h5>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="p-4 rounded-3" style={{ backgroundColor: "#fff3cd" }}>
                                    <i className="fas fa-info-circle me-2" style={{ color: "#856404" }}></i>
                                    <span style={{ color: "#856404" }}>Tu información personal se mantiene segura y encriptada en nuestros servidores.</span>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="card border-0 shadow-sm rounded-4 p-5">
                                <h3 className="fw-bold mb-4" style={{ color: "#423629" }}>Seguridad</h3>

                                <form onSubmit={handleUpdate}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold mb-2">Nuevo Email</label>
                                        <input
                                            type="email"
                                            className="form-control rounded-3 p-3"
                                            placeholder="Ingresa un nuevo email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold mb-2">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control rounded-3 p-3"
                                            placeholder="Mínimo 8 caracteres"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-dark rounded-3 w-100 fw-bold py-3 mb-3">
                                        <i className="fas fa-save me-2"></i> Guardar Cambios
                                    </button>
                                </form>

                                <hr className="my-4" />

                                <h5 className="fw-bold mb-3">BORRAR CUENTA</h5>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-outline-danger rounded-3 w-100 fw-bold py-3"
                                >
                                    <i className="fas fa-trash me-2"></i> Eliminar Cuenta Permanentemente
                                </button>
                                <small className="text-muted d-block mt-2">⚠️ Esta acción no se puede deshacer</small>
                            </div>
                        )}

                        {/* Carrito Tab */}
                        {activeTab === "cart" && (
                            <div className="card border-0 shadow-sm rounded-4 p-5">
                                <h3 className="fw-bold mb-4" style={{ color: "#423629" }}>Mi Carrito</h3>

                                {store.cart.length > 0 ? (
                                    <>
                                        <div className="table-responsive mb-4">
                                            <table className="table table-hover">
                                                <thead style={{ backgroundColor: "#f8f9fa" }}>
                                                    <tr>
                                                        <th>Producto</th>
                                                        <th>Precio</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {store.cart.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="fw-bold">{item.name || "Producto"}</td>
                                                            <td>${item.price?.toFixed(2)}</td>
                                                            <td>
                                                                <button
                                                                    onClick={() => handleRemoveFromCart(index)}
                                                                    className="btn btn-sm btn-outline-danger rounded-2"
                                                                >
                                                                    <i className="fas fa-trash"></i> Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="p-4 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p className="text-muted mb-1">Subtotal ({store.cart.length} artículos)</p>
                                                    <h5 className="fw-bold">${(cartTotal / 1.21).toFixed(2)}</h5>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="text-muted mb-1">Total (con IVA 21%)</p>
                                                    <h4 className="fw-bold" style={{ color: "#423629" }}>${cartTotal.toFixed(2)}</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to="/carrito" className="btn btn-dark rounded-3 w-100 fw-bold py-3 mt-4">
                                            <i className="fas fa-shopping-cart me-2"></i> Ir al Carrito de Compras
                                        </Link>
                                    </>
                                ) : (
                                    <div className="text-center py-5">
                                        <i className="fas fa-shopping-cart" style={{ fontSize: "48px", color: "#ccc", marginBottom: "20px", display: "block" }}></i>
                                        <p className="text-muted mb-3">Tu carrito está vacío</p>
                                        <Link to="/" className="btn btn-dark rounded-3">
                                            Ir a Comprar
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};