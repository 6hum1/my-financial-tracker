import React,{createContext,useState,useEffect} from 'react'
import axiosInstance from '../utils/axiosInstance';

export const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user,setUser] = useState(null);

    //function to update user data
    const updateUser = (userData) =>{
        setUser(userData);
    }

    const clearUser = () =>{
        setUser(null);
    }

    useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token);
    if (token && !user) {
      axiosInstance.get('/api/v1/auth/getUser') // or your route for getting user info
        .then((res) => {
          setUser(res.data);
          console.log("User loaded:", res.data);
        })
        .catch((err) => {
          console.log("Failed to load user:", err);
          localStorage.removeItem("token");
        });
    }
  }, []);

    return (
        <UserContext.Provider value={{user,updateUser,clearUser}}>
            {children}
        </UserContext.Provider>
    )

}

export default UserProvider
