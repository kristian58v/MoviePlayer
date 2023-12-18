export const useApi = () => {

    const makeRequest = async (url, body = {}, method = 'GET') => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        };

        if (method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                // Return error data with status
                return { error: true, status: response.status, data };
            }

            return { error: false, data }; // Successful response
        } catch (error) {
            console.error('Fetch error:', error);
            return { error: true, message: error.message }; // Network or other errors
        }
    };

    return makeRequest;
};
