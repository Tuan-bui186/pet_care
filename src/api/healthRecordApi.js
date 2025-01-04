import { messageShowErr, messageShowSuccess } from "../function";
import axiosClient from "./axiosClient";

class HealthRecordApi {
  // Lấy danh sách hồ sơ sức khỏe
  getAll = (params) => {
    const url = "/healthRecords";
    return axiosClient.get(url, { params });
  };

  // Lấy chi tiết hồ sơ sức khỏe theo ID
  getOne = (id) => {
    const url = `/healthRecords/${id}`;
    return axiosClient
      .get(url)
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => {
        messageShowErr("Có lỗi khi lấy thông tin hồ sơ!");
      });
  };

  // Thêm mới hồ sơ sức khỏe
  create = (params) => {
    const url = "/healthRecords";
    return axiosClient
      .post(url, params)
      .then((data) => {
        messageShowSuccess("Thêm hồ sơ sức khỏe thành công!");
      })
      .catch((err) => {
        messageShowErr("Có lỗi khi thêm hồ sơ!");
      });
  };

  // Cập nhật hồ sơ sức khỏe
  update = (id, params) => {
    const url = `/healthRecords/${id}`; // URL với ID của hồ sơ sức khỏe cần cập nhật
    return axiosClient
      .put(url, params) // Sử dụng phương thức PUT để gửi yêu cầu cập nhật
      .then((data) => {
        messageShowSuccess("Cập nhật hồ sơ sức khỏe thành công!"); // Hiển thị thông báo thành công
      })
      .catch((err) => {
        messageShowErr("Có lỗi khi cập nhật hồ sơ!"); // Hiển thị thông báo lỗi nếu có
        console.error("Lỗi khi cập nhật hồ sơ sức khỏe: ", err); // In ra lỗi chi tiết nếu có
      });
  };

  // Xoá hồ sơ sức khỏe
  delete = (id) => {
    const url = `/healthRecords/${id}`;
    return axiosClient
      .delete(url)
      .then((data) => {
        messageShowSuccess("Xoá hồ sơ sức khỏe thành công!");
      })
      .catch((err) => {
        console.error("Delete error:", err);
        messageShowErr("Có lỗi khi xoá hồ sơ!");
      });
  };

  // Lấy danh sách hồ sơ sức khỏe theo thú cưng (petId)
  getByPetId = (petId) => {
    const url = `/healthRecords/pets/${petId}`;
    return axiosClient
      .get(url)
      .then((data) => {
        console.log(`Danh sách hồ sơ sức khỏe của thú cưng ${petId}:`, data);
        return data;
      })
      .catch((err) => {
        console.error(`Error fetching health records for pet ${petId}:`, err);
        messageShowErr(
          "Có lỗi khi lấy danh sách hồ sơ sức khỏe theo thú cưng!"
        );
      });
  };
}

const healthRecordApi = new HealthRecordApi();
export default healthRecordApi;
