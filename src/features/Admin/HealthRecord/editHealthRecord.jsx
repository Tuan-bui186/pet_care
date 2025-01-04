import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import healthRecordApi from "../../../api/healthRecordApi";
import petApi from "../../../api/petApi";
import { messageShowErr, messageShowSuccess } from "../../../function";
import "../../../sass/Admin/addHealthRecord.scss";

export default function EditHealthRecord() {
  const { id } = useParams(); // Lấy ID từ URL
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [date, setDate] = useState("");
  const [petId, setPetId] = useState(""); // Trạng thái lưu ID thú cưng đã chọn
  const [pets, setPets] = useState([]); // Trạng thái lưu danh sách thú cưng
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  // Lấy dữ liệu hồ sơ sức khỏe từ API khi trang được tải
  useEffect(() => {
    const fetchHealthRecord = async () => {
      try {
        const response = await healthRecordApi.getOne(id); // Gọi API để lấy thông tin hồ sơ sức khỏe theo ID
        const { diagnosis, prescription, dietPlan, date, petId } = response;
        setDiagnosis(diagnosis);
        setPrescription(prescription);
        setDietPlan(dietPlan);
        setDate(date);
        setPetId(petId);
        // Kiểm tra xem API có trả về dữ liệu hợp lệ không
        // if (response && response.data) {
        //   const { diagnosis, prescription, dietPlan, date, petId } = response.data;
        //   setDiagnosis(diagnosis);
        //   setPrescription(prescription);
        //   setDietPlan(dietPlan);
        //   setDate(date);
        //   setPetId(petId);
        // } else {
        //   messageShowErr("Không tìm thấy hồ sơ sức khỏe!");
        // }
      } catch (error) {
        messageShowErr("Không thể lấy hồ sơ sức khỏe!");
        console.error("Lỗi khi gọi API lấy hồ sơ sức khỏe: ", error);
      }
    };
    fetchHealthRecord();
  }, [id]); // Mỗi khi ID thay đổi, gọi lại API

  // Lấy danh sách thú cưng
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await petApi.getAll();
        if (response && response.data && Array.isArray(response.data.rows)) {
          setPets(response.data.rows); // Lưu danh sách thú cưng vào state
        } else {
          setPets([]);
        }
      } catch (error) {
        messageShowErr("Không thể lấy danh sách thú cưng!");
        console.error("Lỗi khi gọi API lấy thú cưng: ", error);
        setPets([]);
      }
    };
    fetchPets();
  }, []);

  // Xử lý khi người dùng gửi form để cập nhật hồ sơ sức khỏe
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!diagnosis || !prescription || !dietPlan || !date || !petId) {
      messageShowErr("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      // Gửi yêu cầu cập nhật hồ sơ sức khỏe
      await healthRecordApi.update(id, {
        diagnosis,
        prescription,
        dietPlan,
        date,
        petId,
      });
      messageShowSuccess("Cập nhật hồ sơ sức khỏe thành công!");
      history.push("/Admin/HealthRecord"); // Quay lại trang danh sách hồ sơ sức khỏe
    } catch (error) {
      messageShowErr("Có lỗi khi cập nhật hồ sơ!");
      console.error("Lỗi khi cập nhật hồ sơ sức khỏe: ", error);
    }
    setLoading(false);
  };

  return (
    <div className="add-health-record">
      <div className="heading">
        <h3>Sửa Hồ Sơ Sức Khỏe</h3>
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
            {loading ? "Đang cập nhật..." : "Cập nhật hồ sơ sức khỏe"}
          </button>
        </div>
      </form>
    </div>
  );
}
