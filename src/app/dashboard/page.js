'use client'
import React, { useState, useEffect } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import { debounce } from 'lodash';
import CreateProduct from '@/components/CreateProduct';
import EditProduct from '@/components/EditProduct';
import Navbar from '@/components/Navbar';

// read all products from the api
async function LoadProducts() {
    const res = await fetch('http://localhost:3000/api/products');
    const data = await res.json();
    return data;
}

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showCreateProductForm, setShowCreateProductForm] = useState(false);
    const [showEditProductForm, setShowEditProductForm] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const allProductsData = await LoadProducts();
            setAllProducts(allProductsData);
            setFilteredProducts(allProductsData); // Initially, show all products
        };

        fetchProducts();
    }, []);

    const debouncedSearch = debounce((searchTerm) => {
        const filteredProducts = allProducts.filter(product =>
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filteredProducts);
    }, 300);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleEditProduct = (product) => {
        setProductToEdit(product);
        setShowEditProductForm(true);
    };

    const rowRenderer = ({ index, key, style }) => {
        const product = filteredProducts[index];
        return (
            <div key={key} style={style} className="flex border-t border-gray-200">
                <div className="px-4" style={{ flex: 1 }}>{product.code}</div>
                <div className="px-4" style={{ flex: 3 }}>{product.description}</div>
                <div className="px-4" style={{ flex: 1 }}>{product.quantity}</div>
                <div className="px-4" style={{ flex: 1 }}>{product.price}</div>
                <div className="px-4">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleEditProduct(product)}
                    >
                        Editar
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen">
            <Navbar/>
            <div className="flex flex-col flex-1 overflow-y-auto">
                <div className="flex-1 ml-60 container mx-auto py-6">
                    <h1 className="text-3xl font-semibold mb-6">Productos</h1>
                    <div className="flex justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o código..."
                            value={searchTerm}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-4 py-2"
                        />
                        <div>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                onClick={() => setShowCreateProductForm(true)}
                            >
                                Nuevo Producto 
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex border-b border-gray-200">
                            <div className="px-4 py-2 w-1/4">Código</div>
                            <div className="px-4 py-2 w-1/2">Descripción</div>
                            <div className="px-4 py-2 w-1/4">Stock</div>
                            <div className="px-4 py-2 w-1/4">Precio</div>
                        </div>
                        <AutoSizer disableHeight>
                            {({ width }) => (
                                <List
                                    width={width}
                                    height={700}
                                    rowCount={filteredProducts.length}
                                    rowHeight={50}
                                    rowRenderer={rowRenderer}
                                />
                            )}
                        </AutoSizer>
                    </div>
                </div>
            </div>
            <CreateProduct
                showForm={showCreateProductForm}
                onClose={() => setShowCreateProductForm(false)}
            />
            {productToEdit && (
                <EditProduct
                    product={productToEdit}
                    showForm={showEditProductForm}
                    onClose={() => setShowEditProductForm(false)}
                />
            )}
        </div>
    );
}