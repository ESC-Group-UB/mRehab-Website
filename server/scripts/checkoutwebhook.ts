import Stripe from "stripe"
import sendEmail  from "../utilities/BrevoMailer";


interface CheckoutEventData {
    id: string;
    customerEmail?: string;
    adress?: Stripe.Address | null;
    name?: string | null;
};
    

const parseCheckoutWebhookData = async (checkoutEvent: Stripe.Checkout.Session) => {
    const id = checkoutEvent.id;
    const customerEmailRaw = checkoutEvent.customer_details?.email;
    const customerEmail = customerEmailRaw === null ? undefined : customerEmailRaw;
    const adress = checkoutEvent.customer_details?.address;
    const name = checkoutEvent.customer_details?.name;
    const CheckoutEventData: CheckoutEventData = {
        id,
        customerEmail,
        adress,
        name
    }
    return CheckoutEventData;
};

// email the customer that we received their order and thank them
const handleCustomerEmail = async (CheckoutEventData: CheckoutEventData) => {
    const customerEmail = CheckoutEventData.customerEmail;
    const name = CheckoutEventData.name;

    if (!customerEmail || !name) {
        console.error("Missing customer email or name in checkout event");
        return;
    }

    const subject = "Thank you for your order!";
    const text = `Dear ${name},\n\nThank you for your order! We have received your payment and will process your order shortly.\n\nBest regards,\nmRehab Team`;
    const html = `<p>Dear ${name},</p><p>Thank you for your order! We have received your payment and will process your order shortly.</p><p>Best regards,<br/>mRehab Team</p>`;

    try {
        await sendEmail(customerEmail, subject, html);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
}

// send an email to a team member to produce the order
const handleInternalCheckoutEmail =  async (CheckoutEventData: CheckoutEventData) => {
    
    const customerEmail = CheckoutEventData.customerEmail;
    const name = CheckoutEventData.name;

    if (!customerEmail || !name) {
        console.error("Missing customer email or name in checkout event");
        return;
    }

    const subject = "mReab Order Received";
    const text = `
    📦 New Order Received

    Customer Name: ${name}
    Customer Email: ${customerEmail}
    Order ID: ${CheckoutEventData.id}

    Shipping Address:
    ${CheckoutEventData.adress?.line1 || ""} 
    ${CheckoutEventData.adress?.line2 || ""}
    ${CheckoutEventData.adress?.city || ""}, ${CheckoutEventData.adress?.state || ""} ${CheckoutEventData.adress?.postal_code || ""}
    ${CheckoutEventData.adress?.country || ""}

    Please process this order as soon as possible.
    `;
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>📦 New Order Received</h2>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
        <p><strong>Order ID:</strong> ${CheckoutEventData.id}</p>
        
        <h3>Shipping Address</h3>
        <p>
        ${CheckoutEventData.adress?.line1 || ""}<br>
        ${CheckoutEventData.adress?.line2 || ""}<br>
        ${CheckoutEventData.adress?.city || ""}, ${CheckoutEventData.adress?.state || ""} ${CheckoutEventData.adress?.postal_code || ""}<br>
        ${CheckoutEventData.adress?.country || ""}
        </p>

        <p>Please process this order as soon as possible.</p>
    </div>
    `;
    try {
        await sendEmail("rohin113.rk@gmail.com", subject, html); // replace with warehouse/fulfillment team email in prod
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
}




export { handleCustomerEmail, parseCheckoutWebhookData, CheckoutEventData, handleInternalCheckoutEmail };
