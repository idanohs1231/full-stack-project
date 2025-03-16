import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ עטיפת האפליקציה ב-Router
import './index.css';
import App from './App.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./context/CartContext"; // ✅ עטיפת האפליקציה בניהול עגלה

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
