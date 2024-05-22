// app/api/products/route.js

import { NextResponse } from "next/server"
import { createProduct, getAllProducts } from "@/app/lib/db";

// Handles POST requests to /api/products
export async function POST(request) {
    try {
        const body = await request.json();

        // Verificar si el cuerpo de la solicitud contiene todos los campos necesarios
        if (!body.codigo || !body.descripcion || !body.precio || !body.stock) {
            return NextResponse.error("Faltan campos obligatorios en la solicitud", { status: 400 });
        }

        // Crear el nuevo producto en la base de datos
        const response = await createProduct(body.codigo, body.descripcion, body.precio, body.stock);

        return NextResponse.json({ message: "Producto creado exitosamente", product: response });
    } catch (error) {
        console.error("Error al crear el producto:", error);
        return NextResponse.error("Ocurrió un error al intentar crear el producto", { status: 500 });
    }
}

// Handler GET para obtener todos los productos y mostrarlos en dashboard
export async function GET(request) {
    try {
        // Obtener todos los productos de la base de datos
        const products = await getAllProducts();
        
        // Devolver una respuesta JSON con el array de productos
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        return NextResponse.error("Ocurrió un error al intentar obtener los productos", { status: 500 });
    }
}
