import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const PIXEL_ID = "1543917230170877";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN!;
const CAPI_URL = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`;

function hash(value: string): string {
    return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { event_name, email, name, value: amount, currency = "BRL", event_id, test_event_code } = body;

    if (!event_name) {
        return NextResponse.json({ error: "event_name obrigatório" }, { status: 400 });
    }

    const user_data: Record<string, string> = {};
    if (email) user_data.em = hash(email);
    if (name) user_data.fn = hash(name.split(" ")[0]);

    const event: Record<string, unknown> = {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: event_id ?? `${event_name}-${Date.now()}`,
        user_data,
    };

    if (amount !== undefined) {
        event.custom_data = { value: amount, currency };
    }

    const payload: Record<string, unknown> = { data: [event] };
    if (test_event_code) payload.test_event_code = test_event_code;

    const res = await fetch(`${CAPI_URL}?access_token=${ACCESS_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
        console.error("Meta CAPI error:", result);
        return NextResponse.json({ error: result }, { status: res.status });
    }

    return NextResponse.json({ success: true, result });
}
