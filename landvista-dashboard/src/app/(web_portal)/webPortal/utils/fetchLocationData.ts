export const fetchLocationData = async (location: string) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${baseUrl}/api/flood-risk/${location}`);
        console.log({ response });

     
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Location not found. Please try a different location.');
            } else {
                throw new Error('Failed to fetch data. Please try again later.');
            }
        }

        return await response.json();
    } catch (error) {
       
        if (error instanceof TypeError) {
            throw new Error('Network error. Please check your internet connection.');
        } else {
            throw new Error((error as Error).message);
        }
    }
};
