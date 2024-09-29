import PhotosUploader from "../PhotosUploader.jsx";
import Perks from "../Perks.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Button, notification, Space } from "antd";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [publishDate, setPublishDate] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Заявка принята",
      description:
        "Ваша заявка на поддержку успешно отправлена. Мы скоро свяжемся с вами. Спасибо за обращение!",
    });
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
  function getCurrentDateFormatted() {
    return format(new Date(), "yyyy-MM-dd");
  }
  function processText(inputText) {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;а-яА-Я]*[-A-Z0-9+&@#/%=~_|]|www\.[\w-]+\.[\w-]+|[\w-]+(?:\.[\w-]+)+(?:\.[\w-а-яА-Я]{2,})?)/gi;

    return inputText.split(urlRegex).map(part => {
      if (part && part.match(urlRegex)) {
        let urlPart = part.startsWith('http') ? part : `http://${part}`;
        return `<a href="${urlPart}">${part}</a>`;
      } else {
        return part || '';
      }
    }).join('');
  }
  async function savePlace(ev) {
    ev.preventDefault();

    const effectivePublishDate = publishDate || getCurrentDateFormatted();
    const processedDescription = processText(description);

    const placeData = {
      title,
      address,
      addedPhotos,
      description: processedDescription, // Используйте обработанный текст
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
      publishDate: effectivePublishDate,
    };
    
    if (id) {
      // update
      await axios.put("/places", {
        id,
        ...placeData,
      });
      openNotificationWithIcon("success")
    } else {
      // new place
      await axios.post("/places", placeData);
      openNotificationWithIcon("success")
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          "Title",
          "Title for your place. should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title, for example: My lovely apt"
        />
        {preInput("Address", "Address to this place")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
        />
        {preInput("Photos", "more = better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput("Description", "description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {preInput("Extra info", "house rules, etc")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {preInput("Select date", "select time for post")}
        <input
          type="date"
          id="publishDate"
          className="mt-5 mb-5 w-full"
          value={publishDate}
          onChange={(ev) => setPublishDate(ev.target.value)}
        />
        <button className="primary my-4">Save</button>
      </form>
      <>
        {contextHolder}
        <Space>
        </Space>
      </>
    </div>
  );
}