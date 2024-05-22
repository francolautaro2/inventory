import React from 'react';

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <header className="py-5 px-10 bg-white shadow-md w-full flex justify-center items-center">
        <nav className="flex space-x-8">
          <a href="#precios" className="text-gray-700 hover:text-gray-900 border-b-2 border-black">Precios</a>
          <a href="#faq" className="text-gray-700 hover:text-gray-900 border-b-2 border-black">FAQ</a>
        </nav>
      </header>
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-2xl mb-40"> {/* Ajuste del margen superior */}
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Gestiona tu Inventario con Inteligencia Artificial
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Utiliza nuestra plataforma para optimizar tus inventarios, analizar precios y tendencias del mercado con inteligencia artificial, y toma decisiones inteligentes para llevar tu negocio al siguiente nivel.
          </p>
          <button className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
            Regístrate ahora
          </button>
        </div>
      </main>
      <footer className="py-3 px-10 bg-white shadow-md w-full text-center">
        <p className="text-gray-600">&copy; 2024 Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

