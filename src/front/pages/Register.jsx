import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
        } else if (password.length < 8) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;
        const url = backendUrl + "/api/register";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert("Usuario creado con éxito. Ahora puedes loguearte.");
                navigate("/login");
            } else {
                const data = await response.json();
                setErrors({ server: data.msg || "Error al crear el usuario" });
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            setErrors({ server: "Error de conexión. Intenta de nuevo." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 pt-5" style={{ maxWidth: "400px" }}>
            <div className="card shadow p-4 border-0 rounded-4">
                <h2 className="text-center mb-4 fw-bold">CREAR CUENTA</h2>
                <form onSubmit={handleSubmit}>
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
                            placeholder="Mínimo 8 caracteres"
                        />
                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input
                            type="password"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                            }}
                            placeholder="Repite tu contraseña"
                        />
                        {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                    </div>

                    {errors.server && <div className="alert alert-danger">{errors.server}</div>}

                    <button
                        type="submit"
                        className="btn btn-dark w-100 fw-bold"
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "REGISTRARME"}
                    </button>
                </form>
            </div>
        </div>
    );
};