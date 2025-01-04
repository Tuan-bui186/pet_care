import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import healthRecordApi from "../../../api/healthRecordApi";
import petApi from "../../../api/petApi";
import "../../../sass/InforUser/healthRecordsByPet.scss";

const HealthRecordsByPet = () => {
  const { petId } = useParams(); // Lấy petId từ URL
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pet, setPet] = useState({}); // Lưu thông tin thú cưng

  useEffect(() => {
    const fetchHealthRecords = async () => {
      if (!petId) {
        setError("Không có petId!");
        setLoading(false);
        return;
      }

      try {
        // Gọi API lấy hồ sơ sức khỏe của thú cưng
        const response = await healthRecordApi.getByPetId(petId);
        setHealthRecords(response || []);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi API:", err);
        setError("Không thể tải danh sách hồ sơ sức khỏe!");
        setLoading(false);
      }

      try {
        // Gọi API lấy thông tin thú cưng
        const petResponse = await petApi.getOne(petId);
        setPet(petResponse);
      } catch (err) {
        console.error("Lỗi API thú cưng:", err);
        setError("Không thể tải thông tin thú cưng!");
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, [petId]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="health-records">
      <h2>Hồ Sơ Sức Khỏe - Thú Cưng</h2>

      {/* Thông tin thú cưng */}
      <div className="pet-info">
        <img src={pet.avatar} alt={pet.name} className="pet-avatar" />
        <span className="pet-name">{pet.name}</span>
      </div>

      {healthRecords.length === 0 ? (
        <p className="no-records">
          Không có hồ sơ sức khỏe nào cho thú cưng này.
        </p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ngày Khám</th>
                <th>Chẩn Đoán</th>
                <th>Đơn Thuốc</th>
                <th>Chế Độ Ăn Uống</th>
              </tr>
            </thead>
            <tbody>
              {healthRecords.map((record) => (
                <tr key={record.id} className="record-row">
                  <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                  <td>{record.diagnosis}</td>
                  <td>{record.prescription}</td>
                  <td>{record.dietPlan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HealthRecordsByPet;
