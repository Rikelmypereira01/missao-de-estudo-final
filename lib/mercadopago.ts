const baseUrl = "https://api.mercadopago.com";

export type PixPaymentPayload = {
  amount: number;
  description: string;
  email: string;
  firstName: string;
  lastName: string;
  externalReference: string;
};

export async function createPixPayment(payload: PixPaymentPayload) {
  const response = await fetch(`${baseUrl}/v1/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": crypto.randomUUID()
    },
    body: JSON.stringify({
      transaction_amount: Number(payload.amount.toFixed(2)),
      description: payload.description,
      payment_method_id: "pix",
      payer: {
        email: payload.email,
        first_name: payload.firstName,
        last_name: payload.lastName
      },
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercado-pago`,
      external_reference: payload.externalReference
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Falha ao criar pagamento Pix: ${text}`);
  }

  return response.json();
}

export async function getPayment(paymentId: string) {
  const response = await fetch(`${baseUrl}/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Falha ao consultar pagamento Pix: ${text}`);
  }

  return response.json();
}
