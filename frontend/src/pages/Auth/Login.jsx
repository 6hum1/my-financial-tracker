import { useState } from 'react'
import React from 'react'
import AuthLayout from '../../components/Layout/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import { API_PATHS } from '../../utils/apiPath'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { UserContext } from '../../context/useContext'
import { useContext } from 'react'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { updateUser } = useContext(UserContext)
    const navigate = useNavigate();

    // handle login form submit 
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!password) {
            setError('Please enter the password');
            return;
        }

        setError("");

        //login api call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email, password
            })
            const { token, user } = response.data;

            console.log("Login response", response.data);

            if (token) {
                localStorage.setItem('token', token);
                console.log("Saved token:", localStorage.getItem("token")); // ✅ Check if saved

                updateUser(user);
                console.log("Updated user:", user); // ✅ Log user before navigating

                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong.Please try again");
            }
        }
    }

    return (
        <AuthLayout>
            <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justyfy-center mt-20 '>
                <h1 className='text-3xl font-semibold text-black'>Welcome Back</h1>
                <p className='text-xs text-slate-700 mt-[5px] mb-6 '>Please enter your details to login</p>

                <form onSubmit={handleLogin}>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email Address"
                        placeholder="xyz@example.com"
                        type="text" />
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        placeholder="Min 8 characters"
                        type="password" />

                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button type='submit' className='btn-primary'>LOGIN</button>

                    <p className='text-[13px] text-slate-800 mt-3'>Don't have an account ? {" "}
                        <Link className='font-medium text-primary underline' to='/signup'>SignUp</Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default Login