import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MessageCircle,
  Package,
  Star,
  Plus,
  DollarSign,
  UserCircle,
  ShoppingCart,
  ClipboardList,
  Menu,
  X,
  Heart,
  MapPin,
  Clock,
  Shield,
  Truck,
  Award,
  Users,
  TrendingUp,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const Header = ({ location, setLocation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">RentKart</h1>
          </div>

          {/* Search Bar and Location */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8 space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for items, categories..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 rounded-xl"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-lg">
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="pl-2 pr-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 w-40"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-gray-600 hover:text-gray-800 font-medium">Home</Link>
            <Link to="/items" className="text-gray-600 hover:text-gray-800 font-medium">Browse Items</Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-800">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </Link>
            <Link to="/orders" className="text-gray-600 hover:text-gray-800"><ClipboardList className="w-5 h-5" /></Link>
            {isLoggedIn ? (
              <Link to="/dashboard" className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <UserCircle className="w-4 h-4" /><span>Dashboard</span>
              </Link>
            ) : (
              <Link to="/signup" className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium">Join Now</Link>
            )}
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2 md:hidden">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Location */}
        <div className="md:hidden mt-2 flex items-center space-x-2 px-1 pb-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="pl-2 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-full"
          />
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="space-y-3">
              <a href="/home" className="block text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors">Home</a>
              <a href="/items" className="block text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors">Browse Items</a>
              <a href="/cart" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 py-2 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">0</span>
              </a>
              <a href="/orders" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 py-2 transition-colors">
                <ClipboardList className="w-5 h-5" />
                <span>Orders</span>
              </a>
              {isLoggedIn ? (
                <a href="/dashboard" className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                  <UserCircle className="w-5 h-5" />
                  <span>Dashboard</span>
                </a>
              ) : (
                <a href="/signup" className="block bg-gray-800 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors">
                  Join Now
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};



export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Rent What You Need, When You Need It!",
      desc: "Explore a wide range of items at unbeatable prices. Fast delivery and hassle-free returns.",
      btnText: "Start Browsing",
      image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/items",
      gradient: "from-gray-800 to-gray-900"
    },
    {
      title: "Furnish Your Home for Less",
      desc: "Affordable furniture on rent – beds, sofas, tables, and more! Perfect for students and professionals.",
      btnText: "Explore Furniture",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/items",
      gradient: "from-gray-700 to-gray-800"
    },
    {
      title: "Smart Appliances on Rent",
      desc: "Get ACs, refrigerators, washing machines and more – delivered to your door with installation.",
      btnText: "View Appliances",
      image: "https://images.pexels.com/photos/4857781/pexels-photo-4857781.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/items",
      gradient: "from-gray-600 to-gray-700"
    },
    {
      title: "Professional Equipment Rental",
      desc: "Cameras, laptops, tools, and more for your projects. Quality equipment at affordable rates.",
      btnText: "Rent Equipment",
      image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/items",
      gradient: "from-gray-500 to-gray-600"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      <div className="relative h-[500px] md:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${currentSlide === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
              }`}
          >
            <div className={`bg-gradient-to-r ${slide.gradient} h-full`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex flex-col md:flex-row items-center justify-between h-full py-12">
                  <div className="w-full md:w-1/2 space-y-6 text-white z-10">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                      {slide.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={slide.link}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                      >
                        {slide.btnText}
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </a>
                      <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-800 transition-all">
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 mt-8 md:mt-0">
                    <img
                      src={slide.image}
                      alt="Slide"
                      className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronRight className="w-6 h-6 rotate-180" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export const FeaturedItems = ({ items, location }) => {
  const filteredItems = location
    ? items.filter(item =>
      item.location?.toLowerCase().includes(location.toLowerCase())
    )
    : items;
  const navigate = useNavigate();

  const handleAddToCartAndCheckout = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post('/api/cart/add', { itemId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Item added to cart");
      navigate('/cart');
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item to cart");
    }
  };

  const [wishlistItems, setWishlistItems] = useState([]);

  const handleAddToWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await axios.post(
        '/api/wishlist/add',
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optional: update state
      setWishlistItems((prev) => [...prev, itemId]);
      toast.success("Added to wishlist");

    } catch (err) {
      console.error("Error adding to wishlist", err);
      toast.error("Failed to add to wishlist");
    }
  };



  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Items
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular rental items, carefully selected for quality and value
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map(item => (
            <div key={item._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
              <div className="relative overflow-hidden">
                <Link to={`/items/${item._id}`}>
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </Link>

                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => handleAddToWishlist(item._id)}
                    className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${wishlistItems.includes(item._id)
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                        }`}
                    />
                  </button>
                </div>



                <div className="absolute bottom-4 left-4">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Available
                  </span>
                </div>
              </div>

              <div className="p-6">
                <Link to={`/items/${item._id}`} onClick={() => console.log("Navigating to", item._id)}>

                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h4>
                </Link>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">4.8</span>
                    <span className="text-sm text-gray-500">(24)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{item.location || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{item.pricing.per_day}
                    <span className="text-sm font-normal text-gray-500">/day</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    ₹{item.pricing.per_week || item.pricing.per_day * 7}/week
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/items/${item._id}`)}
                  className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
                >
                  Rent Now
                </button>

              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No featured items available {location && `for "${location}"`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};


export const CategorySection = ({ categories }) => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Browse by Category
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find exactly what you need from our diverse range of rental categories
        </p>
      </div>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map(category =>
          category.slug ? (
            <Link
              to={`/category/${category.slug}`}
              key={category._id}
              className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
            >
              <div className="relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h3 className="text-center font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-center text-sm text-gray-500 mt-1">
                  {category.itemCount || 0} items
                </p>
              </div>
            </Link>
          ) : null
        )}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Categories will be loaded soon</p>
        </div>
      )}
    </div>
  </section>
);

export const HowItWorks = () => {
  const renterSteps = [
    {
      icon: Search,
      title: 'Search & Browse',
      description: 'Find the perfect item for your needs from thousands of listings across multiple categories',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Connect & Book',
      description: 'Message the owner, check availability, and book your rental dates with instant confirmation',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      icon: Package,
      title: 'Pick Up & Enjoy',
      description: 'Collect your item safely or get it delivered, then enjoy using it for your project',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      icon: Star,
      title: 'Return & Review',
      description: 'Return the item in good condition and leave a review to help the community',
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
    }
  ];

  const ownerSteps = [
    {
      icon: Plus,
      title: 'List Your Item',
      description: 'Create a detailed listing with high-quality photos and set your rental prices',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      icon: MessageCircle,
      title: 'Get Requests',
      description: 'Receive rental requests from verified renters and manage your bookings easily',
      color: 'bg-gradient-to-br from-pink-500 to-pink-600'
    },
    {
      icon: DollarSign,
      title: 'Earn Money',
      description: 'Hand over your item securely and start earning passive income from your assets',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    },
    {
      icon: Star,
      title: 'Build Reputation',
      description: 'Get positive reviews, build trust, and grow your rental business over time',
      color: 'bg-gradient-to-br from-red-500 to-red-600'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All payments are protected with our secure payment system'
    },
    {
      icon: Truck,
      title: 'Flexible Delivery',
      description: 'Choose pickup or delivery options that work for you'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'All items are verified and quality-checked before listing'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of verified renters and owners'
    }
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How RentKart Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're looking to rent items or earn money from your unused belongings,
            we make the process simple, secure, and rewarding
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-gray-200">
                <benefit.icon className="w-8 h-8 text-gray-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* For Renters */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <div className="bg-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">For Renters</h3>
              <p className="text-gray-600">Get access to anything you need, when you need it, without the commitment of buying</p>
            </div>
            <div className="space-y-6">
              {renterSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="bg-gray-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Item Owners */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <div className="bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">For Item Owners</h3>
              <p className="text-gray-600">Turn your unused items into a steady source of passive income</p>
            </div>
            <div className="space-y-6">
              {ownerSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="bg-gray-700 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gray-800 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg opacity-90 mb-6">Join thousands of users who are already renting and earning on RentKart</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                Start Renting
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-slate-800 transition-all">
                List Your Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">RentKart</h3>
          </div>
          <p className="text-gray-400 mb-6 max-w-md">
            The ultimate marketplace for renting and lending items. Turn your unused belongings into income
            or find exactly what you need without buying.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/items" className="text-gray-400 hover:text-white transition-colors">Browse Items</a></li>
            <li><a href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
            <li><a href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
            <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            <li><a href="/safety" className="text-gray-400 hover:text-white transition-colors">Safety</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="/disputes" className="text-gray-400 hover:text-white transition-colors">Dispute Resolution</a></li>
          </ul>
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-gray-800 mt-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span>support@rentkart.com</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 RentKart. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
);
