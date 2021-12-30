import Stripe from "stripe";

export const stripe = new Stripe(
    process.env.SECRET_API_KEY as string,
    {
        apiVersion: '2020-08-27',
        appInfo: {
            name: 'ignews',
            version: '1.0'
        }
    }
)