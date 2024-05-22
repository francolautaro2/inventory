const sqlite3 = require('sqlite3').verbose();

const dbPath = './warehouse.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err);
    } else {
        console.log('Base de datos abierta correctamente.');
    }
});

// Función para crear un nuevo producto
async function createProduct(codigo, description, price, stock) {
    const insertQuery = `INSERT INTO products (code, description, quantity, price) VALUES (?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
        // Verificar si la tabla products existe, y crearla si no
        db.run(`CREATE TABLE IF NOT EXISTS products (
            code TEXT PRIMARY KEY,
            description TEXT,
            quantity INTEGER,
            price REAL
        )`, [], (err) => {
            if (err) {
                reject(err);
            } else {
                // Insertar el producto después de asegurarse de que la tabla exista
                db.run(insertQuery, [codigo, description, price, stock], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Producto insertado correctamente con ID: ${this.lastID}`);
                    }
                });
            }
        });
    });
}

// Función para eliminar un producto por su código
async function deleteProduct(codigo) {
    const deleteQuery = `DELETE FROM products WHERE code = ?`;
    return new Promise((resolve, reject) => {
        db.run(deleteQuery, [codigo], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(`Producto eliminado correctamente`);
            }
        });
    });
}

// Función para actualizar un producto por su código
async function updateProduct(codigo, newDescription, newPrice, newStock) {
    const updateQuery = `UPDATE products SET description = ?, quantity = ?, price = ? WHERE code = ?`;
    return new Promise((resolve, reject) => {
        db.run(updateQuery, [newDescription, newPrice, newStock, codigo], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(`Producto actualizado correctamente`);
            }
        });
    });
}

async function getProductByCode(codigo) {
    const query = `SELECT * FROM products WHERE code = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [codigo], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}


// Obtener todos los productos de la db
async function getAllProducts() {
    const query = `SELECT * FROM products`;
    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Exportar las funciones
module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getProductByCode
};


