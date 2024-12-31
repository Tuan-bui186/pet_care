import { messageShowErr, messageShowSuccess } from "../function";
import axiosClient from "./axiosClient";

class StatisticsApi {
  getStatistics = () => {
    const url = "/statistics";
    return axiosClient
      .get(url)
      .then((response) => {
        console.log("Phản hồi API đầy đủ:", response); // Log phản hồi đầy đủ
        return response; // Trả về data trong response
      })
      .catch((err) => {
        console.log("Lỗi khi lấy thống kê:", err);
        messageShowErr("Có lỗi xảy ra khi lấy thống kê!");
      });
  };
}

const statisticsApi = new StatisticsApi();
export default statisticsApi;
