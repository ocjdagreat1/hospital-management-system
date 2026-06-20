// controllers/stripeWebhookController.js

import Stripe from "stripe";
import appointmentModel from "../models/appointmentModel.js";
import dotenv from "dotenv";
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhookController = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const appointmentId = session.metadata?.appointmentId;

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            payment: true,
            paymentDate: Date.now()
        });
    }

    res.json({ received: true });
};