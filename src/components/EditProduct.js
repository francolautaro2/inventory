'use client'
import React, { useState, useEffect } from 'react';

export default function EditProduct({ showForm, onClose, product }) {
    const [codigo, setCodigo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (product) {
            setCodigo(product.code);
            setDescripcion(product.description);
            setStock(product.quantity);
            setPrecio(product.price);
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Convertir los valores de precio y stock a números
            const precioNumero = parseFloat(precio);
            const stockNumero = parseInt(stock);
    
            const body = {
                descripcion,
                stock: stockNumero,
                precio: precioNumero,
            };
    
            // Verificar si los datos del formulario son iguales a los del producto original
            const datosIguales = (
                product &&
                descripcion === product.description &&
                stockNumero === product.quantity &&
                precioNumero === product.price
            );
    
            if (datosIguales) {
                // Si los datos son iguales, no se realiza la edición
                setSuccessMessage('No se realizaron cambios en el producto.');
                setErrorMessage('');
                onClose();
                return;
            }
    
            const response = await fetch(`http://localhost:3000/api/products/${codigo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
    
            const data = await response.json();
            setSuccessMessage(data.message || 'Producto editado exitosamente');
            setErrorMessage('');
            onClose(); // Oculta el formulario después de la actualización exitosa
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');
        }
    };
    
    if (!showForm) return null;

    return (
        <div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="fixed inset-0 bg-gray-800 opacity-50"></div>
                    <div className="bg-white p-8 rounded shadow-md relative">
                        <p className="text-green-500">{successMessage}</p>
                    </div>
                </div>
            )}
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <div className="p-10 bg-white p-8 rounded shadow-md relative z-50">
                    <h2 className="text-lg font-semibold mb-4 text-center">Editar Producto</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block" htmlFor="codigo">Código:</label>
                            <input
                                type="text"
                                id="codigo"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                required
                                className="border rounded px-2 py-1"
                                disabled
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block" htmlFor="descripcion">Descripción:</label>
                            <input
                                type="text"
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                                className="border rounded px-2 py-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block" htmlFor="precio">Precio:</label>
                            <input
                                type="number"
                                id="precio"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                required
                                className="border rounded px-2 py-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block" htmlFor="stock">Stock:</label>
                            <input
                                type="number"
                                id="stock"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                                className="border rounded px-2 py-1"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Editar Producto
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={onClose}
                            >
                                Cerrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}




