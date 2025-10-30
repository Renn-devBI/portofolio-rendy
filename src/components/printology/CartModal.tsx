import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart, CartItem } from './CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotal, getTotalItems, clearCart } = useCart();

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
  <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-hidden">
  <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 md:p-6">
  <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
  <span className="truncate">
      Keranjang Belanja ({getTotalItems()} item)
    </span>
  </CardTitle>
  <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
      <X className="h-4 w-4" />
          </Button>
  </CardHeader>

  <CardContent className="max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto p-3 sm:p-4 md:p-6">
  {cart.length === 0 ? (
  <div className="text-center py-6 sm:py-8 text-gray-500">
  <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
    <p className="text-sm sm:text-base font-medium">Keranjang kosong</p>
      <p className="text-xs sm:text-sm mt-2">Tambahkan layanan ke keranjang untuk memesan</p>
  </div>
  ) : (
  <div className="space-y-3 sm:space-y-4">
  {cart.map((item: CartItem) => (
  <div key={item.id} className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 border rounded-lg bg-gray-50/50">
  <div className="flex-1 min-w-0">
  <h4 className="font-semibold text-sm sm:text-base truncate">{item.name}</h4>
    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mt-1">{formatCurrency(item.price)}</p>
  </div>

  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
  <div className="flex items-center gap-1 sm:gap-2">
  <Button
      variant="outline"
    size="icon"
      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 sm:h-8 sm:w-8"
    >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>

  <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>

    <Button
    variant="outline"
      size="icon"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 sm:h-8 sm:w-8"
      >
      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>
  </div>

  <Button
  variant="ghost"
    size="sm"
  onClick={() => removeFromCart(item.id)}
    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 h-auto"
    >
        Hapus
        </Button>
                  </div>

    <div className="text-right flex-shrink-0">
    <p className="font-semibold text-sm sm:text-base">{formatCurrency(item.price * item.quantity)}</p>
  </div>
  </div>
  ))}

      <div className="border-t pt-3 sm:pt-4 mt-4">
          <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                  <span>Total:</span>
            <span className="text-blue-600">{formatCurrency(getTotal())}</span>
        </div>
    </div>
  </div>
  )}
  </CardContent>

  {cart.length > 0 && (
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 border-t bg-gray-50">
    <Button
        variant="outline"
          onClick={clearCart}
            className="flex-1 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Kosongkan Keranjang</span>
              <span className="sm:hidden">Kosongkan</span>
            </Button>
            <Button
              onClick={() => { navigate('/checkout'); onClose(); }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
            >
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Lanjutkan Pesanan</span>
              <span className="sm:hidden">Checkout</span>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CartModal;
