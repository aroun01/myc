// import React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";
//
// const DownloadList = () => {
//   const handleDownload = async (username, url) => {
//     const downloadData = { username, url };
//
//     try {
//       const response = await axios.post("/create-download-task", downloadData);
//       const result = response.data;
//       console.log(result);
//     } catch (error) {
//       console.error("Ошибка при создании задачи на скачивание:", error);
//     }
//   };
//
//   const rows = [
//     {
//       id: 1,
//       Name: "Alice",
//       Size: "10MB",
//       username: "alice123",
//       Status: "Active",
//       "Date Start Task": "2023-01-01",
//       "Date Download": "2023-01-02",
//       url: "http://example.com/file1",
//     },
//     {
//       id: 2,
//       Name: "Bob",
//       Size: "20MB",
//       username: "bob456",
//       Status: "Inactive",
//       "Date Start Task": "2023-02-01",
//       "Date Download": "2023-02-02",
//       url: "http://example.com/file2",
//     },
//     {
//       id: 3,
//       Name: "Charlie",
//       Size: "30MB",
//       username: "charlie789",
//       Status: "Inactive",
//       "Date Start Task": "2023-03-01",
//       "Date Download": "2023-03-02",
//       url: "http://example.com/file3",
//     },
//   ];
//   const columns = [
//     { field: "Name", headerName: "Имя", width: 100 },
//     { field: "Size", headerName: "Размер", width: 150 },
//     { field: "username", headerName: "Пользователь", width: 150 },
//     { field: "Status", headerName: "Статус", width: 150 },
//     { field: "Date Start Task", headerName: "Дата начала задачи", width: 200 },
//     { field: "Date Download", headerName: "Дата скачивания", width: 200 },
//     { field: "url", headerName: "URL", width: 200 },
//     {
//       field: "action",
//       headerName: "Действие",
//       width: 200,
//       renderCell: (params) => (
//         <button
//           onClick={() => handleDownload(params.row.username, params.row.url)}
//         >
//           Скачать
//         </button>
//       ),
//     },
//   ];
//   return (
//     <div className="userListPage">
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSize={13}
//         rowsPerPageOptions={[5]}
//         checkboxSelection
//       />
//     </div>
//   );
// };
//
// export default DownloadList;

import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const DownloadList = () => {
  const [rows, setRows] = useState([]);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://taskman:4001/api/tasks/get_list");
        setRows(response.data);
      } catch (error) {
        console.error("Ошибка при получении списка задач:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleCreateTask = async (row) => {
    try {
      const response = await axios.post("http://taskman:4001/api/tasks/set_task", {
        userId: row.id,
        url: row.url,
        method: row.method,
      });
      console.log("Задача создана:", response.data);
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
    }
  };

  // Функция для обновления существующей задачи
  const handleUpdateTask = async (row) => {
    try {
      const response = await axios.post("http://taskman:4001/api/tasks/set_task", {
        userId: row.id,
        url: row.url,
        method: row.method,
        id: row.id,
        status: row.status,
      });
      console.log("Задача обновлена:", response.data);
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  // Функция для удаления задачи
  const handleDeleteTask = async (id) => {
    try {
      const response = await axios.post("http://taskman:4001/api/tasks/rm_task", {
        id: id,
      });
      setRows(rows.filter((row) => row.id !== id));
      console.log("Задача удалена:", response.data);
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  };

  // Функция для скачивания файла
  const handleDownload = async (row) => {
    console.log("Downloading for", row);
    try {
      const response = await axios.post("/download", {
        userId: row.id,
        url: row.url,
        method: row.method,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const columns = [
    { field: "Name", headerName: "Name", width: 100 },
    { field: "Size", headerName: "Size", width: 100 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "Status", headerName: "Status", width: 100 },
    {
      field: "method",
      headerName: "Method",
      width: 120,
      renderCell: (params) => (
        <Select
          label="Method"
          value={params.value}
          onChange={(e) => {
            const newRows = rows.map((row) => {
              if (row.id === params.id) {
                return { ...row, method: e.target.value };
              }
              return row;
            });
            setRows(newRows);
          }}
          size="small"
        >
          <MenuItem value="direct">Direct</MenuItem>
          <MenuItem value="proxy">Proxy</MenuItem>
          <MenuItem value="tor">Tor</MenuItem>
        </Select>
      ),
    },
    {
      field: "url",
      headerName: "URL",
      width: 200,
      renderCell: (params) => (
        <TextField
          fullWidth
          size="small"
          value={params.value}
          onChange={(e) => {
            const newRows = rows.map((row) => {
              if (row.id === params.id) {
                return { ...row, url: e.target.value };
              }
              return row;
            });
            setRows(newRows);
          }}
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={() => handleDownload(params.row)}
          disabled={!params.row.url || !params.row.method}
        >
          Download
        </Button>,
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleUpdateTask(params.row)}
        >
          Update
        </Button>,
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDeleteTask(params.row.id)}
        >
          Delete
        </Button>,
      ],
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default DownloadList;
