import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import healthRecordApi from "../../../api/healthRecordApi";
import { messageShowErr, messageShowSuccess } from "../../../function";
import { Link } from "react-router-dom";
import petApi from "../../../api/petApi";
import "../../../sass/Admin/addHealthRecord.scss";

export default function AddHealthRecord() {
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [date, setDate] = useState("");
  const [petId, setPetId] = useState(""); // Trạng thái lưu ID thú cưng đã chọn
  const [pets, setPets] = useState([]); // Trạng thái lưu danh sách thú cưng
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await petApi.getAll();
        console.log("Dữ liệu trả về từ API pets: ", response); // Kiểm tra lại cấu trúc dữ liệu
        if (response && response.data && Array.isArray(response.data.rows)) {
          setPets(response.data.rows); // Truy cập vào 'data.rows' để lấy danh sách thú cưng
        } else {
          setPets([]); // Nếu không đúng cấu trúc, gán pets thành mảng rỗng
        }
      } catch (error) {
        messageShowErr("Không thể lấy danh sách thú cưng!");
        console.error("Lỗi khi gọi API lấy thú cưng: ", error); // Kiểm tra lỗi
        setPets([]); // Nếu có lỗi, khởi tạo mảng rỗng
      }
    };
    fetchPets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!diagnosis || !prescription || !dietPlan || !date || !petId) {
      messageShowErr("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      await healthRecordApi.create({
        diagnosis,
        prescription,
        dietPlan,
        date,
        petId, // Thêm ID thú cưng vào dữ liệu gửi lên
      });
      messageShowSuccess("Thêm hồ sơ sức khỏe thành công!");
      history.push("/Admin/HealthRecord");
    } catch (error) {
      messageShowErr("Có lỗi khi thêm hồ sơ!");
    }
    setLoading(false);
  };

  return (
    <div className="add-health-record">
      <div className="heading">
        <h3>Thêm Hồ Sơ Sức Khỏe</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Chẩn đoán:</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Nhập chẩn đoán"
            required
          />
        </div>

        <div className="form-group">
          <label>Đơn thuốc:</label>
          <input
            type="text"
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Nhập đơn thuốc"
            required
          />
        </div>

        <div className="form-group">
          <label>Kế hoạch dinh dưỡng:</label>
          <input
            type="text"
            value={dietPlan}
            onChange={(e) => setDietPlan(e.target.value)}
            placeholder="Nhập kế hoạch dinh dưỡng"
            required
          />
        </div>

        <div className="form-group">
          <label>Ngày khám:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Chọn thú cưng:</label>
          <select
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            required
          >
            <option value="">Chọn thú cưng</option>
            {pets && pets.length > 0 ? (
              pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))
            ) : (
              <option disabled>Không có thú cưng</option>
            )}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm hồ sơ sức khỏe"}
          </button>
        </div>
      </form>
    </div>
  );
}
