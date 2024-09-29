import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import axios from "axios";
import { Modal } from "antd";

const UserList = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/allsupport");
        const transformedData = response.data.map((row) => ({
          ...row,
          id: row._id,
        }));

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching support data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/deletesupport/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting support data:", error.message);
    }
  };
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

  // Regular columns definition
  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "fullname",
      headerName: "Full Name",
      width: 150,
      renderCell: (params) => (
        <div className="userListField" onClick={() => showModal(params.row)}>
          {params.row.fullname}
        </div>
      ),
    },
    {
      renderCell: (params) => {
        return <div className="userListField">{params.row.username}</div>;
      },
    },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => {
        return (
          <>
            <DeleteOutline
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  const noDataColumns = [{ field: "message", headerName: "Message", flex: 1 }];
  const noDataRows = [{ id: 1, message: "No data found" }];

  return (
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
              <button onClick={handleCancel} className="primary w-2">Cancel</button>
              <button onClick={handleOk} className="primary mt-4">Ok</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
