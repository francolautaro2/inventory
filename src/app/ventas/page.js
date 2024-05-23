'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

async function LoadProducts() {
  const res = await fetch('http://localhost:3000/api/products');
  const data = await res.json();
  return data;
}

async function updateProductStock(code, newStock) {
  const res = await fetch(`http://localhost:3000/api/products/${code}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stock: newStock }),
  });

  if (!res.ok) {
    throw new Error('Failed to update product stock');
  }

  return res.json();
}

export default function Caja() {
  const [loading, setLoading] = useState(true);
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [tiempoApertura, setTiempoApertura] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([{ codigo: '', descripcion: '', cantidad: 0, precio: 0 }]);
  const [total, setTotal] = useState(0);
  const [listaProductos, setListaProductos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const savedCajaAbierta = localStorage.getItem('cajaAbierta');
        if (savedCajaAbierta) setCajaAbierta(JSON.parse(savedCajaAbierta));

        const savedTiempoApertura = localStorage.getItem('tiempoApertura');
        if (savedTiempoApertura) setTiempoApertura(new Date(savedTiempoApertura));

        const savedVentas = localStorage.getItem('ventas');
        if (savedVentas) setVentas(JSON.parse(savedVentas));

        const savedProductos = localStorage.getItem('productos');
        if (savedProductos) setProductos(JSON.parse(savedProductos));

        setLoading(false); // Indicar que la carga ha finalizado
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }

    fetchData();
  }, []);

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

  useEffect(() => {
    if (!loading) {
      // Solo guardar en localStorage si la carga ha finalizado
      localStorage.setItem('cajaAbierta', JSON.stringify(cajaAbierta));
      if (tiempoApertura instanceof Date && !isNaN(tiempoApertura)) {
        localStorage.setItem('tiempoApertura', tiempoApertura.toISOString());
      } else {
        localStorage.removeItem('tiempoApertura'); // Remover el valor si no es válido
      }
      localStorage.setItem('ventas', JSON.stringify(ventas));
      localStorage.setItem('productos', JSON.stringify(productos));
    }
  }, [loading, cajaAbierta, tiempoApertura, ventas, productos]);


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
    setTiempoApertura(null); // Reiniciar el tiempo de apertura
    setVentas([]); // Reiniciar las ventas
    setProductos([{ codigo: '', descripcion: '', cantidad: 0, precio: 0 }]); // Reiniciar los productos

    if (typeof window !== 'undefined') {
      localStorage.removeItem('cajaAbierta');
      localStorage.removeItem('tiempoApertura');
      localStorage.removeItem('ventas');
      localStorage.removeItem('productos');
    }
  };

  const agregarProducto = () => {
    setProductos([...productos, { codigo: '', descripcion: '', cantidad: 0, precio: 0 }]);
  };

  const registrarVenta = async () => {
    if (cajaAbierta) {
      try {
        const nuevasVentas = productos.map(producto => ({ ...producto, tiempo: new Date() }));
        setVentas([...ventas, ...nuevasVentas]);

        for (let producto of productos) {
          const productoEncontrado = listaProductos.find(prod => prod.code === producto.codigo);
          if (productoEncontrado) {
            const stockActual = parseInt(productoEncontrado.quantity);
            const cantidadVendida = parseInt(producto.cantidad);

            if (!isNaN(stockActual) && !isNaN(cantidadVendida)) {
              const nuevoStock = stockActual - cantidadVendida;
              await updateProductStock(producto.codigo, nuevoStock);
            } else {
              console.error(`Stock o cantidad no válidos para ${productoEncontrado.code}`);
            }
          }
        }

        setProductos([{ codigo: '', descripcion: '', cantidad: 0, precio: 0 }]);
      } catch (error) {
        console.error('Error al registrar la venta:', error);
      }
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
      newProductos[index].descripcion = productoEncontrado.description;
      newProductos[index].precio = productoEncontrado.price;
    } else {
      newProductos[index].descripcion = '';
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
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="flex h-screen">
          <Navbar />
          <div className="flex-1 ml-60 container mx-auto py-6">
            <h1 className="text-3xl font-semibold mb-6">Caja</h1>
            {cajaAbierta ? (
              <p>Caja abierta desde: {tiempoApertura ? tiempoApertura.toLocaleString() : ''}</p>
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
                      <input type="text" id={`codigo-${index}`} value={producto.codigo} onChange={(e) => handleProductoChange(index, e.target.value)} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div className="flex-grow">
                      <label htmlFor={`descripcion-${index}`} className="block mb-1">Descripción:</label>
                      <input type="text" id={`descripcion-${index}`} value={producto.descripcion} readOnly className="w-full border rounded px-3 py-2 bg-gray-200" />
                    </div>
                    <div className="flex-grow">
                      <label htmlFor={`cantidad-${index}`} className="block mb-1">Cantidad:</label>
                      <input type="number" id={`cantidad-${index}`} value={producto.cantidad} onChange={(e) => handleCantidadChange(index, e.target.value)} className="w-full border rounded px-3 py-2" />
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
                    {venta.descripcion} - Cantidad: {venta.cantidad} - Precio: ${venta.precio.toFixed(2)} - Fecha y Hora: {new Date(venta.tiempo).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}