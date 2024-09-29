import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";
import { useNavigate } from "react-router-dom";
import "../pagesAdmin/userList/userList.scss";
import { SearchContext } from "../SearchContext.jsx";
import { BsEye } from "react-icons/bs";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useNavigate();
  const { searchText } = useContext(SearchContext);

  const redirectToSupport = () => {
    history("/reports");
  };
  const filteredPlaces = places
  //  place.address.toLowerCase().includes(searchText.toLowerCase())
  
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/places")
      .then((response) => {
        setPlaces(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [searchText]);
  const renderLoading = () => {
    return (
      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full">
        {Array.from({ length: 3 }, (_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    );
  };
  
  const renderError = () => {
    return <div>Error: {error.message}</div>;
  };

  function SkeletonLoader() {
    return (
      <div className="animate-pulse bg-gray-400 mb-2 rounded-2xl flex">
        <div className="bg-gray-300 h-40 rounded-2xl mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
      </div>
    );
  }
  
  const renderPlaces = () => {
    return places.map((place) => (
      <Link to={"/place/" + place._id} key={place._id}>
        <div className="bg-gray-500 mb-2 rounded-2xl flex">
          {place.photos?.[0] && (
            <Image
              className="rounded-2xl object-cover aspect-square"
              src={place.photos?.[0]}
              alt=""
            />
          )}
        </div>
        <h2 className="font-bold">{place.address}</h2>
        <h3 className="text-sm text-gray-500">{place.title}</h3>
        <div className="mt-1">
          <span className="font-bold">${place.price}</span> per night
          <div className="flex items-center">
            <BsEye />
            <span className="ml-2">{place.viewersCount || 0}</span>
          </div>
        </div>
      </Link>
    ));
  };

  const renderEmptyState = () => {
    return (
      <div className="center">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mt-5">Посты не найдены</h2>
          <p className="text-gray-600 mt-2">
            Мы не смогли найти посты по вашему запросу.
          </p>
          <button onClick={redirectToSupport} className="primary mt-3">
            Обратиться в тех поддержку
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {error
        ? renderError()
        : isLoading
        ? renderLoading()
        : filteredPlaces.length > 0
        ? renderPlaces()
        : renderEmptyState()}
    </div>
  );
}
