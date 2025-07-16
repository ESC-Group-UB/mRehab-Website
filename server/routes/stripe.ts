// // Stripe webhook
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2025-05-28.basil",
// });
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// app.post("/api/stripe", bodyParser.raw({ type: "application/json" }), async (req, res) => {
//   const checkoutSession = filterCheckoutEvent(req, stripe, webhookSecret);
//   if (checkoutSession) {
//     console.log("✅ Checkout complete! Session:", checkoutSession);
//     const checkoutEventData = await parseCheckoutWebhookData(checkoutSession);
//     handleCustomerEmail(checkoutEventData);
//   }
//   res.sendStatus(200);
// });