import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";


export async function POST() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "brl",
                    product_data: {
                        name: "Imersão RedPro — 23/05/2026",
                        description: "Ao vivo das 8h às 15h. Você sai com um agente de IA configurado e respondendo pelo seu negócio.",
                        images: ["https://redpro.com.br/og-imersao.png"],
                    },
                    unit_amount: 4400,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL ?? "https://redpro.com.br"}/imersao/obrigado?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL ?? "https://redpro.com.br"}/imersao`,
        locale: "pt-BR",
        metadata: { produto: "imersao-44", evento: "2026-05-23" },
    });

    return NextResponse.json({ url: session.url });
}
