import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Features from '../components/Features';
import Products from '../components/Products';
import Newsletter from '../components/Newsletter';

export default function HomePage() {
    return (
        <>
            <Hero />
            <Categories />
            <Products />
            <Features />
            <Newsletter />
        </>
    );
}
