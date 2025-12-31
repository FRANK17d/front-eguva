import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Features from '../components/Features';
import Products from '../components/Products';
import Newsletter from '../components/Newsletter';
import SEO from '../components/SEO';

export default function HomePage() {
    return (
        <>
            <SEO
                title="Eguva - Ropa de Segunda Mano en Perú | Moda Sostenible"
                description="Tienda peruana de ropa, zapatos y accesorios de segunda mano en excelente estado. Moda sostenible a precios justos en soles. Envíos a todo el Perú."
                keywords="ropa segunda mano peru, ropa usada trujillo, moda sostenible, ropa barata peru, eguva"
            />
            <Hero />
            <Categories />
            <Products />
            <Features />
            <Newsletter />
        </>
    );
}
