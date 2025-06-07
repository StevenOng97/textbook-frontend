import React, { useState } from 'react';
import { CreditCard, Shield, Lock, Check } from 'lucide-react';

interface PaymentInterfaceProps {
  amount: number;
  currency: string;
  onPaymentComplete: (paymentId: string) => void;
  onCancel: () => void;
}

export const PaymentInterface: React.FC<PaymentInterfaceProps> = ({
  amount,
  currency,
  onPaymentComplete,
  onCancel,
}) => {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      onPaymentComplete(paymentId);
      setProcessing(false);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          <div className="flex items-center space-x-1">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Secure</span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-3xl font-bold">${amount.toFixed(2)} {currency}</p>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePayment} className="p-6 space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
                paymentMethod === 'paypal'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-5 h-5 bg-blue-600 rounded"></div>
              <span className="font-medium">PayPal</span>
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                required
                value={cardDetails.number}
                onChange={(e) =>
                  setCardDetails(prev => ({
                    ...prev,
                    number: formatCardNumber(e.target.value),
                  }))
                }
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  required
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails(prev => ({
                      ...prev,
                      expiry: formatExpiry(e.target.value),
                    }))
                  }
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  required
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails(prev => ({
                      ...prev,
                      cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                    }))
                  }
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                required
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails(prev => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'paypal' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
            </div>
            <p className="text-gray-600">You will be redirected to PayPal to complete your payment.</p>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-3">
          <Lock className="h-5 w-5 text-gray-500 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium">Your payment is secure</p>
            <p>We use bank-level encryption to protect your information.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={processing}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                <span>Pay ${amount.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};