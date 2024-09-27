

import { useEffect, useState } from 'react';
import { UserData} from '../utils/types';
import { displayAllUsers } from '../utils/fetchUsers';

export const useDisplayAllUsers = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const result = await displayAllUsers('/api/users', {cache:'no-cache'});

        setData(result?.users);
      } 
      
      catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setIsLoading(false);
      }

    };

    fetchAllUsers();
}, []);

return {data, isLoading, error};
};
