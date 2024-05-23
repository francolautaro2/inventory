import Link from 'next/link';

const Navbar = () => {
    return (
      <nav className="bg-gray-800 py-4 px-6 fixed top-0 left-0 h-full z-10 flex flex-col">
        <div>
          <h1 className="text-white text-2xl font-bold">Inventory</h1>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/dashboard" passHref>
            <span className="text-white hover:text-gray-300 cursor-pointer">Dashboard</span>
          </Link>
          <Link href="/ventas" passHref>
            <span className="text-white hover:text-gray-300 cursor-pointer">Ventas</span>
          </Link>
        </div>
      </nav>
    );
  };
  
  export default Navbar;