import { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Load wishlist from localStorage
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  // Update localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = async (product) => {
    const existingItem = wishlistItems.find(item => item.productId === product._id);
    
    if (!existingItem) {
      const newItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      };
      
      setWishlistItems(prevItems => [...prevItems, newItem]);
      return { success: true };
    }
    
    return { success: false, message: 'Item already in wishlist' };
  };

  const removeFromWishlist = async (productId) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => item.productId !== productId)
    );
    return { success: true };
  };

  const moveToCart = async (productId) => {
    const item = wishlistItems.find(item => item.productId === productId);
    
    if (item) {
      // Convert wishlist item to a product structure for the cart
      const product = {
        _id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image
      };
      
      await addToCart(product);
      await removeFromWishlist(productId);
      return { success: true };
    }
    
    return { success: false, message: 'Item not found in wishlist' };
  };

  const clearWishlist = async () => {
    setWishlistItems([]);
    return { success: true };
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    clearWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}; 