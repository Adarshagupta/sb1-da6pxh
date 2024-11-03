declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOptions {
  amount: number;
  tokens: number;
  userId: string;
  userEmail: string;
  onSuccess?: () => Promise<void>;
  onError?: (error: any) => void;
}

export const initializeRazorpay = async () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const makePayment = async ({ 
  amount, 
  tokens, 
  userId, 
  userEmail,
  onSuccess,
  onError 
}: PaymentOptions) => {
  const res = await initializeRazorpay();

  if (!res) {
    throw new Error('Razorpay SDK failed to load');
  }

  try {
    // Create order
    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100,
        tokens,
        userId
      }),
    });

    if (!orderRes.ok) {
      throw new Error('Failed to create order');
    }

    const order = await orderRes.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "BookAI",
      description: `Purchase ${tokens} tokens`,
      image: "/logo.png",
      order_id: order.id,
      handler: async function (response: any) {
        try {
          // Verify payment
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderCreationId: order.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              userId,
              tokens
            }),
          });

          if (!verifyRes.ok) {
            throw new Error('Payment verification failed');
          }

          const verification = await verifyRes.json();

          if (verification.success) {
            onSuccess?.();
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          onError?.(error);
        }
      },
      prefill: {
        email: userEmail,
      },
      theme: {
        color: "#4F46E5",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    onError?.(error);
  }
}; 