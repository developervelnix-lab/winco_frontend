import React from "react";
import { useNavigate } from "react-router-dom";
import sportImage from "./images/sport.webp";
import cusinoImage from "./images/cusino.webp";
import homeImage from "./images/home.webp";
import promotionImage from "./images/Promotion.webp";
import esport from "./images/e-sport.webp"
import { esportfooter } from "../../components/jsondata/esport.js";
import { livecusinofooter } from "../jsondata/livecusiniofooter";
import { API_URL } from "@/utils/constants";

const FooterNav = () => {
  const navigate = useNavigate();
  const authSecretKey = sessionStorage.getItem("auth_secret_key")
  const userId = sessionStorage.getItem("account_id")
  
  const goToHome = () => {
    navigate("/");
  };

  async function handlecusinofooter(){
    console.log(livecusinofooter["Game UID"])
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
         "Content-Type": "application/json",
          route: "route-play-games",
          AuthToken: authSecretKey,
        },
        body: JSON.stringify({
          USER_ID: userId,
          GAME_NAME: livecusinofooter["Game Name"],
          GAME_UID: livecusinofooter["Game UID"],
        }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      if (data.error) {
        console.error("Error:", data.status_code || data.error);
      } else if (data.data?.game_url) {
        navigate(`/game-url/${encodeURIComponent(data.data.game_url)}/${encodeURIComponent(allsport["Game Name"])}`);
      } else {
        console.error("No game URL in the response.");
      }
    } catch (error) {
      console.error("Error logging game click:", error);
    }
  }
  const handleESportClick = async (index) => {
    console.log(esportfooter["Game UID"])   
      try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
         "Content-Type": "application/json",
          route: "route-play-games",
          AuthToken: authSecretKey,
        },
        body: JSON.stringify({
          USER_ID: userId,
          GAME_NAME: esportfooter["Game Name"],
          GAME_UID: esportfooter["Game UID"],
        }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      if (data.error) {
        console.error("Error:", data.status_code || data.error);
      } else if (data.data?.game_url) {
        navigate(`/game-url/${encodeURIComponent(data.data.game_url)}/${encodeURIComponent(allsport["Game Name"])}`);
      } else {
        console.error("No game URL in the response.");
      }
    } catch (error) {
      console.error("Error logging game click:", error);
    }
  };
  return (
    <div className="fixed rounded-t-2xl bottom-0 left-0 w-full bg-gray-700 shadow-lg flex justify-around items-center py-3 h-16 relative">
      <div className="flex flex-col items-center text-gray-600">
        <div className="bg-white p-3 rounded-full relative w-10 h-10">
          <img
            src={sportImage}
            alt="Sport"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <span className="text-xs font-semibold text-white">Sport</span>
      </div>
      
      <div className="flex flex-col items-center text-gray-800"
           onClick={handleESportClick}>
        <div className="bg-white p-3 rounded-full relative w-10 h-10">
          <img
            src={esport}
            alt="E-sport"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <span className="text-xs font-semibold text-white">E-Sport</span>
      </div>
      
      <div onClick={goToHome} className="flex flex-col items-center text-gray-800 mb-5">
        <div className="bg-white p-3 rounded-full relative w-14 h-15">
          <img
            src={homeImage}
            alt="Home"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <span className="text-xs font-semibold text-white">Home</span>
      </div>
      
      <div className="flex flex-col items-center text-gray-800"
           onClick={handlecusinofooter}>
        <div className="bg-white p-3 rounded-full relative w-10 h-10">
          <img
            src={cusinoImage}
            alt="Casino"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <span className="text-xs font-semibold text-white">Casino</span>
      </div>
      
      <div className="flex flex-col items-center text-gray-800"
           onClick={()=>navigate("/promotion")}
      >
        <div className="bg-white p-3 rounded-full relative w-10 h-10">
          <img
            src={promotionImage}
            alt="Promotion"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <span className="text-xs font-semibold text-white">Promotion</span>
      </div>
    </div>
  );
};

export default FooterNav;