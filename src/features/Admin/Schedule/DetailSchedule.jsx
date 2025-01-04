import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import scheduleApi from "../../../api/ScheduleApi";
import Spinner from "../Spin/Spinner";
import "../../../sass/RegisterService/ScheduleDetail.scss";
import { formatDate } from "../../../function";
import petApi from "../../../api/petApi";

export default function ScheduleDetail() {
  const { id } = useParams();
  console.log("id", id);

  const [schedule, setSchedule] = useState(null);
  const [petDetails, setPetDetails] = useState(null);

  useEffect(() => {
    scheduleApi
      .getOne(id)
      .then((ok) => {
        console.log("ok", ok);
        setSchedule(ok);

        if (ok.petId) {
          petApi
            .getOne(ok.petId)
            .then((pet) => {
              setPetDetails(pet);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div className="AdminTable">
      <div className="heading">
        <div className="heading__title">
          <h3>Chi tiết đặt lịch</h3>
        </div>
        <div className="heading__hr"></div>
      </div>
      <div className="bill-detail">
        {schedule ? (
          <div className="container">
            <div className="schedule-detail">
              <div className="title">Loại dịch vụ: {schedule.typeService}</div>
              <div className="form">
                <p>
                  <div className="text-bold">Tên Người dùng</div>:{" "}
                  {schedule.name}
                </p>
                <p>
                  <div className="text-bold">Số điện thoại</div>:{" "}
                  {schedule.phone}
                </p>
                <p>
                  <div className="text-bold">Địa chỉ</div>: {schedule.address}
                </p>
                {/* Hiển thị thông tin thú cưng nếu có */}
                {petDetails && (
                  <>
                    <p>
                      <div className="text-bold">Tên thú cưng</div>:{" "}
                      {petDetails.name}
                    </p>
                    {/* <p>
                      <div className="text-bold">Loại thú cưng</div>:{" "}
                      {petDetails.typePet}
                    </p> */}
                    <p>
                      <div className="text-bold">Avatar</div>:{" "}
                      <img
                        src={petDetails.avatar}
                        alt={petDetails.name}
                        className="pet-avatar"
                      />
                    </p>
                  </>
                )}
                <p>
                  <div className="text-bold">Cân nặng</div>:{" "}
                  {schedule.typeWeight}
                </p>
                <p>
                  <div className="text-bold">Thời gian</div>:{" "}
                  {formatDate(schedule.date)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
