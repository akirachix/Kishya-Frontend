import { NextResponse } from 'next/server';

const baseURL = process.env.BASE_URL;

export async function POST(request: Request) {
    if (!baseURL) {
        return NextResponse.json({ error: 'BASE_URL is not defined' }, { status: 500 });
    }

    try {
        const feedback = await request.json(); 

        if (!feedback || typeof feedback !== 'object') {
            return NextResponse.json({ error: 'Invalid feedback format' }, { status: 400 });
        }

        const response = await fetch(`${baseURL}/api/feedback/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedback), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to submit feedback' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
