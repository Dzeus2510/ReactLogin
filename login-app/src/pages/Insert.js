import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Insert.css"

function AddBill() {
    const [formData, setFormData] = useState({
        paymentCode: "",
        packageCode: "",
        customerId: "",
        product: [],
    });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8080/product");
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const productIds = form.getAll("productIds").map(Number); // gom các checkbox

        const payload = {
            ...formData,
            productIds,
        };

        try {
            await axios.post("http://localhost:8080/bill", payload);
            alert("Thêm bill thành công!");
            window.location.href = "/dashboard"; // quay lại dashboard
        } catch (err) {
            alert("Thêm thất bại: " + err.message);
        }
    };

    return (
        <div>
            <h2>Thêm Bill mới</h2>
            <form onSubmit={handleSubmit}>
                <label>Mã thanh toán:</label>
                <input type="text" name="paymentCode" onChange={handleChange} />

                <label>Mã đơn hàng:</label>
                <input type="text" name="packageCode" onChange={handleChange} />

                <label>Khách hàng:</label>
                <input type="text" name="customerId" onChange={handleChange} />

                <label>Sản phẩm:</label>
                <h3>Chọn sản phẩm</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Chọn</th>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <input type="checkbox" name="productIds" value={p.id} />
                                </td>
                                <td>{p.id}</td>
                                <td>{p.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="submit">Thêm Bill</button>
            </form>
        </div>
    );
}

export default AddBill;
