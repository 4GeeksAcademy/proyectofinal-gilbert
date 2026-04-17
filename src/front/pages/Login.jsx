import React, { useState, useContext } from "react";
import { Context } from "../store";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const { store, dispatch } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "El email es requerido";
        } else if (!validateEmail(email)) {
            newErrors.email = "Formato de email inválido";
        }

        if (!password) {
            newErrors.password = "La contraseña es requerida";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const url = backendUrl + "/api/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: "login", payload: { token: data.token, user: email } });

                const cartResponse = await fetch(backendUrl + "/api/cart", {
                    headers: { "Authorization": `Bearer ${data.token}` }
                });
                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();
                    dispatch({ type: "load_cart", payload: cartData });
                }

                navigate("/");
            } else {
                const data = await response.json();
                setErrors({ server: data.msg || "Credenciales inválidas" });
            }
        } catch (error) {
            console.error("Error en el login:", error);
            setErrors({ server: "Error de conexión. Intenta de nuevo." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 pt-5" style={{ maxWidth: "400px" }}>
            <div className="card shadow p-4 border-0 rounded-4">
                <h2 className="text-center mb-4 fw-bold">LOGIN</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            placeholder="tu@email.com"
                        />
                        {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: '' });
                            }}
                            placeholder="Tu contraseña"
                        />
                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>

                    {errors.server && <div className="alert alert-danger">{errors.server}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold text-white"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "ENTRAR"}
                    </button>
                </form>
            </div>
        </div>
    );
};