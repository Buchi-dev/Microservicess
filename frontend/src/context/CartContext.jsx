import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
      updateTotalItems(parsedCart);
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateTotalItems(cartItems);
  }, [cartItems]);

  const updateTotalItems = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(count);
  };

  const addToCart = async (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item => 
          item.productId === product._id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item
        return [...prevItems, {
          id: Date.now().toString(), // Temporary ID for client-side
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity
        }];
      }
    });
    
    return { success: true };
  };

  const updateCartItem = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeCartItem(itemId);
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
    
    return { success: true };
  };

  const removeCartItem = async (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    return { success: true };
  };

  const clearCart = async () => {
    setCartItems([]);
    return { success: true };
  };

  const value = {
    cartItems,
    totalItems,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 