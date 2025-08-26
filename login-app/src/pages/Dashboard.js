//Trang Dashboard sẽ nhận user từ App.js để hiển thị username
function Dashboard({ user }) {
    return (
        <div>
            <h1>Chào, {user.name}!</h1>
        </div>
    );
}

export default Dashboard;