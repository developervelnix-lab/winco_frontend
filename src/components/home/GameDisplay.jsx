"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { FaChevronLeft, FaChevronRight, FaEye, FaArrowLeft, FaPlay } from "react-icons/fa"
import { topslot } from "../jsondata/topslot"
import { slotgames } from "../jsondata/slotgames"
import { cusinolive } from "../jsondata/cusinolive"
import { fishgames } from "../jsondata/fishgame"
import { API_URL } from "@/utils/constants"
import { indianpokergames } from "../jsondata/indianpokergame"
import { useNavigate } from "react-router-dom"

const GameSection = ({ title, games }) => {
  const [showAll, setShowAll] = useState(false)
  const [preloadedImages, setPreloadedImages] = useState([])
  const [loadingForGames, setLoadingForGames] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [confirmPopup, setConfirmPopup] = useState({ show: false, game: null, error: null })
  const [hoveredGame, setHoveredGame] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const images = games.map((game) => game.icon)
    preloadImages(images)
  }, [games])

  const preloadImages = async (imageUrls) => {
    try {
      const promises = imageUrls.map(
        (imageUrl) =>
          new Promise((resolve, reject) => {
            const img = new Image()
            img.src = imageUrl
            img.onload = resolve
            img.onerror = reject
          }),
      )
      await Promise.all(promises)
      setPreloadedImages(imageUrls)
    } catch (error) {
      console.error("Error preloading images:", error)
    }
  }

  const handleGameClick = (game) => {
    setConfirmPopup({ show: true, game, error: null })
  }

  const confirmGameOpen = async () => {
    const authSecretKey = sessionStorage.getItem("auth_secret_key")
    const userId = sessionStorage.getItem("account_id")

    const game = confirmPopup.game
    setLoadingForGames(game["Game UID"])

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
          GAME_NAME: game["Game Name"],
          GAME_UID: game["Game UID"],
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()

      if (showPopup) {
        setShowPopup(false)
      }

      if (data.status_code === "balance_error") {
        // Show balance error in the confirmation popup
        setConfirmPopup({
          show: true,
          game: confirmPopup.game,
          error: "balance_error",
        })
      } else if (data.error) {
        console.error("Error:", data.status_code || data.error)
        setConfirmPopup({ show: false, game: null, error: null })
      } else if (data.data?.game_url) {
        navigate(`/game-url/${encodeURIComponent(data.data.game_url)}/${encodeURIComponent(game["Game Name"])}`)
      } else {
        console.error("No game URL in the response.")
        setConfirmPopup({ show: false, game: null, error: null })
      }
    } catch (error) {
      console.error("Error logging game click:", error)
    } finally {
      setLoadingForGames(null)
      setConfirmPopup({ show: false, game: null, error: null })
    }
  }

  return (
    <div className="game-section relative w-full px-3 py-3 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white text-sm font-serif">{title}</h2>
        <div className="flex items-center space-x-2">
          {!showAll && (
            <>
              <button
                className={`nav-button prev-${title.toLowerCase().replace(/\s+/g, "-")} bg-black bg-opacity-70 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-opacity-90 transition-all duration-300`}
              >
                <FaChevronLeft size={12} />
              </button>
              <button
                className={`nav-button next-${title.toLowerCase().replace(/\s+/g, "-")} bg-black bg-opacity-70 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-opacity-90 transition-all duration-300`}
              >
                <FaChevronRight size={12} />
              </button>
            </>
          )}

          <button
            onClick={() => setShowPopup(true)}
            className={`flex items-center gap-2 px-1.5 py-1.5 rounded-lg text-sm font-normal transition-all duration-300 ${
              showAll ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <FaEye size={12} />
            <span>See All</span>
          </button>
        </div>
      </div>

      {!showAll && (
        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={3.5}
          navigation={{
            prevEl: `.prev-${title.toLowerCase().replace(/\s+/g, "-")}`,
            nextEl: `.next-${title.toLowerCase().replace(/\s+/g, "-")}`,
          }}
          breakpoints={{
            320: { slidesPerView: 3, spaceBetween: 6 },
            480: { slidesPerView: 3, spaceBetween: 10 },
            768: { slidesPerView: 5, spaceBetween: 10 },
            1024: { slidesPerView: 6, spaceBetween: 10 },
            1280: { slidesPerView: 8, spaceBetween: 10 },
          }}
        >
          {games.slice(0, games.length - 1).map((game, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative group"
                onMouseEnter={() => setHoveredGame(game["Game UID"])}
                onMouseLeave={() => setHoveredGame(null)}
              >
                <img
                  className={`${
                    loadingForGames === game["Game UID"] ? "opacity-50" : ""
                  } rounded-lg cursor-pointer transition-all duration-300 group-hover:brightness-75`}
                  src={game.icon || "/placeholder.svg"}
                  alt={game["Game Name"]}
                  onClick={() => handleGameClick(game)}
                />
                {hoveredGame === game["Game UID"] && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black bg-opacity-60 rounded-full p-3">
                      <FaPlay className="text-white text-opacity-90" size={16} />
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 transition-all duration-300"
                  aria-label="Close"
                >
                  <FaArrowLeft size={16} />
                </button>
                <h2 className="text-md font-serif text-white">{title}</h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {games.map((game, index) => (
                <div key={index} className="w-[30%] md:w-[15.5%] lg:w-[11.5%] flex flex-col items-center">
                  <div className="w-full aspect-square relative">
                    <div
                      className="relative group w-full"
                      onMouseEnter={() => setHoveredGame(game["Game UID"])}
                      onMouseLeave={() => setHoveredGame(null)}
                    >
                      <img
                        className={`${
                          loadingForGames === game["Game UID"] ? "opacity-50" : ""
                        } rounded-lg cursor-pointer w-full transition-all duration-300 group-hover:brightness-75`}
                        src={game.icon || "/placeholder.svg"}
                        alt={game["Game Name"]}
                        onClick={() => handleGameClick(game)}
                      />
                      {hoveredGame === game["Game UID"] && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-black bg-opacity-60 rounded-full p-3">
                            <FaPlay className="text-white text-opacity-90" size={16} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="w-full mt-2 overflow-hidden">
                      <p className="text-sm font-medium text-center text-white truncate">{game["Game Name"]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {confirmPopup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[99999] transition-opacity duration-300">
          <div className="bg-white relative p-6 rounded-2xl shadow-2xl max-w-xs w-full mx-6 animate-fadeInUp">
            {/* Decorative Icon */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-full shadow-lg">
              {confirmPopup.error === "balance_error" ? (
                <FaPlay className="text-white" size={20} />
              ) : (
                <FaPlay className="text-white" size={20} />
              )}
            </div>

            {/* Confirmation Message or Error Message */}
            {confirmPopup.error === "balance_error" ? (
              <div className="text-center">
                <p className="text-red-600 font-medium text-center mt-6 mb-2 text-sm">Minimum deposit ₹100 required</p>
                <p className="text-gray-600 text-xs mb-4">Please add funds to your account to play this game.</p>
              </div>
            ) : (
              <p className="text-gray-800 text-center mt-6 mb-4 text-sm leading-relaxed">
                Ready to open <span className="font-semibold text-blue-600">{confirmPopup.game?.["Game Name"]}</span>?
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setConfirmPopup({ show: false, game: null, error: null })}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-xs shadow-md"
              >
                {confirmPopup.error === "balance_error" ? "Close" : "Cancel"}
              </button>

              {confirmPopup.error === "balance_error" ? (
                <button
                  onClick={() => {
                    // Navigate to deposit page or open deposit modal
                    setConfirmPopup({ show: false, game: null, error: null })
                    // You can add navigation to deposit page here
                    // navigate('/deposit');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all text-xs shadow-md"
                >
                  Add Funds
                </button>
              ) : (
                <button
                  onClick={confirmGameOpen}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all text-xs shadow-md"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const GamesDisplay = () => {
  return (
    <div className="games-display space-y-3">
      {" "}
      {/* space-y-3 for 3px margin */}
      <GameSection title="🚀 Top Slot" games={topslot} className="mb-0" />
      <GameSection title="🎮 Trending Slot" games={slotgames} />
      <GameSection title="🔴 Casino" games={cusinolive} />
      <GameSection title="🐟 Fishing" games={fishgames} />
      <GameSection title="♤ Indian Poker Games" games={indianpokergames} />
    </div>
  )
}

export default GamesDisplay

