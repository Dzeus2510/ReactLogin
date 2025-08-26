import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <a href="/login">To Login Page</a>
      { /*Em thêm các Routes dẫn đến trang login và dashboard ở đây*/ }
      <Router>
        <Routes>
          { /*Route Login sẽ nhận setUser để set người dùng*/ }
          <Route path="/login" element={<Login setUser={setUser} />} />
          { /*Route Dashboard sẽ nhận user để lấy username, và nếu user = null sẽ redirect lại về trang /*/ }
          <Route path="/dashboard" element={user ? < Dashboard user={user} /> : <Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
