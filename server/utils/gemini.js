import axios from "axios";

export const generateInvoiceFromPrompt = async (prompt) => {
  try {
    console.log("NVIDIA KEY EXISTS:", !!process.env.NVIDIA_API_KEY);

    if (!process.env.NVIDIA_API_KEY) {
      throw new Error("NVIDIA_API_KEY is missing");
    }

    const systemPrompt = `
You are an AI assistant that generates structured invoice data.

Return ONLY valid JSON in this format:

{
  "client": {
    "name": "string",
    "email": "",
    "company": "",
    "address": ""
  },
  "lineItems": [
    {
      "description": "string",
      "quantity": 1,
      "unitPrice": 100,
      "amount": 100
    }
  ],
  "taxRate": 0,
  "discount": 0,
  "currency": "USD",
  "dueDate": "2026-12-31",
  "notes": "",
  "terms": ""
}
`;

    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "mistralai/mistral-large-3-675b-instruct-2512",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 2048,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    console.log("RAW NVIDIA RESPONSE:");
    console.log(text);

    const clean = text.replace(/```json|```/g, "").trim();

    const data = JSON.parse(clean);

    const subtotal = data.lineItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const taxAmount = (subtotal * (data.taxRate || 0)) / 100;

    const total =
      subtotal +
      taxAmount -
      (data.discount || 0);

    return {
      ...data,
      subtotal,
      taxAmount,
      total,
    };
  } catch (error) {
    console.error("========== NVIDIA ERROR ==========");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error);
    }

    console.error("=================================");

    throw error;
  }
};