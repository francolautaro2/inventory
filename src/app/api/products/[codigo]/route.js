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
        // Obtener el código del producto de los parámetros
        const codigo = params.codigo;

        // Verificar si el cuerpo de la solicitud contiene los datos necesarios
        const body = await request.json();
        const { descripcion, stock, precio } = body;

        if (!descripcion || !precio || !stock) {
            return new Response("Faltan campos obligatorios en la solicitud", { status: 400 });
        }

        // Obtener el producto actual por su código
        const existingProduct = await getProductByCode(codigo);
        if (!existingProduct) {
            return new Response("Producto no encontrado", { status: 404 });
        }

        // Actualizar el producto en la base de datos
        await updateProduct(codigo, descripcion, stock, precio);

        // Devolver un mensaje de éxito
        return NextResponse.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        return new Response("Ocurrió un error al intentar actualizar el producto", { status: 500 });
    }
}