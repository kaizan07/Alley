import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        loading: false
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    loading: false,
    error: null
  });

  const getCart = useCallback(async (userId) => {
    if (!userId) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('CartContext: API error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const addToCart = async (userId, productId, quantity, size, color) => {
    if (!userId || !productId || !quantity || !size || !color) {
      dispatch({ type: 'SET_ERROR', payload: 'All fields are required' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        productId,
        quantity,
        size,
        color
      });
      dispatch({ type: 'ADD_ITEM', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      throw error;
    }
  };

  const updateCartItem = async (userId, itemId, quantity) => {
    if (!userId || !itemId || !quantity) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.put(`http://localhost:5000/api/cart/update/${userId}/${itemId}`, {
        quantity
      });
      dispatch({ type: 'UPDATE_ITEM', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const removeFromCart = async (userId, itemId) => {
    if (!userId || !itemId) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${userId}/${itemId}`);
      dispatch({ type: 'REMOVE_ITEM', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const clearCart = async (userId) => {
    if (!userId) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/clear/${userId}`);
      dispatch({ type: 'CLEAR_CART', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getCartItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    ...state,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
