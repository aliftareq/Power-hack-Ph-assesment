import { useEffect, useState } from 'react';

const useToken = (email) => {
    const [token, setToken] = useState('')
    useEffect(() => {
        if (email) {
            fetch(`https://truckbazar-server-side.vercel.app/jwt?email=${email}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.accessToken) {
                        localStorage.setItem('user-token', data.accessToken)
                        setToken(data.accessToken)
                    }
                })
        }
    }, [email])
    return [token]
};

export default useToken;