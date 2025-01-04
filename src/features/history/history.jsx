import React, { useEffect, useState } from "react";
import scheduleApi from "../../api/ScheduleApi";
import userApi from "../../api/userApi";
import petApi from "../../api/petApi";
import "../../sass/schedule/shedule.scss";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await userApi.checkUser();
        if (user && user.id) {
          setUserId(user.id);
        } else {
          setError("Không tìm thấy thông tin người dùng.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi lấy thông tin người dùng.");
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchBookingHistory = async () => {
      try {
        const data = await scheduleApi.getBookingHistoryByUserId(userId);
        // Lấy thông tin thú cưng cho mỗi booking
        const updatedBookings = await Promise.all(
          data.map(async (booking) => {
            if (booking.petId) {
              const petData = await petApi.getOne(booking.petId); // Lấy thông tin thú cưng
              return { ...booking, pet: petData }; // Thêm thông tin thú cưng vào booking
            }
            return booking;
          })
        );
        setBookings(updatedBookings);
      } catch (err) {
        setError("Có lỗi xảy ra khi lấy lịch sử đặt khám của người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [userId]);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return (
    <div className="booking-history-container">
      <div className="header">
        <h2>Lịch sử đặt lịch của bạn</h2>
      </div>
      <div className="booking-content">
        {bookings && bookings.length > 0 ? (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Loại dịch vụ</th>
                <th>Ngày và giờ khám</th>
                <th>Avatar Thú cưng</th>
                <th>Tên Thú cưng</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="booking-item">
                  <td>{booking.typeService}</td>
                  <td>{formatDate(booking.date)}</td>
                  <td>
                    {booking.pet ? (
                      <img
                        src={booking.pet.avatar}
                        alt={booking.pet.name}
                        className="pet-avatar"
                      />
                    ) : (
                      <span>Không có avatar</span>
                    )}
                  </td>
                  <td>
                    {booking.pet ? booking.pet.name : "Không có tên thú cưng"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-bookings">Không có lịch sử đặt khám nào.</div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
