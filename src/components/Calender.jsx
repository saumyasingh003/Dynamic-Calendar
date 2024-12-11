import React, { useState , useEffect} from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || {};
    setEvents(savedEvents);
  }, []);
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const generateDays = () => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 bg-transparent"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === new Date().getDate() &&
        year === new Date().getFullYear() &&
        month === new Date().getMonth();
      days.push(
        <div
          key={`day-${i}`}
          className={`h-12 flex flex-col items-center justify-center rounded-md text-sm font-medium cursor-pointer ${
            isToday
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-blue-100"
          }`}
          onClick={() => handleDayClick(i)}
        >
          {i}
          {events[i]?.length > 0 && (
            <span className="text-xs mt-1 text-red-500">
              {events[i].length} event(s)
            </span>
          )}
        </div>
      );
    }
    return days;
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowModal(true);
    setIsEditing(false);
    setEventForm({ name: "", startTime: "", endTime: "", description: "" });
  };

  const closeModal = () => {
    setShowModal(false);
    setEventForm({ name: "", startTime: "", endTime: "", description: "" });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
   
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        updatedEvents[selectedDay][editingIndex] = { ...eventForm };
        return updatedEvents;
      });
    } else {
      
      const newEvent = { ...eventForm };
      setEvents((prevEvents) => ({
        ...prevEvents,
        [selectedDay]: [...(prevEvents[selectedDay] || []), newEvent],
      }));
    }
    closeModal();
  };

  const deleteEvent = (index) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[selectedDay].splice(index, 1);
      if (updatedEvents[selectedDay].length === 0) {
        delete updatedEvents[selectedDay];
      }
      return updatedEvents;
    });
  };

  const editEvent = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    const eventToEdit = events[selectedDay][index];
    setEventForm({ ...eventToEdit });
    setShowModal(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Previous
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {generateDays()}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">
              {isEditing ? "Edit Event" : "Add Event"} for {selectedDay}{" "}
              {currentDate.toLocaleString("default", { month: "long" })}
            </h3>

            <ul className="mb-4">
              {(events[selectedDay] || []).map((event, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-gray-600">
                      {event.startTime} - {event.endTime}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editEvent(index)}
                      className="text-sm text-green-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(index)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Event Name"
                value={eventForm.name}
                onChange={(e) =>
                  setEventForm({ ...eventForm, name: e.target.value })
                }
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <div className="flex gap-2 mb-2">
                <input
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, startTime: e.target.value })
                  }
                  className="w-1/2 p-2 border rounded"
                  required
                />
                <input
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, endTime: e.target.value })
                  }
                  className="w-1/2 p-2 border rounded"
                  required
                />
              </div>
              <textarea
                placeholder="Description (optional)"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    description: e.target.value,
                  })
                }
                className="w-full mb-2 p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
