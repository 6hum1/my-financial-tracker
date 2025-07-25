import { useContext, useState } from 'react'
import React from 'react'
import AuthLayout from '../../components/Layout/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { UserContext } from '../../context/useContext'
import uploadImage from '../../utils/uploadImage'
import { validateEmail } from '../../utils/helper'


const Signup = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);

    const {updateUser} = useContext(UserContext)

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        let profileImageUrl = '';
        
        if(!fullName){
            setError("Please enter your name");
            return;
        }

        if(!validateEmail(email)){
            setError("Please enter a valid email address");
            return ;
        }

        if(!password){
            setError('Please enter the password');
            return ;
        }

        setError("");

        //signup api call
        try{
            if(profilePic){
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || "";
            }
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
                fullName,
                email,
                password,
                profileImageUrl
            });

            const {token,user} = response.data;

            if(token){
                localStorage.setItem("token",token);
                updateUser(user);
                navigate('/dashboard');
            }
        }catch(error){
            if(error){
                if(error.response && error.response.data.message){
                    setError(error.response.data.message);
                }else{
                    setError("Something went wrong.Please try again");
                }
            }
        }
    }
    return (
        <AuthLayout>
            <div className='lg:w-[100%] h-auto md:h-full mt-5 md:mt-8 flex flex-col justify-center'>
                <h3 className='text-3xl font-semibold text-black'>Create an Account</h3>
                <p className='text-lg text-slate-700 mt-[5px] mb-6'>Join Us</p>

                <form onSubmit={handleSignUp}>
                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            label="Full Name"
                            placeholder='xyz'
                            type="text"
                        />

                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                            placeholder="xyz@example.com"
                            type="text" />
                        <div className='col-span-2'>
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                placeholder="Min 8 characters"
                                type="password" />

                        </div>

                    </div>
                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button type='submit' className='btn-primary '>SIGN UP</button>
                    <p className='text-[13px] text-slate-800 mt-3'>Already have an account ? {" "}
                        <Link className='font-medium text-primary underline' to='/login'>Login</Link>
                    </p>

                </form>
            </div>
        </AuthLayout>
    )
}

export default Signup