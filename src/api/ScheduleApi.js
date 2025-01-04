import { messageShowErr, messageShowSuccess } from "../function";
import axiosClient from "./axiosClient";

class ScheduleApi {
  getAll = (params) => {
    const url = "/schedules";
    return axiosClient.get(url, { params });
  };
  getOne = (params) => {
    const url = `/schedules/${params}`;
    return axiosClient.get(url).then((data) => {
      return data.data;
    });
  };
  postschedule = (params) => {
    const url = "/schedules";
    return axiosClient
      .post(url, params)
      .then((data) => {
        messageShowSuccess("Thêm mới thành công!");
      })
      .catch((err) => {
        messageShowErr("Có lỗi xảy ra!");
      });
  };
  deleteschedule = (id) => {
    const url = `/schedules/${id}`;
    return axiosClient
      .delete(url)
      .then((data) => {
        messageShowSuccess("Xoá thành công!");
      })
      .catch((err) => {
        messageShowErr("Có lỗi xảy ra!");
      });
  };
  editschedule = (params) => {
    const url = `/schedules/${params.id}`;
    return axiosClient
      .patch(url, params)
      .then((data) => {
        messageShowSuccess("Sửa thành công!");
      })
      .catch((err) => {
        messageShowErr("Có lỗi xảy ra!");
      });
  };
  getBookingHistoryByUserId = (params) => {
    const url = `/schedules/user/${params}`;
    console.log("Gọi API với URL:", url); // Log URL để kiểm tra chính xác yêu cầu
    return axiosClient
      .get(url)
      .then((data) => {
        console.log("Dữ liệu trả về từ API:", data); // Log dữ liệu trả về từ API
        return data.data;
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err); // Log lỗi nếu có
        messageShowErr("Có lỗi xảy ra khi lấy lịch trình của người dùng!");
      });
  };
}
const scheduleApi = new ScheduleApi();
export default scheduleApi;
