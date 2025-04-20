import React, {useState} from 'react'
import {validateEmail} from "../../utils/helper.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import PasswordInput from "../../components/Input/PasswordInput.jsx";
import axiotInstance from "../../utils/axiosInstance.js";
import {useNavigate} from "react-router-dom";

const SignUp = () =>{
    const[name,SetName] = useState("");
    const[email,SetEmail] = useState("");
    const[password,SetPassword] =useState("");
    const [error,SetError] = useState(null);

    const navigate = useNavigate()

    const handleSignUp = async (e)=>{
        e.preventDefault();

        if(!(name)){
            SetError("Please enter a name.");
            return;
        }


        if(!validateEmail(email)){
            SetError("Please enter a valid email address.");
            return;
        }

        if(!(password)){
            SetError("Please enter a password.");
            return;
        }


        SetError("")

        try
        {
            const response = await  axiotInstance.post("/create-account",{
                fullName:name,
                email:email,
                password: password
            });

            if(response.data && response.data.error) {
                setError(response.data.message);
                return;

            }

            if(response.data && response.data.accessToken){
                localStorage.setItem("token", response.data.accessToken)
                navigate("/dashboard");
            }
        }
        catch (error)
        {
            if(error.response && error.response.data && error.response.data.message){
                SetError(error.response.data.message);
            }
            else{
                SetError("An unexpected error occurred. Please try again.");
            }
        }
    };


    return<>
        <Navbar/>
        <div className={"flex items-center justify-center mt-28"}>
            <div className={"w-96 border rounded bg-white px-7 py-10"}>
                <form onSubmit={handleSignUp}>
                    <h4 className={"text-2xl mb-7"}>SignUp</h4>


                    <input
                        type={"text"}
                        placeholder={"Name"}
                        className={"input-box"}
                        value={name}
                        onChange={(e) => SetName(e.target.value)}
                    />

                    <input
                        type={"text"}
                        placeholder={"Email"}
                        className={"input-box"}
                        value={email}
                        onChange={(e) => SetEmail(e.target.value)}
                    />


                    <PasswordInput
                        value={password}
                        onChange={(e) => SetPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                    <button type={"submit"} className={"btn-primary cursor-pointer"}>

                        Create Account
                    </button>

                    <p className={"text-sm text-center mt-4"}>
                        Already have an account? <a href={"/login"}
                                               className={"font-medium text-primary underline text-blue-600 hover:text-blue-800"}>
                        Login
                    </a></p>
                </form>
            </div>


        </div>


    </>;

};

export default SignUp