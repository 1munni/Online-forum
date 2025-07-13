import { Elements } from '@stripe/react-stripe-js';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise=loadStripe(import.meta.env.VITE_payment_key);

const MemberPage = () => {
    return (
     <Elements stripe={stripePromise}>
<PaymentForm></PaymentForm>
     </Elements>
    );
};

export default MemberPage;