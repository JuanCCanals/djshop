import paypal from '@paypal/checkout-server-sdk';
const env = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
export default new paypal.core.PayPalHttpClient(env);
