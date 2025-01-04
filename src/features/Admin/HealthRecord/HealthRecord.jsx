import { Pagination } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import healthRecordApi from "../../../api/healthRecordApi";
import { countPagination, formatDate } from "../../../function";
import Spinner from "../Spin/Spinner";
import { add } from "../svg/IconSvg";
import Table from "../Table/Table";
import { Link } from "react-router-dom";

export default function HealthRecord() {
  const { url } = useRouteMatch();
  const titleTable = [
    { title: "Chẩn đoán", name: "diagnosis" },
    { title: "Đơn thuốc", name: "prescription" },
    { title: "Kế hoạch dinh dưỡng", name: "dietPlan" },
    { title: "Ngày khám", name: "date" },
  ];

  const [records, setRecords] = useState(null);
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    healthRecordApi
      .getAll({ page: page })
      .then((response) => {
        console.log("Dữ liệu hồ sơ sức khỏe:", response);
        setRecords(response);
      })
      .catch((error) => {
        console.log("Lỗi khi tải dữ liệu:", error);
      });
  }, [load, page]);

  const history = useHistory();

  // Chuyển hướng đến trang chỉnh sửa hồ sơ sức khỏe
  const handleEdit = (id) => {
    console.log("Chỉnh sửa hồ sơ có ID:", id);
    history.push(`${url}/editHealthRecord/${id}`);
  };

  // Xử lý xóa hồ sơ sức khỏe
  const handleDelete = async (id) => {
    if (!id) {
      console.error("Không có ID để xóa!");
      return;
    }

    console.log("Đang xóa bản ghi có ID:", id);

    try {
      await healthRecordApi.delete(id); // Gọi API để xóa hồ sơ
      setLoad(!load); // Cập nhật lại dữ liệu sau khi xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa hồ sơ:", error);
    }
  };

  return (
    <div className="AdminTable">
      <div className="heading">
        <div className="heading__title">
          <h3>Quản lý hồ sơ sức khỏe</h3>
        </div>
        <div className="heading__hr"></div>
      </div>
      <div className="add-admin">
        <button>
          <Link to={`${url}/AddHealthRecord`}>
            <div className="icon">{add}</div>
            <div className="text">Thêm hồ sơ sức khỏe</div>
          </Link>
        </button>
      </div>

      {records !== null ? (
        <div>
          <Table
            titleTable={titleTable}
            onchangeDelete={(id) => {
              console.log("ID đang được truyền cho xóa:", id); // Kiểm tra ID trước khi gọi delete
              handleDelete(id);
            }}
            onchangeEdit={handleEdit} // Truyền hàm chỉnh sửa
            dataSource={records.map((record) => ({
              key: record.id, // Đảm bảo id được truyền đúng
              diagnosis: record.diagnosis,
              prescription: record.prescription,
              dietPlan: record.dietPlan,
              date: formatDate(record.createdAt),
              action: (
                <div>
                  <button onClick={() => handleDelete(record.id)}>Xoá</button>{" "}
                  {/* Xóa hồ sơ */}
                  <button onClick={() => handleEdit(record.id)}>
                    Sửa
                  </button>{" "}
                  {/* Chỉnh sửa hồ sơ */}
                </div>
              ),
            }))}
          />

          <Pagination
            onChange={(e, i) => {
              setPage(i);
            }}
            count={countPagination(records.count)} // Cập nhật số trang từ số lượng bản ghi
            color="secondary"
            variant="outlined"
            shape="rounded"
          />
        </div>
      ) : (
        <Spinner /> // Hiển thị khi đang tải dữ liệu
      )}
    </div>
  );
}
