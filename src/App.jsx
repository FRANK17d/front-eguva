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
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminRoute, GuestRoute } from './components/ProtectedRoute';

// Layout wrapper that conditionally shows Navbar and Footer
function Layout({ children }) {
  const location = useLocation();
  const authRoutes = ['/iniciar-sesión', '/registro', '/recuperar-contraseña'];
  const validRoutes = [
    '/', '/productos', '/categorias', '/sobre-nosotros',
    '/carrito', '/favoritos', '/preguntas-frecuentes', '/politicas-de-envio',
    ...authRoutes
  ];

  const decodedPath = decodeURIComponent(location.pathname);
  const isAuthPage = authRoutes.includes(decodedPath);
  const isAdminPage = decodedPath.startsWith('/admin');
  const is404Page = !validRoutes.includes(decodedPath) && !isAdminPage;
  const shouldHideLayout = isAuthPage || isAdminPage || is404Page;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-body transition-colors duration-300">
      {!shouldHideLayout && <Navbar />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </div>
  );
}

// Loading Overlay Component
function LogoutOverlay() {
  const { isLoggingOut } = useAuth();

  if (!isLoggingOut) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in">
      <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-2xl text-center">
        <svg className="animate-spin h-12 w-12 text-primary dark:text-white mx-auto mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-900 dark:text-white font-medium">Cerrando sesión...</p>
      </div>
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
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/sobre-nosotros" element={<AboutPage />} />
            <Route path="/iniciar-sesión" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/registro" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/recuperar-contraseña" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/favoritos" element={<WishlistPage />} />
            <Route path="/preguntas-frecuentes" element={<FAQPage />} />
            <Route path="/politicas-de-envio" element={<ShippingPolicyPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProducts />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="categorias" element={<AdminCategories />} />
              <Route path="clientes" element={<AdminCustomers />} />
              <Route path="configuracion" element={<AdminSettings />} />
            </Route>

            {/* 404 - Catch all routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
      <LogoutOverlay />
    </AuthProvider>
  );
}

export default App;

