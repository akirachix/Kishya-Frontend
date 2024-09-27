const baseURL = process.env.BASE_URL;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'daily'; 
    try {
        const response = await fetch(`${baseURL}/api/responses?filter=${filter}`, {
            method:'GET',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            console.error('Fetch failed:', response.statusText);
            return new Response('Failed to fetch data', { status: response.status });
        }

       
        const data = await response.json();

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response((error as Error).message, { status: 500 });
    }
}
