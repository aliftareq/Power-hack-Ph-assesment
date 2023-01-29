import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../Contexts/AuthProvider';
import useToken from '../../../Hooks/useToken';

const Register = () => {
    //context values 
    const { createUser, updateUser, LoginWithGoogle } = useContext(AuthContext)
    //states
    const [signUpError, setSignUpError] = useState('')
    const [createdUserEmail, setCreatedUserEmail] = useState('')

    //getting access token
    //const [token] = useToken(createdUserEmail)

    //navigation
    const navigate = useNavigate()
    const location = useLocation()
    const from = location?.state?.from?.pathname || '/'

    //navigating
    // if (token) {
    //     navigate(from, { replace: true })
    // }

    //react form hook
    const { register, handleSubmit, formState: { errors } } = useForm()

    //handlers
    const handleRegister = (data) => {
        console.log(data);
        const image = data.image[0]
        const formData = new FormData();
        formData.append('image', image)

        fetch(`https://api.imgbb.com/1/upload?key=43801605fd33de89ae9f0e4f3af30dec`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(imgdata => {
                console.log(imgdata)
                if (imgdata.success) {
                    //creating user func
                    createUser(data.email, data.password)
                        .then(result => {
                            console.log(result.user);
                            const userInfo = {
                                displayName: data.name,
                                photoURL: imgdata.data.url
                            }
                            updateUser(userInfo)
                                .then(() => {
                                    setSignUpError('')
                                    //saveUserInDB(data.name, data.email, data.role)
                                    toast.success('user created succesfully')
                                    navigate(from, { replace: true })
                                })
                                .catch(err => {
                                    console.error(err)
                                    setSignUpError(err.message)
                                })
                        })
                        .catch(err => {
                            console.error(err)
                            setSignUpError(err.message)
                        })
                }

            })



    }

    // send user data to database
    // const saveUserInDB = (name, email, role = 'Buyer') => {
    //     const user = { name, email, role }
    //     fetch(`https://truckbazar-server-side.vercel.app/users`, {
    //         method: 'POST',
    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify(user)
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log(data);
    //             setCreatedUserEmail(email)
    //         })
    // }




    //handler for social login
    const handleGoogleSignIn = () => {
        LoginWithGoogle()
            .then(result => {
                console.log(result.user);
                //saveUserInDB(result.user.displayName, result.user.email)
                toast.success('successfully sign-In with google')
                navigate(from, { replace: true })
            })
            .catch(err => {
                console.log(err);
                toast.error(err.message)
            })
    }
    return (
        <section className='flex justify-center items-center'>
            <div className='w-72 lg:w-2/5 shadow-lg px-5 lg:px-10 py-5 rounded-lg my-10 bg-slate-900'>
                <h1 className='text-4xl text-center text-white'>Register</h1>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-white">Name</span>
                        </label>
                        <input type="text"
                            placeholder="Alif Hossen"
                            className="input input-bordered w-full"
                            {...register("name", {
                                required: 'Name is required'
                            })}
                        />
                        {errors.name && <p className='text-red-400' role="alert">{errors.name?.message}</p>}
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-white">E-mail</span>
                        </label>
                        <input type="email"
                            placeholder="example@gmail.com"
                            className="input input-bordered w-full"
                            {...register("email", {
                                required: 'Email is required'
                            })}
                        />
                        {errors.email && <p className='text-red-400' role="alert">{errors.email?.message}</p>}
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-white">Password</span>
                        </label>
                        <input type="password"
                            placeholder="*******"
                            className="input input-bordered w-full"
                            {...register("password", {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be 6 char or longer' },
                                pattern: { value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/, message: 'password must have a uppercase , lowercase and special character.' }
                            })}
                        />
                        {errors.password && <p className='text-red-400' role="alert">{errors.password?.message}</p>}
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-white">Image</span>
                        </label>
                        <input type="file"
                            className="file-input file-input-bordered w-full max-w-xs"
                            {...register("image", {
                                required: 'image is required'
                            })} />
                        {errors.image && <p className='text-red-400' role="alert">{errors.image?.message}</p>}
                    </div>
                    <input className='btn bg-amber-500 hover:bg-amber-400 w-full mt-4' value='Register' type="submit" />
                    <div className='mt-3'>
                        {signUpError && <p className='text-red-400'>{signUpError}</p>}
                    </div>
                </form>
                <p className='text-center text-white mt-3'>Already have an account?
                    <span className='text-yellow-300 ml-2 underline block lg:inline'>
                        <Link to='/login'>Login</Link>
                    </span>
                </p>
                <div className="divider bg-white rounded-2xl">OR</div>
                <div>
                    <button onClick={handleGoogleSignIn} className='btn btn-warning btn-outline  w-full'>CONTINUE WITH GOOGLE</button>
                </div>
            </div>
        </section>
    );
};

export default Register;