import { NextResponse } from 'next/server';

const baseURL = process.env.BASE_URL;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    console.log({location});
    

    if (!location) {
        return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`${baseURL}/api/flood-risk/${location}`);

        if (!response.ok) {
            return NextResponse.json({ error: 'Location not found' }, { status: 404 });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
