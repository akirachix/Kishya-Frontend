import { NextRequest, NextResponse } from "next/server";

const baseURL = process.env.BASE_URL;

export async function POST(request: NextRequest) {
    try {
        const { first_name, last_name, email, password } = await request.json()
        const response = await fetch(`${baseURL}/api/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name, last_name, password, email })
        });

        const textResponse = await response.text();
        console.log('Backend response:', textResponse, 'Status:', response.status);
        
        const result = JSON.parse(textResponse);
        console.log('User created successfully:', result);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Error during signup:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again later.' },
            { status: 500 }
        );
    }





}