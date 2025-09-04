import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditBill() {
    const { id } = useParams(); // bill id từ URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        paymentCode: "",
        packageCode: "",
        customerId: "",
        productIds: [],
        paymentStatus: false,
        receiveStatus: false,
        returnStatus: false,
    });

    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/bill/${id}`);
                const bill = res.data;
                setFormData({
                    paymentCode: bill.paymentCode || "",
                    packageCode: bill.packageCode || "",
                    customerId: bill.customer?.id || "",
                    productIds: bill.billProducts?.map(bp => bp.product.id) || [],
                    paymentStatus: bill.paymentStatus || false,
                    receiveStatus: bill.receiveStatus || false,
                    returnStatus: bill.returnStatus || false,
                });
            } catch (err) {
                alert("Lỗi load Bill: " + err.message);
            }
        };

        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/product");
                setAllProducts(res.data); // tất cả product
            } catch (err) {
                alert("Lỗi load sản phẩm: " + err.message);
            }
        };

        fetchBill();
        fetchProducts();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox" && name === "productIds") {
            const val = parseInt(value);
            setFormData(prev => {
                const newProductIds = checked
                    ? [...prev.productIds, val]
                    : prev.productIds.filter(pid => pid !== val);
                return { ...prev, productIds: newProductIds };
            });
        } else if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            paymentCode: formData.paymentCode,
            packageCode: formData.packageCode,
            customerId: parseInt(formData.customerId),
            productIds: formData.productIds,
            paymentStatus: formData.paymentStatus,
            receiveStatus: formData.receiveStatus,
            returnStatus: formData.returnStatus,
        };

        try {
            await axios.put(`http://localhost:8080/bill/${id}`, payload);
            alert("Cập nhật bill thành công!");
            window.location.href = "/dashboard";
        } catch (err) {
            alert("Cập nhật thất bại: " + err.message);
        }
    };

    return (
        <div>
            <h2>Sửa Bill</h2>
            <form onSubmit={handleSubmit}>
                <label>Mã thanh toán:</label>
                <input type="text" name="paymentCode" value={formData.paymentCode} onChange={handleChange} />

                <label>Mã đơn hàng:</label>
                <input type="text" name="packageCode" value={formData.packageCode} onChange={handleChange} />

                <label>Khách hàng:</label>
                <input type="text" name="customerId" value={formData.customerId} onChange={handleChange} />

                <label>Trạng thái thanh toán:</label>
                <input type="checkbox" name="paymentStatus" checked={formData.paymentStatus} onChange={handleChange} />

                <label>Trạng thái nhận hàng:</label>
                <input type="checkbox" name="receiveStatus" checked={formData.receiveStatus} onChange={handleChange} />

                <label>Trạng thái trả hàng:</label>
                <input type="checkbox" name="returnStatus" checked={formData.returnStatus} onChange={handleChange} />

                <label>Sản phẩm:</label>
                <table>
                    <thead>
                        <tr>
                            <th>Chọn</th>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProducts.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        name="productIds"
                                        value={p.id}
                                        checked={formData.productIds.includes(p.id)}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>{p.id}</td>
                                <td>{p.productName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="submit">Cập nhật</button>
            </form>
        </div>
    );
}

export default EditBill;
