const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL

type chatResponse = { reply: string }

export async function sendMessage(message: string): Promise<chatResponse> {
    const response = await fetch(`${FRONTEND_URL}/backend/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    })

    const data: chatResponse = await response.json();
    return data
}