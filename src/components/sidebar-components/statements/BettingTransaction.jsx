import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import nodata from '../../navbar/images/nodata.jpeg'

const BettingTransactionPage = () => {
  const [startDate, setStartDate] = useState('05/03/2025');
  const [endDate, setEndDate] = useState('12/03/2025');
  const [activeFilter, setActiveFilter] = useState('Last 7 Days');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentStartMonth, setCurrentStartMonth] = useState(new Date(2025, 2, 5)); // March 5, 2025
  const [currentEndMonth, setCurrentEndMonth] = useState(new Date(2025, 2, 12)); // March 12, 2025

  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);

    // Set date range based on filter
    const today = new Date();
    let startDateObj = new Date();

    if (filter === 'Last 7 Days') {
      startDateObj.setDate(today.getDate() - 7);
    } else if (filter === 'Last 14 Days') {
      startDateObj.setDate(today.getDate() - 14);
    } else if (filter === 'Last 28 Days') {
      startDateObj.setDate(today.getDate() - 28);
    }

    setStartDate(formatDate(startDateObj));
    setEndDate(formatDate(today));
    setCurrentStartMonth(new Date(startDateObj));
    setCurrentEndMonth(new Date(today));
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const handleStartDateSelect = (day) => {
    const newDate = new Date(currentStartMonth);
    newDate.setDate(day);
    setStartDate(formatDate(newDate));
    setShowStartDatePicker(false);

    // Ensure end date is not before start date
    const endDateObj = parseDate(endDate);
    if (newDate > endDateObj) {
      setEndDate(formatDate(newDate));
      setCurrentEndMonth(new Date(newDate));
    }
  };

  const handleEndDateSelect = (day) => {
    const newDate = new Date(currentEndMonth);
    newDate.setDate(day);
    setEndDate(formatDate(newDate));
    setShowEndDatePicker(false);

    // Ensure start date is not after end date
    const startDateObj = parseDate(startDate);
    if (newDate < startDateObj) {
      setStartDate(formatDate(newDate));
      setCurrentStartMonth(new Date(newDate));
    }
  };

  const changeMonth = (dateType, increment) => {
    if (dateType === 'start') {
      const newMonth = new Date(currentStartMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      setCurrentStartMonth(newMonth);
    } else {
      const newMonth = new Date(currentEndMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      setCurrentEndMonth(newMonth);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Close date pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) {
        setShowStartDatePicker(false);
      }
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) {
        setShowEndDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderDatePicker = (dateType, currentMonth, daysInMonth, handleDateSelect) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 absolute mt-2 z-20 w-[300px] sm:w-[350px]">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(dateType, -1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <div className="font-semibold text-lg">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button onClick={() => changeMonth(dateType, 1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}

          {daysInMonth.map((day, index) => (
            <div
              key={index}
              className={`text-center py-2 text-sm ${
                day ? 'cursor-pointer hover:bg-gray-100 rounded-full' : ''
              } ${
                day && ((dateType === 'start' && formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) === startDate) ||
                (dateType === 'end' && formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) === endDate))
                ? 'bg-red-700 text-white hover:bg-red-600 rounded-full' : ''
              }`}
              onClick={() => day && handleDateSelect(day)}
            >
              {day || ''}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Date range and search section */}
      <div className="flex flex-row md:flex-row gap-2 mb-3">
        <div className="flex-1 relative">
          <div className="flex items-center">
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-l-lg p-3 w-full"
            />
            <button
              className="bg-white p-3 border border-l-0 border-gray-300 rounded-r-lg"
              onClick={() => {
                setShowStartDatePicker(!showStartDatePicker);
                setShowEndDatePicker(false);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   className="text-red-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
          {showStartDatePicker && (
            <div ref={startDatePickerRef} className="z-30">
              {renderDatePicker('start', currentStartMonth, getDaysInMonth(currentStartMonth), handleStartDateSelect)}
            </div>
          )}
        </div>

        <div className="flex-1 relative">
          <div className="flex items-center">
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-l-lg p-3 w-full"
            />
            <button
              className="bg-white p-3 border border-l-0 border-gray-300 rounded-r-lg"
              onClick={() => {
                setShowEndDatePicker(!showEndDatePicker);
                setShowStartDatePicker(false);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   className="text-red-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
          {showEndDatePicker && (
            <div ref={endDatePickerRef} className="z-30">
              {renderDatePicker('end', currentEndMonth, getDaysInMonth(currentEndMonth), handleEndDateSelect)}
            </div>
          )}
        </div>

        <button className="bg-red-700 text-white p-3 rounded-lg flex items-center justify-center">
          <Search size={20} />
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-1 mb-8">
        <button
          onClick={() => handleFilterClick('Last 7 Days')}
          className={`px-1.5 py-2 border border-gray-500 rounded-lg ${
            activeFilter === 'Last 7 Days'
              ? 'bg-red-700 text-white'
              : 'bg-white text-black'
          }`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => handleFilterClick('Last 14 Days')}
          className={`px-1.5 py-2 border border-gray-500 rounded-lg ${
            activeFilter === 'Last 14 Days'
              ? 'bg-red-700 text-white'
              : 'bg-white text-black'
          }`}
        >
          Last 14 Days
        </button>
        <button
          onClick={() => handleFilterClick('Last 28 Days')}
          className={`px-1.5 py-2 border border-gray-500  rounded-lg ${
            activeFilter === 'Last 28 Days'
              ? 'bg-red-700 text-white'
              : 'bg-white text-black'
          }`}
        >
          Last 28 Days
        </button>
      </div>

      {/* No data message */}
      <div className="flex flex-col items-center justify-center pt-32 pb-32">
        <div className="relative">
          <div className="relative z-10 p-4">
            <div className="bg-white rounded-lg p-8 relative">
              <img src={nodata} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingTransactionPage;