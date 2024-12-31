import React, { useEffect, useState } from "react";
import scheduleApi from "../../api/ScheduleApi"; // Import Schedule API

const UserSchedules = ({ userId }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true); // Để xử lý trạng thái tải dữ liệu
  const [error, setError] = useState(""); // Để xử lý lỗi

  useEffect(() => {
    // Khi userId thay đổi, gọi API để lấy lịch trình của người dùng
    const fetchSchedules = async () => {
      try {
        const data = await scheduleApi.getSchedulesByUserId({ userId });
        setSchedules(data); // Cập nhật lịch trình
      } catch (err) {
        setError("Có lỗi xảy ra khi lấy lịch trình của người dùng.");
      } finally {
        setLoading(false); // Hoàn tất việc tải
      }
    };

    fetchSchedules();
  }, [userId]); // useEffect chạy khi `userId` thay đổi

  // Hiển thị giao diện dựa trên trạng thái
  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Lịch trình của người dùng {userId}</h2>
      {schedules && schedules.length > 0 ? (
        <ul>
          {schedules.map((schedule) => (
            <li key={schedule.id}>
              <strong>{schedule.name}</strong> - {schedule.date}
            </li>
          ))}
        </ul>
      ) : (
        <div>Không có lịch trình nào.</div>
      )}
    </div>
  );
};

export default UserSchedules;
