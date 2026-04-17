import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store";

export const Navbar = () => {
    const { store, dispatch } = useContext(Context);
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg px-4 shadow-sm bg-white sticky-top">
            <div className="container-fluid">
                <div className="d-flex align-items-center gap-3">
                    <Link to="/" className="navbar-brand fw-bold text-dark" style={{ letterSpacing: "1px" }}>
                        TECNO<span style={{ color: "#423629" }}>HOUSE</span>
                    </Link>
                </div>

                <div className="d-flex align-items-center">
                    <Link to="/carrito" className="btn btn-outline-dark me-3 position-relative border-0 p-2">
                        <i className="fas fa-shopping-cart fs-5"></i>
                        {store.cart && store.cart.length > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: "0.65rem" }}
                            >
                                {store.cart.length}
                            </span>
                        )}
                    </Link>

                    {!store.token ? (
                        <div className="d-flex gap-2">
                            <Link to="/login" className="btn btn-light btn-sm fw-bold border text-uppercase" style={{ fontSize: "0.75rem" }}>
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-dark btn-sm fw-bold text-uppercase" style={{ fontSize: "0.75rem" }}>
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center gap-2">
                            {store.user && (
                                <span className="small fw-bold text-muted d-none d-md-inline">
                                    HOLA, {store.user.toUpperCase()}
                                </span>
                            )}
                            <Link to="/profile" className="btn btn-info btn-sm fw-bold text-uppercase" style={{ fontSize: "0.75rem" }}>
                                <i className="fas fa-user me-1"></i>Perfil
                            </Link>
                            <button
                                onClick={() => {
                                    dispatch({ type: "logout" });
                                    navigate("/");
                                }}
                                className="btn btn-danger btn-sm fw-bold text-uppercase"
                                style={{ fontSize: "0.75rem" }}
                            >
                                Salir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};