export const useApi = () => {
    const token = localStorage.getItem('authToken'); // Or get it from a more secure place

    const makeRequest = async (url, options = {}) => {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['Authorization'] = `Bearer ${token}`;
         options.headers['accepts'] = `application/json`;

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
