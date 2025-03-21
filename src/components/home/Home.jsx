"use client"

import { useState, useEffect } from "react"
import FrontScrollableCard from "./FrontScrollableCard"
import Navbar from "../navbar/Navbar"
import TrendingSlot from "./TrendingSlot"
import GamesDisplay from "./GameDisplay"
import GameProvider from "./GameProvider"
import Faq from "./Faq"
import MobileFooterNav from "../navbar/MobileFooterNav"
import Live from "./Live"
import Turbogames from "./Turbogames"
import FeaturesSection from "./FeaturesSection"
import PromotionSection from "./PromotionSection"
import Footer from "./Footer"

function Home() {
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuth = () => {
    const authSecretKey = sessionStorage.getItem("auth_secret_key")
    const wasAuthenticated = isAuthenticated
    const isNowAuthenticated = !!authSecretKey

    setIsAuthenticated(isNowAuthenticated)

    if (isNowAuthenticated && !wasAuthenticated) {
      setShowSuccessToast(true)
      setShowToast(false)
      setTimeout(() => setShowSuccessToast(false), 5000)
    } else if (!isNowAuthenticated) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } else {
      setShowToast(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)

      const justLoggedIn = sessionStorage.getItem("just_logged_in") === "true"
      const authSecretKey = sessionStorage.getItem("auth_secret_key")
      const isLoggedIn = !!authSecretKey

      setIsAuthenticated(isLoggedIn)

      if (isLoggedIn) {
        if (justLoggedIn) {
          setShowSuccessToast(true)
          sessionStorage.removeItem("just_logged_in")
          setTimeout(() => setShowSuccessToast(false), 5000)
        }
      } else {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    }, 10)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "auth_secret_key") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [isAuthenticated])

  const handleContainerClick = (e) => {
    const isToast = e.target.closest(".toast-message")
    if (isToast) return
    checkAuth()
  }

  

  return (
    <div className="flex flex-col min-h-screen relative" onClick={handleContainerClick}>
      {showToast && !isAuthenticated && <ToastMessage onClose={() => setShowToast(false)} />}
      {showSuccessToast && <SuccessToastMessage onClose={() => setShowSuccessToast(false)} />}

      <Navbar />
      <main className="flex-grow pt-[116px] px-4 md:px-8">
        <div className="mb-3">
          <FrontScrollableCard />
        </div>
        <div className="mb-3">
          <TrendingSlot />
        </div>
        <div className="mb-3">
          <Live />
        </div>
        <div className="mb-2 ">
          <Turbogames />
        </div>
        <div className="mb-3">
          <GamesDisplay />
        </div>
        <div className="mb-3">
          <PromotionSection />
        </div>
        <div className="mb-6">
          <GameProvider />
        </div>
      </main>
      <div className="px-4 md:px-8 mb-5">
        <FeaturesSection />
      </div>
      <div className="px-4 md:px-8 mb-6">
        <Faq />
      </div>
      <Footer />
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileFooterNav />
      </footer>
    </div>
  )
}

function LogoLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-orange-500 z-50">
      <div className="flex flex-col items-center">
        <div className="text-center">
          <div className="text-4xl md:text-6xl font-extrabold text-black mb-4 animate-pulse tracking-wider">
            RANABOOK
          </div>
          <div className="text-md md:text-base font-semibold text-black ">PREMIER BETTING EXPERIENCE</div>
        </div>
      </div>
    </div>
  )
}

function ToastMessage({ onClose }) {
  return (
    <div className="toast-message fixed top-8 left-1/2 transform -translate-x-1/2 p-4 bg-red-600 text-white flex justify-between items-center animate-slide-in rounded-lg shadow-lg w-[90%] md:w-[400px] z-[1000]">
      <span className="flex-1 text-center">Please login to play. Minimum deposit ₹100 required.</span>
      <button onClick={onClose} className="ml-4 text-white font-bold">
        &times;
      </button>
    </div>
  )
}

function SuccessToastMessage({ onClose }) {
  return (
    <div className="toast-message fixed top-8 left-1/2 transform -translate-x-1/2 p-4 bg-lime-600 text-white flex justify-between items-center animate-slide-in rounded-lg shadow-lg w-[90%] md:w-[400px] z-[1000]">
      <span className="flex-1 text-center">Successfully logged in. Welcome to RANABOOK!</span>
      <button onClick={onClose} className="ml-4 text-white font-bold">
        &times;
      </button>
    </div>
  )
}

export default Home

