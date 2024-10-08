import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import axios from "axios";
import { Modal } from "antd";
import StatisticsNav from "../../StaticsNav";

const LinkStats = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/all-link-clicks");
        const transformedData = response.data.map((linkClick, index) => ({
          id: index + 1,
          url: linkClick.url,
          count: linkClick.count,
          fullUrl: `http://localhost:5173/place/` + linkClick.postId,
        }));

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching link click data:", error.message);
      }
    };

    fetchData();
  }, []);

  const showModal = (rowData) => {
    setModalData(rowData);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "url", headerName: "URL", width: 200 },
    { field: "count", headerName: "Click Count", width: 150 },
    {
      field: "fullUrl",
      headerName: "Post",
      width: 400,
      renderCell: (params) => (
        <a href={params.row.fullUrl} target="_blank" rel="noopener noreferrer">
          {params.row.fullUrl}
        </a>
      ),
    },
  ];

  const noDataColumns = [{ field: "message", headerName: "Message", flex: 1 }];
  const noDataRows = [{ id: 1, message: "No data found" }];

  return (
    <div>
      <StatisticsNav />
      <div className="userListPage">
        <DataGrid
          rows={data.length > 0 ? data : noDataRows}
          disableSelectionOnClick
          columns={data.length > 0 ? columns : noDataColumns}
          pageSize={13}
          rowsPerPageOptions={[5]}
          checkboxSelection={data.length > 0}
        />
        <Modal
          title="Расширенный просмотр заявок"
          visible={isModalVisible}
          footer={null}
        >
          {modalData && (
            <div>
              <p>
                <span className="font-bold">ID:</span> {modalData.id}
              </p>
              <p>
                <span className="font-bold">Имя Фамилия:</span>{" "}
                {modalData.fullname}
              </p>
              <p>
                <span className="font-bold">Email:</span> {modalData.email}
              </p>
              <p>
                <span className="font-bold">Номер Телефона:</span> +
                {modalData.telefonnumber}
              </p>
              <p>
                <span className="font-bold">Тема проблемы:</span>{" "}
                {modalData.title}
              </p>
              <p>
                <span className="font-bold">Описание проблемы:</span>{" "}
                {modalData.description}
              </p>
              <div>
                <button onClick={handleCancel} className="primary w-2">
                  Cancel
                </button>
                <button onClick={handleOk} className="primary mt-4">
                  Ok
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default LinkStats;
