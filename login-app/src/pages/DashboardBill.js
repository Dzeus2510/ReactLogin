import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Dashboard.css"

function Dashboard({ }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoverProducts, setHoverProducts] = useState([]);
    const [hoverBillId, setHoverBillId] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/bill/count");
                setData(response.data);
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

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bill này?")) return;
        try {
            await axios.delete(`http://localhost:8080/bill/${id}`);
            setData(data.filter(item => item.id !== id));
        } catch (err) {
            alert("Xóa thất bại: " + err.message);
        }
    };

    const handleEdit = (id) => {
        window.location.href = `/edit-bill/${id}`;
    };

    const handleMouseEnter = async (billId) => {
        setHoverBillId(billId);
        try {
            const res = await axios.get(`http://localhost:8080/product/productbill/${billId}`);
            setHoverProducts(res.data); // backend trả về List<String>
        } catch (err) {
            console.error("Lỗi load product:", err);
            setHoverProducts([]);
        }
    };

    const handleMouseLeave = () => {
        setHoverBillId(null);
        setHoverProducts([]);
    };

    return (
        <div>
            {/* <h1>Chào, {user.name}!</h1> */}
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
                    <th>Hành động</th>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <th><a href="#" className="link">{item.paymentCode}</a></th>
                            <th>{formatDate(item.createdDate)}</th>
                            <th><a href="#" className="link">{item.packageCode}</a></th>
                            <th>{item.customerName}</th>
                            <th className="dropdown" 
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={handleMouseLeave}>
                                {item.productCount} sản phẩm
                                {hoverBillId === item.id && hoverProducts.length > 0 && (
                                    <div className="dropdown-content">
                                        {hoverProducts.map((p, idx) => (
                                            <p key={idx}>- {p}</p>
                                        ))}
                                    </div>
                                )}
                            </th>
                            <th>{item.returnStatus ? <text className="true">Đã hoàn trả </text> : <text className="false">Chưa hoàn trả</text>}</th>
                            <th>{item.receiveStatus ? <text className="true">Đã nhận hàng </text> : <text className="false">Chưa nhận hàng</text>}</th>
                            <th>{item.paymentStatus ? <text className="true">Đang trả hàng </text> : <text className="false">Lưu trữ</text>}</th>
                            <th>
                                <button
                                    onClick={() => handleEdit(item.id)}
                                    className="btn-edit"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="btn-delete"
                                >
                                    Xóa
                                </button>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;