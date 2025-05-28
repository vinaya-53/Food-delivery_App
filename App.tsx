import AppNavigator from "./src/AppNavigation";
import { CartProvider } from "./src/contexts/CartContext";

export default function App() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}


