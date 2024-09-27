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

        if(!response.ok){
            const textResponse = await response.text();
            console.log('Backend response:', textResponse, 'Status:', response.status);
           
            return NextResponse.json(textResponse, { status: 400 });
        }

     
      
        const result = await response.json();
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again later.' },
            { status: 500 }
        );
    }

}



export async function GET() {
    try{
        const response = await fetch(`${baseURL}/api/users`, {
            cache:'no-cache'
        });
        const data = await response.json();
        return new Response(JSON.stringify(data),{
            status:200,
        });
    } catch (error){
        return new Response((error as Error).message,{
            status:500
        });
    }
}


