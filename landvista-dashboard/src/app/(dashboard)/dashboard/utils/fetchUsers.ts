

export const displayAllUsers = async (endpoint: string, options = {}) => {
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } 
    
    catch {
      throw new Error('Failed to fetch data');
    
    }
    
  };
