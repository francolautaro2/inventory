'use client'
import { useState, useEffect } from 'react';

// read all products from the api
async function LoadProducts() {
  const res = await fetch('http://localhost:3000/api/products');
  const data = await res.json();
  return data;
}

export default function Caja() {
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [tiempoApertura, setTiempoApertura] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([{ codigo: '', description: '', cantidad: 0, precio: 0 }]);
  const [total, setTotal] = useState(0);
  const [listaProductos, setListaProductos] = useState([]);

  useEffect(() => {
    calcularTotal();
  }, [productos]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productos = await LoadProducts();
        setListaProductos(productos);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    }

    fetchProducts();
  }, []);

  const abrirCaja = () => {
    setCajaAbierta(true);
    setTiempoApertura(new Date());
  };

  const cerrarCaja = () => {
    setCajaAbierta(false);
  };

  const agregarProducto = () => {
    setProductos([...productos, { codigo: '', description: '', cantidad: 0, precio: 0 }]);
  };

  const registrarVenta = () => {
    if (cajaAbierta) {
      const nuevasVentas = productos.map(producto => ({ ...producto, tiempo: new Date() }));
      setVentas([...ventas, ...nuevasVentas]);
      setProductos([{ codigo: '', description: '', cantidad: 0, precio: 0 }]);
    } else {
      console.log('La caja está cerrada. No se puede registrar la venta.');
    }
  };

  const calcularTotal = () => {
    let nuevoTotal = productos.reduce((total, producto) => total + (producto.cantidad || 0) * (producto.precio || 0), 0);
    setTotal(nuevoTotal);
  };

  const handleProductoChange = (index, value) => {
    const newProductos = [...productos];
    newProductos[index].codigo = value;

    const productoEncontrado = listaProductos.find(prod => prod.code === value);
    if (productoEncontrado) {
      newProductos[index].description = productoEncontrado.description;
      newProductos[index].precio = productoEncontrado.price;
    } else {
      newProductos[index].description = '';
      newProductos[index].precio = 0;
    }

    setProductos(newProductos);
  };

  const handleCantidadChange = (index, value) => {
    const newProductos = [...productos];
    newProductos[index].cantidad = parseInt(value) || 0;
    setProductos(newProductos);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Caja</h1>
      {cajaAbierta ? (
        <p>Caja abierta desde: {tiempoApertura.toLocaleString()}</p>
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={abrirCaja}>Abrir Caja</button>
      )}

      {cajaAbierta && (
        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Registrar Venta</h2>
          {productos.map((producto, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor={`codigo-${index}`} className="block mb-1">Código del Producto:</label>
                <input type="text" id={`codigo-${index}`} value={producto.codigo} onChange={(e) => {
                  handleProductoChange(index, e.target.value);
                }} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-grow">
                <label htmlFor={`description-${index}`} className="block mb-1">Descripción:</label>
                <input type="text" id={`description-${index}`} value={producto.description} readOnly className="w-full border rounded px-3 py-2 bg-gray-200" />
              </div>
              <div className="flex-grow">
                <label htmlFor={`cantidad-${index}`} className="block mb-1">Cantidad:</label>
                <input type="number" id={`cantidad-${index}`} value={producto.cantidad} onChange={(e) => {
                  handleCantidadChange(index, e.target.value);
                }} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex-grow">
                <label htmlFor={`precio-${index}`} className="block mb-1">Precio:</label>
                <input type="number" id={`precio-${index}`} value={producto.precio} readOnly className="w-full border rounded px-3 py-2 bg-gray-200" />
              </div>
            </div>
          ))}
          <div className="flex gap-4 mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={registrarVenta}>Registrar</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={agregarProducto}>Agregar Producto</button>
          </div>
          <div className="mt-4">
            <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={cerrarCaja}>Cerrar Caja</button>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Ventas Registradas</h2>
        <ul className="list-disc pl-4 mt-2">
          {ventas.map((venta, index) => (
            <li key={index} className="mb-2">
              {venta.description} - Cantidad: {venta.cantidad} - Precio: ${venta.precio.toFixed(2)} - Fecha y Hora: {venta.tiempo.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}




