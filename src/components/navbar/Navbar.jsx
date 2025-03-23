"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"
import Login from "../auth/Login"
import Register from "../auth/Register"
import { useNavigate } from "react-router-dom"
import AccountInfo from "./AccountInfo"
import { allsport } from "../jsondata/sport"
import { FaSignInAlt, FaUserPlus, FaMoneyCheckAlt, FaWallet } from "react-icons/fa"
import { API_URL } from "@/utils/constants"

function Navbar() {
  const authSecretKey = sessionStorage.getItem("auth_secret_key")
  const userId = sessionStorage.getItem("account_id")
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const navigate = useNavigate()
  const [accountInfo, setAccountInfo] = useState(null)
  const [toast, setToast] = useState(null)

  // Add effect to prevent body scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [menuOpen])

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000) // Automatically dismiss toast after 3 seconds
  }

  // Game Categories with specific gradient classes
  const games = [
    { name: "Cricket", gradientClass: "game-btn-cricket" },
    { name: "Football", gradientClass: "game-btn-football" },
    { name: "Live", gradientClass: "game-btn-live" },
    { name: "Avatar", gradientClass: "game-btn-avatar" },
    { name: "Tennis", gradientClass: "game-btn-tennis" },
    { name: "Basketball", gradientClass: "game-btn-basketball" },
    { name: "Hockey", gradientClass: "game-btn-hockey" },
    { name: "Rugby", gradientClass: "game-btn-rugby" },
    { name: "Esports", gradientClass: "game-btn-esports" },
    { name: "MMA", gradientClass: "game-btn-mma" },
    { name: "Boxing", gradientClass: "game-btn-boxing" },
    { name: "Volleyball", gradientClass: "game-btn-volleyball" },
  ]
  const handleGameSelect = async (index) => {
    setSelectedGame(index);
    console.log(allsport['Game UID'])    
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
        GAME_NAME: allsport["Game Name"],
        GAME_UID: allsport["Game UID"],
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
  const handleLoginClick = () => {
    setShowLogin(true)
    setMenuOpen(false) // Close the sidebar if open
  }

  const handleRegisterClick = () => {
    setShowRegister(true)
    setMenuOpen(false) // Close the sidebar if open
  }

  const closeLoginModal = () => {
    setShowRegister(false)
    setShowLogin(false)
  }

  const closeRegisterModal = () => {
    setShowLogin(false)
    setShowRegister(false)
  }

  function handleTransactionClick() {
    navigate("/transaction")
  }
  function handleBettingTransaction() {
    navigate("/betting-profit-loss")
  }

  function handleChangePassword() {
    navigate("/change-password")
  }

  function handleOpenBetClick() {
    navigate("/openbet")
  }
  function handleRulesRegulation() {
    navigate("/rules-regulation")
  }
  function handleExclusionPolicy() {
    navigate("/exclusion")
  }
  function handleResponsibleGambling() {
    navigate("/responsible-gambling")
  }
  function handlePrivacyPolicy() {
    navigate("/privacy-policy")
  }
  function handleLogoClick() {
    navigate("/")
  }
  function handlePromotion() {
    navigate("/promotion")
  }
  function onTelegramClick() {
    navigate("https://www.telegram.com/")
  }

  const fetchAccountInfo = async () => {
    const userId = sessionStorage.getItem("account_id")
    try {
      const response = await fetch(API_URL +"?USER_ID=" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Route: "route-account-info",
          AuthToken: authSecretKey,
        },
      })

      const result = await response.json()
      setAccountInfo(result.data[0])
      sessionStorage.setItem("avl_balance", result.data[0].account_balance)
      sessionStorage.setItem("deposit_options", result.data[0].service_recharge_option)
      console.log("Account Info:", result)

      // Handle account info response here
    } catch (error) {
      console.error("Error fetching account info", error)
    }
  }

  useEffect(() => {
    fetchAccountInfo()
  }, [authSecretKey])

  function handleSignOut() {
    setMenuOpen(false)
    sessionStorage.clear()
    navigate("/")
  }

  function handleInviteAndEarn() {
    navigate("/inviteandearn")
  }

  function handleChatWithUs() {
    navigate("/")
  }

  // social links
  const handleExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[#121212] shadow-lg z-50">
        <div className="flex h-13 items-center justify-between w-full p-2">
          {/* Logo */}
          <div className="flex items-center" onClick={handleLogoClick}>
            <span className="self-center text-xl font-bold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
            Kolor Bet
            </span>
          </div>

          {/* Desktop Menu */}

          <div className="flex item-center space-x-3">
            {!authSecretKey && (
              <>
                <button
                  className="flex items-center text-red-600 bg-white px-2 py-1 rounded-lg text-xs font-semibold shadow-md hover:from-gray-900 hover:to-yellow-600 transition transform hover:scale-105"
                  onClick={handleLoginClick}
                >
                  <FaSignInAlt className="mr-2" /> Login
                </button>
                <button
                  className="flex items-center text-red-600 bg-white px-2 py-1 rounded-lg text-xs font-semibold shadow-md hover:from-red-700 hover:to-gray-900 transition transform hover:scale-105"
                  onClick={handleRegisterClick}
                >
                  <FaUserPlus className="mr-2" /> Register
                </button>
              </>
            )}
            {authSecretKey && (
              <>
                <button
                  className="hidden md:flex items-center text-red-600 bg-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:from-gray-900 hover:to-yellow-600 transition transform hover:scale-105"
                  onClick={() => navigate("/withdraw")}
                >
                  <FaMoneyCheckAlt className="mr-2" /> Withdraw
                </button>
                <button
                  className="hidden md:flex items-center text-red-600 bg-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:from-red-700 hover:to-gray-900 transition transform hover:scale-105"
                  onClick={() => navigate("/deposit")}
                >
                  <FaWallet className="mr-2" /> Deposit
                </button>
              </>
            )}

            {/* Mobile & Desktop MENU */}
            {authSecretKey && (
              <button className="text-white " onClick={() => setMenuOpen(true)}>
                <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Scrollable Games Section - No Shrinking */}
        <div className="w-full overflow-x-auto scrollbar-hide bg-white py-3">
          <div className="flex gap-2 justify-center  pb-1" style={{ minWidth: "max-content" }}>
            {games.map((game, index) => (
              <button
                key={index}
                className={`gradient-btn ${game.gradientClass} ${
                  selectedGame === index ? "selected" : ""
                } text-white px-5 py-1.5 rounded-lg text-sm font-semibold shadow-md transition flex-shrink-0 min-w-fit`}
                onClick={() => handleGameSelect(index)}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer div to push content below the fixed navbar */}
      <div className="navbar-height"></div>

      {/* Background Overlay with Blur Effect */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`overflow-y-auto fixed top-0 right-0 h-full w-3/4 md:w-1/2 lg:w-1/4 bg-white shadow-lg transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 text-black`}
      >
        {" "}
        {/* Close Button */}
        <div className="flex justify-end p-0 pl-2 pt-1">
          <button onClick={() => setMenuOpen(false)} className="text-black hover:bg-red-400 transition">
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
          </button>
        </div>
        {/* Sidebar Menu */}
        <div className="flex flex-col mt-0 items-center">
          <div className="w-[94%]">{accountInfo && <AccountInfo accountInfo={accountInfo} />}</div>
          <div className="space-y-4 w-[94%] mt-3">
            <div className="border rounded-md shadow-sm">
              <h2 className="text-lg font-semibold p-4 border-b">Helps & Supports</h2>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handleChatWithUs}
              >
                <div className="text-red-600 mr-3">💬</div>
                <span className="font-medium">Chat With Us</span>
              </div>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={() => navigate("/")}
              >
                <div className="text-red-600 mr-3">📥</div>
                <span className="font-medium">Download APK</span>
              </div>
            </div>

            <div className="border rounded-md shadow-sm">
              <h2 className="text-lg font-semibold p-4 border-b">Statements</h2>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handleTransactionClick}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"></path>
                    <path d="m8 10 4 4 4-4"></path>
                    <path d="M12 14V6"></path>
                  </svg>
                </div>
                <span className="font-medium">Transactions</span>
              </div>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handleBettingTransaction}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 16v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"></path>
                    <path d="M12.5 15.8 22 6.2 17.8 2l-9.5 9.5L6 18l6.5-2.2Z"></path>
                  </svg>
                </div>
                <span className="font-medium">Betting Profit & Loss</span>
              </div>
            </div>

            {/* Legal & Compliance Section */}
            <div className="border rounded-md shadow-sm">
              <h2 className="text-lg font-semibold p-4 border-b">Legal & Compliance</h2>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handleRulesRegulation}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <path d="M14 2v6h6"></path>
                    <path d="M12 18v-6"></path>
                    <path d="M8 15h8"></path>
                  </svg>
                </div>
                <span className="font-medium">Rules & Regulations</span>
              </div>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handleExclusionPolicy}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path>
                    <path d="M9 3h6l3 7h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-5"></path>
                    <path d="m13 3-3 7"></path>
                    <path d="M9 17v4"></path>
                    <path d="M17 17v4"></path>
                    <circle cx="13" cy="13" r="3"></circle>
                  </svg>
                </div>
                <span className="font-medium">Exclusion Policy</span>
              </div>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handleResponsibleGambling}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <span className="font-medium">Responsible Gambling</span>
              </div>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handlePrivacyPolicy}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 3a3 3 0 0 0-3 3c0 1 .5 2 2 3a5 5 0 0 1 3 4c02-2 3-3 3"></path>
                    <path d="M14 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                    <path d="M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                    <path d="M10 21c0-1.1.9-2 2-2v2"></path>
                    <path d="m7 3 2 2"></path>
                    <path d="M17 21c0-1.1-.9-2-2-2v2"></path>
                  </svg>
                </div>
                <span className="font-medium">Privacy Policy</span>
              </div>
            </div>

            <div className="border rounded-md shadow-sm">
              <h2 className="text-lg font-semibold p-4 border-b">Miscellaneous</h2>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={() => navigate("/gifrcardreedom")}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"></path>
                    <path d="m8 10 4 4 4-4"></path>
                    <path d="M12 14V6"></path>
                  </svg>
                </div>
                <span className="font-medium">Gift Card</span>
              </div>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handlePromotion}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 16v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"></path>
                    <path d="M12.5 15.8 22 6.2 17.8 2l-9.5 9.5L6 18l6.5-2.2Z"></path>
                  </svg>
                </div>
                <span className="font-medium">Promotion</span>
              </div>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handleInviteAndEarn}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 16v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"></path>
                    <path d="M12.5 15.8 22 6.2 17.8 2l-9.5 9.5L6 18l6.5-2.2Z"></path>
                  </svg>
                </div>
                <span className="font-medium">Refer And Earn</span>
              </div>
            </div>

            {/* Account Actions Section */}
            <div className="border rounded-md shadow-sm">
              <h2 className="text-lg font-semibold p-4 border-b">Account Actions</h2>
              <div
                className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0"
                onClick={handleChangePassword}
              >
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="16" x="3" y="4" rx="2"></rect>
                    <path d="M7 12a5 5 0 0 1 5-5c2.76 0 5 2.24 5 5a5 5 0 0 1-5 5 5 5 0 0 1-5-5Z"></path>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                </div>
                <span className="font-medium">Change Password</span>
              </div>
              {/* <div className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0">
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 3a3 3 0 0 0-3 3c0 1 .5 2 2 3a5 5 0 0 1 3 4c0 2-2 3-3 3"></path>
                    <path d="M14 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                    <path d="M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                    <path d="M10 21c0-1.1.9-2 2-2v2"></path>
                    <path d="m7 3 2 2"></path>
                    <path d="M17 21c0-1.1-.9-2-2-2v2"></path>
                  </svg>
                </div>
                <span className="font-medium">Login Activity</span>
              </div> */}
              <div className="py-3 px-4 flex items-center hover:bg-gray-100 transition-colors cursor-pointer border-b last:border-b-0">
                <div className="text-red-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2"></path>
                    <path d="M7 12h14l-3-3m0 6 3-3"></path>
                  </svg>
                </div>
                <span className="font-medium" onClick={handleSignOut}>
                  Sign Out
                </span>
              </div>
            </div>
          </div>
          {/* Sport Categories Divider */}
          <div className="w-5/6 border-b border-gray-600 my-4 mx-auto"></div>
          {/* Sports & Games Section */}

          <div className="w-full px-4">
            {/* Social Media Links */}
            <h3 className="text-black text-md uppercase font-bold mb-2 pl-2">Connect With Us</h3>
            <ul className="space-y-2">
              <li onClick={() => handleExternalLink("https://wa.me/YOUR_WHATSAPP_NUMBER")}>
                {" "}
                {/* Replace YOUR_WHATSAPP_NUMBER */}
                <a className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  WhatsApp Now
                </a>
              </li>
              <li onClick={() => handleExternalLink("https://t.me/YOUR_TELEGRAM_LINK")}>
                {" "}
                {/* Replace YOUR_TELEGRAM_LINK */}
                <a className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Follow on Telegram
                </a>
              </li>
              <li onClick={() => handleExternalLink("https://www.instagram.com/YOUR_INSTAGRAM_USERNAME")}>
                {" "}
                {/* Replace YOUR_INSTAGRAM_USERNAME  {/* Replace YOUR_INSTAGRAM_USERNAME */}
                <a className="flex items-center text-black hover:bg-gray-200 p-2 rounded-md transition cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Follow on Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <Login
            onClose={closeLoginModal}
            onSwitchToRegister={() => {
              setShowLogin(false)
              setShowRegister(true)
            }}
          />
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <Register
            onClose={closeRegisterModal}
            onSwitchToLogin={() => {
              setShowRegister(false)
              setShowLogin(true)
            }}
          />
        </div>
      )}
    </>
  )
}

export default Navbar

