import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Dashboard.css"

//Trang Dashboard sẽ nhận user từ App.js để hiển thị username
function Dashboard({ user }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Make GET request to fetch data
        axios
            .get("https://68aeaa5fb91dfcdd62b9d261.mockapi.io/customer/dashboard/Package")
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

function formatDate(isoString) {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

     return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    return (
        <div>
            <h1>Chào, {user.name}!</h1>
            <table>
                <thead>
                    <th>Mã đơn trả</th>
                    <th>Ngày tạo</th>
                    <th>Mã đơn hàng</th>
                    <th>Khách Hàng</th>
                    <th>Sản Phẩm</th>
                    <th>Trạng thái hoàn trả</th>
                    <th>Trạng thái nhận hàng</th>
                    <th>Trạng thái đơn trả</th>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.paymentId}>
                            <th>{item.paymentId}</th>
                            <th>{formatDate(item.createdAt)}</th>
                            <th>{item.packageId}</th>
                            <th>{item.customerName}</th>
                            <th>{item.products.length} sản phẩm</th>
                            <th>{item.returnStatus ? <text  className="true">Đã hoàn trả </text>: <text className="false">Chưa hoàn trả</text>}</th>
                            <th>{item.receiveStatus ? <text className="true">Đã nhận hàng </text>: <text className="false">Chưa nhận hàng</text>}</th>
                            <th>{item.paymentStatus ? <text className="true">Đang trả hàng </text>: <text className="false">Lưu trữ</text>}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;