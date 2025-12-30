import { useEffect } from 'react';

/**
 * SEO Component - Updates document head with meta tags
 * Usage: <SEO title="Página" description="Descripción" />
 */
export default function SEO({
    title = 'Eguva - Ropa de Segunda Mano en Perú',
    description = 'Tienda peruana de ropa, zapatos y accesorios de segunda mano en excelente estado. Moda sostenible a precios justos.',
    keywords = '',
    image = '/favicon.png',
    url = ''
}) {
    useEffect(() => {
        // Update title
        document.title = title;

        // Helper to update or create meta tags
        const updateMeta = (name, content, isProperty = false) => {
            const attr = isProperty ? 'property' : 'name';
            let element = document.querySelector(`meta[${attr}="${name}"]`);

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Update meta tags
        updateMeta('description', description);
        if (keywords) updateMeta('keywords', keywords);

        // Open Graph
        updateMeta('og:title', title, true);
        updateMeta('og:description', description, true);
        if (image) updateMeta('og:image', image, true);
        if (url) updateMeta('og:url', url, true);

        // Twitter
        updateMeta('twitter:title', title, true);
        updateMeta('twitter:description', description, true);
        if (image) updateMeta('twitter:image', image, true);

    }, [title, description, keywords, image, url]);

    return null; // This component doesn't render anything
}
