import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, notification, Space } from "antd";

export default function BookingWidget({ place }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullname, setFullname] = useState("");
  const [telefonnumber, setTelefonnumber] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Заявка принята",
      description:
        "Ваша заявка на поддержку успешно отправлена. Мы скоро свяжемся с вами. Спасибо за обращение!",
    });
  };

  const handleSubmit = async () => {
    if (
      title.trim().length < 5 ||
      description.trim().length < 5 ||
      fullname.trim().length < 5 ||
      telefonnumber.trim().length < 5 ||
      email.trim().length < 5
    ) {
      // Показать уведомление об ошибке
      alert("Пожалуйста, заполните все поля полностью");
      return; // Прекращаем выполнение функции
    }
    try {
      const response = await axios.post("/support", {
        title,
        description,
        fullname,
        telefonnumber,
        email,
        status: 0,
      });
      console.log("Support data submitted successfully:", response.data);
      openNotificationWithIcon("success")
      setTimeout(() => navigate('/'), 900); 

      setTitle("");
      setDescription("");
      setFullname("");
      setTelefonnumber("");
      setEmail("");
    } catch (error) {
      console.error("Error submitting support data:", error.message);
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded-2xl mt-5">
      <div className="text-2xl text-center">Мы готовы вам помочь!</div>
      <div className="border  mt-4">
        <div className="py-3 px-4 border-t">
          <label>Напишите тему проблемы:</label>
          <input
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            required
          />
        </div>
        <div className="py-3 px-4">
          <label>Опишите вашу проблему:</label>
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            className="h-40"
            required
          />
        </div>

        <div className="py-3 px-4 border-t">
          <label>Your full name:</label>
          <input
            type="text"
            value={fullname}
            onChange={(ev) => setFullname(ev.target.value)}
            required
          />
          <label>Phone number:</label>
          <input
            type="number"
            value={telefonnumber}
            onChange={(ev) => setTelefonnumber(ev.target.value)}
            required
          />
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
        </div>
      </div>
      <button className="primary mt-4" onClick={handleSubmit}>
        Отправить
      </button>

      <>
        {contextHolder}
        <Space>
        </Space>
      </>
    </div>
  );
}
