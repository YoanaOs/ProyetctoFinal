import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productosPath = path.join(__dirname, '../productos.json');
let productos = [];

// Cargar productos al iniciar el servidor
const loadProductos = async () => {
    try {
        const data = await fs.readFile(productosPath, 'utf8');
        productos = JSON.parse(data);
    } catch (err) {
        console.error('Error al leer los productos:', err);
    }
};

loadProductos();

// Mostrar productos
export const mostrarProductos = (req, res) => {
    if (productos.length === 0) {
        return res.status(500).json({ message: 'No se cargaron los productos.' });
    }
    res.json(productos);
};

// Agregar un producto al carrito
export const agregarCarrito = (req, res) => {
    const { producto } = req.body;

    if (!req.session.carrito) {
        req.session.carrito = [];
    }

    const existingProduct = req.session.carrito.find(item => item.id === producto.id);
    if (existingProduct) {
        existingProduct.cantidad += 1;
    } else {
        req.session.carrito.push({ ...producto, cantidad: 1 });
    }

    res.status(200).json({ message: 'Producto agregado al carrito', carrito: req.session.carrito });
};

// Ver el carrito
export const verCarrito = (req, res) => {
    res.status(200).json({ carrito: req.session.carrito || [] });
};

// Vaciar el carrito
export const vaciarCarrito = (req, res) => {
    req.session.carrito = [];
    res.status(200).json({ message: 'Carrito vaciado' });
};

// Procesar el pago
export const procesarPago = (req, res) => {
    const total = req.session.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const saldo = req.session.saldo || 0;

    if (saldo >= total) {
        req.session.saldo -= total;
        req.session.carrito = []; 
        return res.status(200).json({ message: 'Pago procesado con éxito' });
    } else {
        return res.status(400).json({ message: 'Saldo insuficiente' });
    }
};

// Obtener saldo
export const obtenerSaldo = (req, res) => {
    const saldo = req.session.saldo || 0;
    res.status(200).json({ saldo });
};

// Recargar saldo
export const recargarSaldo = (req, res) => {
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
        return res.status(400).json({ message: 'Cantidad inválida' });
    }

    req.session.saldo = (req.session.saldo || 0) + cantidad;
    res.status(200).json({ message: 'Saldo recargado con éxito', saldo: req.session.saldo });
};

// Quitar un producto del carrito
export const quitarProducto = (req, res) => {
    const { id } = req.params;
    if (!req.session.carrito || req.session.carrito.length === 0) {
        return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    const carrito = req.session.carrito;
    const index = carrito.findIndex(item => item.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
    }

    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1;
    } else {
        carrito.splice(index, 1); 
    }
    res.status(200).json({ message: 'Producto eliminado del carrito', carrito });
};






