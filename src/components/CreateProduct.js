'use client'
import React, { useState } from 'react';

export default function CreateProduct({ showForm, onClose }) {
    const [codigo, setCodigo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codigo,
                    descripcion,
                    precio: parseFloat(precio),
                    stock: parseInt(stock)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            setSuccessMessage('Producto creado exitosamente');
            setCodigo('');
            setDescripcion('');
            setStock('');
            setPrecio('');
            setErrorMessage('');
            onClose();
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
                    <div className="bg-white p-8 rounded shadow-md relative text-center">
                        <p className="text-green-500">{successMessage}</p>
                    </div>
                </div>
            )}
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="p-10 bg-white p-8 rounded shadow-md relative z-50">
                        <h2 className="text-lg font-semibold mb-4 text-center">Crear Nuevo Producto</h2>
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
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                    className="border rounded px-2 py-1"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block" htmlFor="stock">Stock:</label>
                                <input
                                    type="number"
                                    id="stock"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    required
                                    className="border rounded px-2 py-1"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Crear Producto
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={onClose}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}



