import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/user/Login.jsx';
import SignUp from './pages/user/SignUp.jsx';
import Home from './pages/user/home.jsx';
import AllProductsPage from './pages/user/AllProduct.jsx';
import ProductDetail from './pages/user/ProductDetail.jsx';
import Cart from './pages/user/Cart.jsx';
import Checkout from './pages/user/Checkout.jsx';
import OrderConfirmation from './pages/user/OrderConfirmation.jsx';
import Profile from './pages/user/Profile.jsx';
import UserOrders from './pages/user/Orders.jsx';
import UserSettings from './pages/user/Settings.jsx';

// Admin imports
import AdminLayout from './pages/admin/layout/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Products from './pages/admin/Products.jsx';
import AddProduct from './pages/admin/AddProduct.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import Customers from './pages/admin/Customers.jsx';
import Reports from './pages/admin/Reports.jsx';
import AdminSettings from './pages/admin/Settings.jsx';
import Categories from './pages/admin/Categories.jsx';
import Predictions from './pages/admin/Predictions.jsx';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/allProduct' element={<AllProductsPage/>}/>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/settings" element={<UserSettings />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes> 
  );
}

export default App;
