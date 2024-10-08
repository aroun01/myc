import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import parse from "html-react-parser";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }

    const viewedPlaces = localStorage.getItem("viewedPlaces")
      ? JSON.parse(localStorage.getItem("viewedPlaces"))
      : [];

    if (!viewedPlaces.includes(id)) {
      axios.post(`/places/view/${id}`).then(() => {
        viewedPlaces.push(id);
        localStorage.setItem("viewedPlaces", JSON.stringify(viewedPlaces));
      });
    }

    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";

  const trackLinkClick = async (url) => {
    console.log("Tracking link click for URL:", url);
    try {
      await axios.post("/track-click", { placeId: place._id, url });
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error tracking link click:", error);
    }
  };

  const renderDescriptionWithLinks = (description) => {
    return parse(description, {
      replace: (domNode) => {
        if (domNode.name === "a") {
          return (
            <a
              href={domNode.attribs.href}
              onClick={(e) => {
                e.preventDefault();
                trackLinkClick(domNode.attribs.href);
              }}
              style={{ color: "#3366BB" }}
            >
              {domNode.children[0].data}
            </a>
          );
        }
      },
    });
  };

  const renderExtraInfoWithLinks = (extraInfo) => {
    return parse(extraInfo, {
      replace: (domNode) => {
        if (domNode.name === "a") {
          return (
            <a
              href={domNode.attribs.href}
              onClick={(e) => {
                e.preventDefault();
                trackLinkClick(domNode.attribs.href);
              }}
              style={{ color: "#3366BB" }}
            >
              {domNode.children[0].data}
            </a>
          );
        }
      },
    });
  };

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            <div>{renderDescriptionWithLinks(place.description)}</div>
          </div>
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {renderExtraInfoWithLinks(place.extraInfo)}
        </div>
      </div>
    </div>
  );
}
