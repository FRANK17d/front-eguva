import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import FAQPage from './pages/FAQPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';

// Layout wrapper that conditionally shows Navbar and Footer
function Layout({ children }) {
  const location = useLocation();
  const authRoutes = ['/iniciar-sesión', '/registro', '/recuperar-contraseña'];
  const decodedPath = decodeURIComponent(location.pathname);
  const isAuthPage = authRoutes.includes(decodedPath);
  const isAdminPage = decodedPath.startsWith('/admin');
  const shouldHideLayout = isAuthPage || isAdminPage;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-body transition-colors duration-300">
      {!shouldHideLayout && <Navbar />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </div>
  );
}

function App() {
  // Set dark mode based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/iniciar-sesión" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/recuperar-contraseña" element={<ForgotPasswordPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/favoritos" element={<WishlistPage />} />
          <Route path="/preguntas-frecuentes" element={<FAQPage />} />
          <Route path="/politicas-de-envio" element={<ShippingPolicyPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="pedidos" element={<AdminOrders />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="clientes" element={<AdminCustomers />} />
            <Route path="configuracion" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

