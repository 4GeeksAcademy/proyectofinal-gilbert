import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "../store";

import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { Home } from "./Home.jsx";
import { Carrito } from "./Carrito.jsx";

import { Ordenadores } from "./Ordenadores.jsx";
import { Telefonos } from "./Telefonos.jsx";
import { Tablets } from "./Tablets.jsx";
import { Apple } from "./Apple.jsx";
import { Electrodomesticos } from "./Electrodomesticos.jsx";
import { Perifericos } from "./Perifiericos.jsx";
import { Consolas } from "./Consolas.jsx";
import { Mobilidad } from "./Mobilidad.jsx";
import { Accesorios } from "./Accesorios.jsx";
import { Otros } from "./Otros.jsx";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    return (
        <BrowserRouter basename={basename}>
            <Navbar />
            <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<Carrito />} path="/cart" />

                <Route element={<Telefonos />} path="/telefonos" />
                <Route element={<Tablets />} path="/tablets" />
                <Route element={<Ordenadores />} path="/ordenadores" />
                <Route element={<Apple />} path="/apple" />
                <Route element={<Electrodomesticos />} path="/electrodomesticos" />
                <Route element={<Perifericos />} path="/perifericos" />
                <Route element={<Consolas />} path="/consolas" />
                <Route element={<Mobilidad />} path="/mobilidad" />
                <Route element={<Accesorios />} path="/accesorios" />
                <Route element={<Otros />} path="/otros" />

                <Route element={<h1>Not Found</h1>} path="*" />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default injectContext(Layout);