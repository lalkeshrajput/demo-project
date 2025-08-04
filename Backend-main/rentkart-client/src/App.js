import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import Orders from "./pages/Orders";
import Items from "./pages/Items";
import CategoryItems from './pages/CategoryItems';
import ItemsDetails from "./pages/ItemsDetails";
import Cart from "./pages/Cart";
import MyListing from "./pages/MyListing";
import AddItems from "./pages/AddItems";
import Checkout from "./pages/Checkout";
import ProfilePage from './pages/ProfilePage'; // or wherever the file is
import ChangePassword from "./pages/ChangePassword";
import OwnerOrders from "./pages/OwnerOrders";
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<UserDashboard />} /> 
        <Route path="/orders" element={<Orders />} />
        <Route path="/owner-orders" element={<OwnerOrders />} />
        <Route path="/items" element={<Items />} />
        <Route path="/category/:slug" element={<CategoryItems />} />
        <Route path="/items/:id" element={<ItemsDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-listings" element={<MyListing />} />
        <Route path="/add-item" element={<AddItems />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/owner-order" element={<OwnerOrders />} />
        <Route path="/wishlist" element={<Wishlist />} />

      </Routes>
    </Router>
  );
}

export default App;
