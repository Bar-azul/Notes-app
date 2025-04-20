import React, {useState} from 'react'
import Navbar from "../../components/Navbar/Navbar.jsx";
import PasswordInput from "../../components/Input/PasswordInput.jsx";
import {validateEmail} from "../../utils/helper.js";
import axiotInstance from "../../utils/axiosInstance.js";
import {useNavigate} from "react-router-dom";
const Login = () =>{

    const[email,SetEmail] = useState("");
    const[password,SetPassword] =useState("");
    const [error,SetError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e)=>{
        e.preventDefault();

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
            const response = await  axiotInstance.post("/login",{
                email:email,
                password: password
            });
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
                <form onSubmit={handleLogin}>
                    <h4 className={"text-2xl mb-7"}>Login</h4>


                    <input
                        type={"text"}
                        placeholder={"Email"}
                        className={"input-box"}
                        value = {email}
                        onChange={(e)=> SetEmail(e.target.value)}
                    />

                    <PasswordInput
                        value = {password}
                        onChange={(e)=> SetPassword(e.target.value)}
                    />

                    {error&& <p className="text-red-500 text-xs pb-1">{error}</p> }

                    <button type={"submit"} className={"btn-primary cursor-pointer"}>

                        Login
                    </button>

                    <p className={"text-sm text-center mt-4"}>
                        Not registered yet? <a href={"/signUp"} className={"font-medium text-primary underline text-blue-600 hover:text-blue-800"}>
                        Create an Account
                    </a></p>
                </form>
            </div>




        </div>



    </>;

};
export default Login