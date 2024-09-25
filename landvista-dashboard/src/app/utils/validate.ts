
const url = '/api/users';

export const addUser = async ({ firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Full response from server:', text);
            if (response.status >= 500) {
                throw new Error('Please try again later.');
            } else if (response.status === 400) {
                throw new Error('A user with this email already exists.');
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during adding a new user:', error);
        throw new Error((error as Error).message || 'An unexpected error occurred. Please try again.');
    }
};

export default addUser;
