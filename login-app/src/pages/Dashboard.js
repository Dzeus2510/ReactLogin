import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Dashboard.css"

//Trang Dashboard sẽ nhận user từ App.js để hiển thị username
function Dashboard({ user }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/bill/count");
                const rows = response.data;
                
                const mappedData = rows.map(row => ({
                    id: row[0],
                    paymentCode: row[1],
                    createdDate: row[2],
                    packageCode: row[3],
                    customerName: row[4],
                    returnStatus: row[5],
                    receiveStatus: row[6],
                    paymentStatus: row[7],
                    productCount: row[8],
                }))
                    setData(mappedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                        <tr key={item.id}>
                            <th><a href="#" className="link">{item.paymentCode}</a></th>
                            <th>{formatDate(item.createdDate)}</th>
                            <th><a href="#" className="link">{item.packageCode}</a></th>
                            <th>{item.customerName}</th>
                            <th className="dropdown">
                                {item.productCount} sản phẩm
                                {/* <div className="dropdown-content">
                                    {item.products.map((product, index) => (
                                        <div key={index}>
                                            <p>Sản Phẩm {index+1}: {product.name}</p>
                                        </div>
                                    ))}
                                </div> */}
                            </th>
                            <th>{item.returnStatus  ? <text className="true">Đã hoàn trả </text>   : <text className="false">Chưa hoàn trả</text>}</th>
                            <th>{item.receiveStatus ? <text className="true">Đã nhận hàng </text>  : <text className="false">Chưa nhận hàng</text>}</th>
                            <th>{item.paymentStatus ? <text className="true">Đang trả hàng </text> : <text className="false">Lưu trữ</text>}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;