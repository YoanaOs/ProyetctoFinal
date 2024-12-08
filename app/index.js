import express from "express";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from "url";

import { methods as authentication } from "./controllers/authentication.controller.js";
import { mostrarProductos, agregarCarrito, verCarrito, vaciarCarrito, procesarPago, obtenerSaldo, recargarSaldo,quitarProducto   } from "./controllers/productController.js";

// Configuración del servidor
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set("port", 4500);


// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'mi_clave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Rutas
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/pages/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "/pages/register.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "/pages/admin/admin.html")));
app.get("/carrito", (req, res) => res.sendFile(path.join(__dirname, "/pages/admin/Carrito.html")));
app.get("/pagar", (request, response) => response.sendFile(path.join(__dirname, "/pages/admin/recargar.html")));

// Rutas de autenticación
app.post("/api/login", authentication.login);
app.post("/api/register", authentication.register);

// Rutas de productos
app.get("/api/productos", mostrarProductos);
app.post("/api/agregar-carrito", agregarCarrito);
app.get("/api/ver-carrito", verCarrito);
app.post("/api/vaciar-carrito", vaciarCarrito);

app.post("/api/pagar", procesarPago);
app.get("/api/obtener-saldo", obtenerSaldo);
app.post("/api/recargar-saldo", recargarSaldo);
app.delete("/api/quitar-producto/:id", quitarProducto);

// Iniciar el servidor
app.listen(app.get("port"), '0.0.0.0', () => {
    console.log("Server running on port ", app.get("port"));
});
