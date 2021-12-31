/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { query as q } from "faunadb";
import { fauna } from "../../src/services/fauna";
import { stripe } from "../../src/services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session?.user?.email as string)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session?.user?.email as string,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSesstion = await stripe.checkout.sessions.create({
      customer: customerId, // id no sripe e nao do faunadb
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      line_items: [{ price: "price_1KCFsyIWkEB5mLizeECV6fvg", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: 'http://localhost:3000/posts',
      cancel_url: 'http://localhost:3000',
    });

    return res.status(200).json({ sessionId: stripeCheckoutSesstion.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};