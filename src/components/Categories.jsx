import { Link } from 'react-router-dom';

const categories = [
    {
        id: 'ropa',
        name: 'Ropa',
        description: 'Camisas, vestidos, pantalones y más.',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop',
        featured: false,
    },
    {
        id: 'zapatos',
        name: 'Zapatos',
        description: 'Tenis, tacones, botas y sandalias.',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
        featured: false,
    },
    {
        id: 'accesorios',
        name: 'Accesorios',
        description: 'Bolsos, carteras, cinturones y más.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
        featured: false,
    },
];

function CategoryCard({ category }) {
    return (
        <Link
            to={`/productos?categoria=${category.id}`}
            className={`group relative block aspect-[3/4] overflow-hidden rounded-sm bg-gray-200 cursor-pointer ${category.featured ? 'md:-mt-12 shadow-2xl' : ''
                }`}
        >
            <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-8 w-full">
                <div className="flex justify-between items-end border-b border-white/30 pb-4 mb-4">
                    <h3 className="font-display text-3xl font-bold text-white uppercase">
                        {category.name}
                    </h3>
                    <span className="material-icons text-white transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        arrow_forward
                    </span>
                </div>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    {category.description}
                </p>
            </div>
        </Link>
    );
}

export default function Categories() {
    return (
        <section id="categorias" className="py-20 bg-white dark:bg-black border-y border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="font-display text-4xl font-bold uppercase text-primary dark:text-white mb-2">
                            Categorías
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Encuentra lo que buscas en nuestras categorías.
                        </p>
                    </div>
                    <Link
                        to="/categorias"
                        className="hidden sm:flex items-center text-sm font-bold uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-primary dark:text-white cursor-pointer"
                    >
                        Ver todo
                        <span className="material-icons text-sm ml-1">arrow_forward</span>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
}
