import { useState } from "react";
import { useNavigate } from "react-router-dom";

const correctLogin = { name: "admin", password: "123456" };

function Login({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    let navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === correctLogin.name && password === correctLogin.password) {
            setUser({ name: username });
            setError("");
            navigate("/dashboard");
        } else {
            setError("username/password không đúng");
        }
    }

    return (
        <div>
            <h2>Login Page</h2>
            <form>
                <div>
                    <label>Username: </label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" onClick={handleSubmit}>Login</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;