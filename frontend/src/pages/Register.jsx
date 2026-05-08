import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    username: username,
                    email: email,
                    password: password
                }
            );

            alert(response.data);

            if (response.data === "Register success!") {
                navigate("/login");
            }

        } catch (error) {
            console.log(error);
            alert("Register failed!");
        }
    };

    return (
        <div>

            <h1>Register</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <br />
            <br />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br />
            <br />

            <button onClick={handleRegister}>
                Register
            </button>

            <br />
            <br />

            <button onClick={() => navigate("/login")}>
                Go Login
            </button>

        </div>
    );
}

export default Register;