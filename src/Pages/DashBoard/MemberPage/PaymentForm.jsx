import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#9e2146' },
  },
};

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  const axiosSecure = useAxiosSecure(); 
  const { user } = useAuth(); 
  const email = user?.email || ''; 

  useEffect(() => {
    // Create PaymentIntent on mount
    axiosSecure.post('/create-payment-intent', { email })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(err => setError('Failed to initialize payment'));
  }, [axiosSecure, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      setError('');
      setSuccess('Payment succeeded!');

      // ✅ Update membership in DB
      axiosSecure.patch(`/users/membership/${email}`)
        .then(res => {
          console.log('User upgraded:', res.data);
        })
        .catch(err => console.error(err));
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto m-10">
      <CardElement options={CARD_OPTIONS} className="p-3 border border-gray-300 rounded-md" onChange={(e) => {
        if (e.error) setError(e.error.message);
        else setError('');
      }} />
      <button className="btn btn-primary w-full" type="submit" disabled={!stripe || !clientSecret || processing}>
        <h2 className="font-medium text-xl m-2">{processing ? "Processing..." : "Pay for Membership($10)"}</h2>
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
    </form>
  );
};

export default PaymentForm;
