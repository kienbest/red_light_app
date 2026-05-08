import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.email || !form.password) {
            alert("Please fill all fields");
            return;
        }

        try {

            const response = await login(form);
            console.log(response.data);

            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");

        } catch (error) {
            console.log(error);
            alert("Wrong email or password");
        }
    };

   return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>

        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
            />

            <br /><br />

            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
            />

            <br /><br />

            <button type="submit">
                Login
            </button>
            <br /><br />

            <button onClick={() => navigate("/register")}>
                Go Register
            </button>
        </form>
    </div>
);
}

export default Login;