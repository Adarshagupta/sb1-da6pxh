import React, { useState } from 'react';
import { Coins, Loader } from 'lucide-react';
import { makePayment } from '../lib/razorpay';
import { useAuth } from '../context/AuthContext';
import { getUserTokens, updateUserTokens } from '../lib/firebase';

interface TokenPackage {
  tokens: number;
  price: number;
  popular?: boolean;
}

const tokenPackages: TokenPackage[] = [
  { tokens: 1000, price: 99, popular: false },
  { tokens: 5000, price: 449, popular: true },
  { tokens: 10000, price: 849, popular: false }
];

export const TokenPurchase = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<number | null>(null);

  const handlePurchase = async (pkg: TokenPackage, index: number) => {
    if (!user) {
      alert('Please sign in to purchase tokens');
      return;
    }

    try {
      setLoading(index);
      const currentTokens = await getUserTokens(user.uid);
      
      await makePayment({
        amount: pkg.price,
        tokens: pkg.tokens,
        userId: user.uid,
        userEmail: user.email || '',
        onSuccess: async () => {
          // Update tokens in Firestore
          await updateUserTokens(user.uid, currentTokens + pkg.tokens);
          alert(`Successfully purchased ${pkg.tokens} tokens!`);
        },
        onError: (error) => {
          console.error('Payment failed:', error);
          alert('Failed to process payment. Please try again.');
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tokenPackages.map((pkg, index) => (
        <div
          key={index}
          className={`relative rounded-xl p-6 ${
            pkg.popular
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
              : 'bg-white border border-gray-200'
          }`}
        >
          {pkg.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </span>
            </div>
          )}
          <div className="text-center">
            <Coins className={`w-12 h-12 mx-auto mb-4 ${pkg.popular ? 'text-white' : 'text-indigo-600'}`} />
            <h3 className={`text-2xl font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-gray-800'}`}>
              {pkg.tokens.toLocaleString()} Tokens
            </h3>
            <p className={`text-3xl font-bold mb-4 ${pkg.popular ? 'text-white' : 'text-gray-800'}`}>
              ₹{pkg.price}
            </p>
            <button
              onClick={() => handlePurchase(pkg, index)}
              disabled={loading === index}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                pkg.popular
                  ? 'bg-white text-indigo-600 hover:bg-gray-100'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {loading === index ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                'Purchase'
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 