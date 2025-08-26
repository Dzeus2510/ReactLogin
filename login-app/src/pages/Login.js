import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Tạo 1 object correctLogin chứa username và password đúng
const correctLogin = { name: "admin", password: "123456" };

function Login({ setUser }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    let navigate = useNavigate()

    //Handle khi người dùng submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        //Khi người dùng đăng nhập đúng, sẽ setUser với name là username người dùng nhập
        //Sau đó điều hướng người dùng đến trang /dashboard
        //nếu không đúng sẽ hiện lỗi "username/password không đúng"
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