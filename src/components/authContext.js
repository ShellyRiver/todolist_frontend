import React, {useContext} from 'react';

// Auth Context is basically composed of email and setEmail
export const AuthContext = React.createContext({
    email: "",
    setEmail: (data) => {}
})

// Use Auth Context
export function useAuthContext() {
    return useContext(AuthContext);
}