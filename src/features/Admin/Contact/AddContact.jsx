import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import healthRecordApi from "../../../api/healthRecordApi";
import petApi from "../../../api/petApi";
import { messageShowErr, messageShowSuccess } from "../../../function";
import Spinner from "../Spin/Spinner";
import "../../../sass/Admin/addHealthRecord.scss";

export default function AddHealthRecord() {
  const [pets, setPets] = useState([]); // Trạng thái lưu danh sách thú cưng
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    loadSpin: false,
  });
  const { loadSpin } = state;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const history = useHistory();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await petApi.getAll();
        if (response && response.data && Array.isArray(response.data.rows)) {
          setPets(response.data.rows); // Truy cập vào 'data.rows' để lấy danh sách thú cưng
        } else {
          setPets([]); // Nếu không đúng cấu trúc, gán pets thành mảng rỗng
        }
      } catch (error) {
        messageShowErr("Không thể lấy danh sách thú cưng!");
        setPets([]);
      }
    };
    fetchPets();
  }, []);

  const onSubmit = async (data) => {
    setState({ ...state, loadSpin: true });
    try {
      await healthRecordApi.create({
        diagnosis: data.diagnosis,
        prescription: data.prescription,
        dietPlan: data.dietPlan,
        date: data.date,
        petId: data.petId,
      });
      messageShowSuccess("Thêm hồ sơ sức khỏe thành công!");
      history.push("/Admin/HealthRecord");
    } catch (error) {
      messageShowErr("Có lỗi khi thêm hồ sơ!");
    }
    setState({ ...state, loadSpin: false });
  };

  return (
    <div className="add-health-record">
      <div className="heading">
        <h3>Thêm Hồ Sơ Sức Khỏe</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Chẩn đoán:</label>
          <input
            type="text"
            {...register("diagnosis", {
              required: "Không được bỏ trống!",
              maxLength: {
                value: 255,
                message: "Vượt quá ký tự cho phép!",
              },
            })}
          />
          {errors.diagnosis && (
            <span className="text-danger">{errors.diagnosis.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Đơn thuốc:</label>
          <input
            type="text"
            {...register("prescription", {
              required: "Không được bỏ trống!",
              maxLength: {
                value: 255,
                message: "Vượt quá ký tự cho phép!",
              },
            })}
          />
          {errors.prescription && (
            <span className="text-danger">{errors.prescription.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Kế hoạch dinh dưỡng:</label>
          <input
            type="text"
            {...register("dietPlan", {
              required: "Không được bỏ trống!",
              maxLength: {
                value: 500,
                message: "Vượt quá ký tự cho phép!",
              },
            })}
          />
          {errors.dietPlan && (
            <span className="text-danger">{errors.dietPlan.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Ngày khám:</label>
          <input
            type="date"
            {...register("date", { required: "Không được bỏ trống!" })}
          />
          {errors.date && (
            <span className="text-danger">{errors.date.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Chọn thú cưng:</label>
          <select
            {...register("petId", { required: "Vui lòng chọn thú cưng!" })}
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
          {errors.petId && (
            <span className="text-danger">{errors.petId.message}</span>
          )}
        </div>

        <div className="form-actions">
          {loadSpin ? (
            <Spinner />
          ) : (
            <button type="submit">Thêm hồ sơ sức khỏe</button>
          )}
        </div>
      </form>
    </div>
  );
}
