import { NextResponse } from "next/server"
import { updateProduct, getProductByCode } from "@/app/lib/db";

// obtiene el producto pasandole su codigo
export async function GET(request, { params }) {
    try {
        const codigo = params.codigo; // Obtener el código de los parámetros

        // Obtener el producto por su código
        const product = await getProductByCode(codigo);

        // Si no se encuentra el producto, devuelve un error
        if (!product) {
            return NextResponse.error("Producto no encontrado", { status: 404 });
        }

        // Devolver el producto como respuesta
        return NextResponse.json({ product });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return NextResponse.error("Ocurrió un error al intentar obtener el producto", { status: 500 });
    }
}


// Actualiza el producto pasandole su codigo
export async function PUT(request, { params }) {
    try {
        const codigo = params.codigo;
        const body = await request.json();
        const { stock } = body;

        if (typeof stock !== 'number') {
            return new Response("El campo 'stock' es obligatorio y debe ser un número", { status: 400 });
        }

        const existingProduct = await getProductByCode(codigo);
        if (!existingProduct) {
            return new Response("Producto no encontrado", { status: 404 });
        }

        const nuevoStock = stock >= 0 ? stock : 0;

        await updateProduct(codigo, existingProduct.description, nuevoStock, existingProduct.price);

        return new Response(JSON.stringify({ message: "Stock actualizado correctamente" }), { status: 200 });
    } catch (error) {
        console.error("Error al actualizar el stock del producto:", error);
        return new Response("Ocurrió un error al intentar actualizar el stock del producto", { status: 500 });
    }
}

