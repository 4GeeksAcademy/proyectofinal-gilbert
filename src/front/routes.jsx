import React from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Carrito } from "./pages/Carrito";
import { Single } from "./pages/Single";
import { Ordenadores } from "./pages/Ordenadores";
import { Mobilidad } from "./pages/Mobilidad";
import { Accesorios } from "./pages/Accesorios";
import { Tablets } from "./pages/Tablets";
import { Consolas } from "./pages/Consolas";
import { Apple } from "./pages/Apple";
import { Electrodomesticos } from "./pages/Electrodomesticos";
import { Telefonos } from "./pages/Telefonos";
import { Otros } from "./pages/Otros";
import { Perifericos } from "./pages/Perifiericos";

const AppRoutes = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<Login />} path="/login" />
                <Route element={<Register />} path="/register" />
                <Route element={<Profile />} path="/profile" />
                <Route element={<Carrito />} path="/carrito" />
                <Route element={<Single />} path="/single/:theid" />
                <Route element={<Ordenadores />} path="/ordenadores" />
                <Route element={<Mobilidad />} path="/mobilidad" />
                <Route element={<Accesorios />} path="/accesorios" />
                <Route element={<Tablets />} path="/tablets" />
                <Route element={<Consolas />} path="/consolas" />
                <Route element={<Apple />} path="/apple" />
                <Route element={<Electrodomesticos />} path="/electrodomesticos" />
                <Route element={<Telefonos />} path="/telefonos" />
                <Route element={<Otros />} path="/otros" />
                <Route element={<Perifericos />} path="/perifericos" />
                <Route element={<h1>Not found!</h1>} path="*" />
            </Routes>
            <Footer />
        </>
    );
};

export default AppRoutes;