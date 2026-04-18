import React, { createContext, useState, useContext, useEffect } from 'react';

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
        if (typeof window !== 'undefined' && window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
                setUser({ did: `did:ethr:${accounts[0]}`, linked: true });
            }
        }
    } catch (error) {
        console.log("Error checking wallet", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setUser({ did: `did:ethr:${accounts[0]}`, linked: true });
            return true;
        }
      } else {
        alert("Please install MetaMask!");
        return false;
      }
    } catch (error) {
      console.error("Wallet connection failed", error);
      return false;
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setCart([]);
    setUser(null);
  };

  const addToCart = (item, restaurantId) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, restaurantId, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const clearCart = () => setCart([]);

  return (
    <GlobalContext.Provider
      value={{
        walletAddress,
        isConnected: !!walletAddress,
        user,
        cart,
        connectWallet,
        disconnectWallet,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);
