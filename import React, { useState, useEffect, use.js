import React, { useState, useEffect, useMemo } from 'react';

// Product data - simulated as if coming from a database
const PRODUCTS = [
  {
    id: '1',
    name: 'Stylish Headphones',
    price: 99.99,
    category: 'Electronics',
    imageUrl: 'https://placehold.co/400x300/F0F8FF/000000?text=Headphones',
    description: 'High-fidelity sound with comfortable ear cups, perfect for music lovers.',
  },
  {
    id: '2',
    name: 'Vintage Camera',
    price: 149.99,
    category: 'Electronics',
    imageUrl: 'https://placehold.co/400x300/E6E6FA/000000?text=Camera',
    description: 'Capture timeless moments with this classic film camera. Easy to use.',
  },
  {
    id: '3',
    name: 'Smart Watch',
    price: 199.99,
    category: 'Wearables',
    imageUrl: 'https://placehold.co/400x300/F0FFF0/000000?text=Smartwatch',
    description: 'Track your fitness, receive notifications, and stay connected on the go.',
  },
  {
    id: '4',
    name: 'Ergonomic Chair',
    price: 299.99,
    category: 'Home Office',
    imageUrl: 'https://placehold.co/400x300/FFF5EE/000000?text=Chair',
    description: 'Designed for ultimate comfort and support during long work hours.',
  },
  {
    id: '5',
    name: 'Portable Speaker',
    price: 79.99,
    category: 'Electronics',
    imageUrl: 'https://placehold.co/400x300/F8F8FF/000000?text=Speaker',
    description: 'Compact and powerful, take your music anywhere with rich, clear sound.',
  },
  {
    id: '6',
    name: 'Designer Backpack',
    price: 59.99,
    category: 'Accessories',
    imageUrl: 'https://placehold.co/400x300/F5FFFA/000000?text=Backpack',
    description: 'Stylish and durable, perfect for daily commute or weekend adventures.',
  },
  {
    id: '7',
    name: 'Coffee Maker',
    price: 89.99,
    category: 'Kitchen',
    imageUrl: 'https://placehold.co/400x300/FAEBD7/000000?text=CoffeeMaker',
    description: 'Start your day right with a fresh cup of coffee, brewed to perfection.',
  },
  {
    id: '8',
    name: 'Wireless Earbuds',
    price: 129.99,
    category: 'Electronics',
    imageUrl: 'https://placehold.co/400x300/F0F8FF/000000?text=Earbuds',
    description: 'Seamless audio experience with noise cancellation and long battery life.',
  },
];

// Reusable Product Card Component
const ProductCard = ({ product, onAddToCart }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transform hover:scale-105 transition duration-300">
    <img
      src={product.imageUrl}
      alt={product.name}
      className="w-full h-48 object-cover object-center"
      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/DDDDDD/000000?text=Image+Error"; }}
    />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-2xl font-bold text-indigo-700">${product.price.toFixed(2)}</span>
        <button
          onClick={() => onAddToCart(product.id)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition duration-300 text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Add to Cart 🛒
        </button>
      </div>
    </div>
  </div>
);

// Shopping Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const product = PRODUCTS.find(p => p.id === item.productId);
  if (!product) return null; // Should not happen if data is consistent

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center space-x-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/64x64/DDDDDD/000000?text=Image"; }}
        />
        <div>
          <h4 className="font-semibold text-lg text-gray-800">{product.name}</h4>
          <p className="text-indigo-600">${product.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition duration-200 disabled:opacity-50"
        >
          -
        </button>
        <span className="font-medium text-gray-800">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition duration-200"
        >
          +
        </button>
        <button
          onClick={() => onRemoveItem(item.productId)}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 text-sm"
        >
          Remove 🗑️
        </button>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState('products'); // 'products', 'cart', 'checkout'
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'creditCard'
  });
  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const uniqueCategories = new Set(PRODUCTS.map(p => p.category));
    return ['All', ...Array.from(uniqueCategories)];
  }, []);

  // Filtered products based on search term and category
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product =>
      (filterCategory === 'All' || product.category === filterCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, filterCategory]);

  // Add to Cart
  const addToCart = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { productId, quantity: 1 }];
      }
    });
    alert('Product added to cart! 🛒'); // Using alert for simplicity as requested not to use confirm()
  };

  // Update Cart Item Quantity
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove Item from Cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    alert('Product removed from cart!');
  };

  // Calculate total price of items in cart
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [cartItems]);

  // Checkout form validation
  const validateCheckoutForm = () => {
    const errors = {};
    if (!checkoutData.name.trim()) errors.name = 'Name is required.';
    if (!checkoutData.email.trim()) errors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(checkoutData.email)) errors.email = 'Email is invalid.';
    if (!checkoutData.address.trim()) errors.address = 'Address is required.';
    if (!checkoutData.city.trim()) errors.city = 'City is required.';
    if (!checkoutData.zip.trim()) errors.zip = 'Zip Code is required.';
    else if (!/^\d{5}(-\d{4})?$/.test(checkoutData.zip)) errors.zip = 'Zip Code is invalid.'; // Basic zip validation

    setCheckoutErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Checkout submission
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutMessage('');
    setIsCheckoutLoading(true);

    if (validateCheckoutForm()) {
      // Simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCheckoutMessage('🎉 Order Placed Successfully! Thank you for your purchase.');
      setCartItems([]); // Clear cart
      setCheckoutData({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'creditCard'
      });
    } else {
      setCheckoutMessage('Please correct the errors in the form.');
    }
    setIsCheckoutLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter antialiased text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-indigo-700 text-white shadow-lg z-50 py-4 px-6 md:px-12 rounded-b-xl">
        <nav className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">
            Mini Store 🛍️
          </h1>
          <ul className="flex space-x-6">
            <li>
              <button
                onClick={() => setCurrentPage('products')}
                className={`text-lg font-medium hover:text-indigo-200 transition duration-300 ${currentPage === 'products' ? 'text-indigo-200 underline' : 'text-white'}`}
              >
                Products
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('cart')}
                className={`relative text-lg font-medium hover:text-indigo-200 transition duration-300 ${currentPage === 'cart' ? 'text-indigo-200 underline' : 'text-white'}`}
              >
                Cart ({cartItems.length})
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </li>
            {cartItems.length > 0 && (
              <li>
                <button
                  onClick={() => setCurrentPage('checkout')}
                  className={`text-lg font-medium hover:text-indigo-200 transition duration-300 ${currentPage === 'checkout' ? 'text-indigo-200 underline' : 'text-white'}`}
                >
                  Checkout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto py-24 px-6 md:px-12">
        {currentPage === 'products' && (
          <section className="mb-12">
            <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">Our Products ✨</h2>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">No products found for your search/filter. 😔</p>
              )}
            </div>
          </section>
        )}

        {currentPage === 'cart' && (
          <section className="mb-12">
            <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">Your Shopping Cart 🛒</h2>
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-600 text-xl">Your cart is empty. Time to shop! 😊</p>
            ) : (
              <>
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateCartQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-xl mt-8">
                  <span className="text-2xl font-bold text-gray-900">Total: ${cartTotal.toFixed(2)}</span>
                  <button
                    onClick={() => setCurrentPage('checkout')}
                    className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300 text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Proceed to Checkout ➡️
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {currentPage === 'checkout' && (
          <section className="mb-12 p-8 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">Checkout Details 💳</h2>
            {checkoutMessage && (
              <div className={`p-4 mb-4 rounded-lg text-center ${checkoutMessage.includes('Successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {checkoutMessage}
              </div>
            )}
            <form onSubmit={handleCheckoutSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={checkoutData.name}
                    onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})}
                    className={`shadow appearance-none border ${checkoutErrors.name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  />
                  {checkoutErrors.name && <p className="text-red-500 text-xs italic mt-1">{checkoutErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={checkoutData.email}
                    onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                    className={`shadow appearance-none border ${checkoutErrors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  />
                  {checkoutErrors.email && <p className="text-red-500 text-xs italic mt-1">{checkoutErrors.email}</p>}
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={checkoutData.address}
                  onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                  className={`shadow appearance-none border ${checkoutErrors.address ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                />
                {checkoutErrors.address && <p className="text-red-500 text-xs italic mt-1">{checkoutErrors.address}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={checkoutData.city}
                    onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})}
                    className={`shadow appearance-none border ${checkoutErrors.city ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  />
                  {checkoutErrors.city && <p className="text-red-500 text-xs italic mt-1">{checkoutErrors.city}</p>}
                </div>
                <div>
                  <label htmlFor="zip" className="block text-gray-700 text-sm font-bold mb-2">Zip Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={checkoutData.zip}
                    onChange={(e) => setCheckoutData({...checkoutData, zip: e.target.value})}
                    className={`shadow appearance-none border ${checkoutErrors.zip ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  />
                  {checkoutErrors.zip && <p className="text-red-500 text-xs italic mt-1">{checkoutErrors.zip}</p>}
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mb-2">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={checkoutData.paymentMethod}
                  onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                  className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="creditCard">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cashOnDelivery">Cash on Delivery</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors duration-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? 'Processing Order...' : `Pay $${cartTotal.toFixed(2)}`}
              </button>
            </form>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 text-center rounded-t-xl">
        <p className="text-lg">&copy; {new Date().getFullYear()} Mini Store. All rights reserved.</p>
        <p className="text-md mt-2">Built with ❤️ and React.</p>
        <div className="flex justify-center space-x-6 mt-4">
          {/* Placeholder for social media links */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
            {/* Facebook Icon */}
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.812c-3.31 0-5.188 1.452-5.188 4.5v2.5z"/></svg>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
            {/* Twitter Icon */}
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.376 0-6.104 2.729-6.104 6.104 0 .479.053.94.148 1.38-.909-.046-1.771-.241-2.585-.596-1.164 1.993-3.141 3.284-5.378 3.524-.265-.048-.528-.088-.792-.128.917 2.873 3.595 4.975 6.762 4.975-2.906 2.292-6.577 3.655-10.551 3.655-.685 0-1.353-.04-2.009-.118 3.75 2.409 8.181 3.824 12.945 3.824 15.545 0 24.083-12.969 24.083-24.083 0-.367-.01-.735-.025-1.098z"/></svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
