import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Insert from './pages/Insert';
import Edit from './pages/Edit';

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <a href="/login">To Login Page</a>
      <br></br>
      <a href="/dashboard">To Dashboard</a>
      { /*Em thêm các Routes dẫn đến trang login và dashboard ở đây*/ }
      <Router>
        <Routes>
          { /*Route Login sẽ nhận setUser để set người dùng*/ }
          <Route path="/login" element={<Login setUser={setUser} />} />
          { /*Route Dashboard sẽ nhận user để lấy username, và nếu user = null sẽ redirect lại về trang /*/ }
          <Route path="/dashboard" element={< Dashboard /> } />
          <Route path="/add-bill" element={< Insert />} />
          <Route path="/edit-bill/:id" element={< Edit />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
