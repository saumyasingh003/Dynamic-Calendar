import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver"; // For exporting files

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
    category: "Work", // Default category
  });
  const [filterKeyword, setFilterKeyword] = useState("");
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
    setEventForm({ name: "", startTime: "", endTime: "", description: "", category: "Work" });
  };

  const closeModal = () => {
    setShowModal(false);
    setEventForm({ name: "", startTime: "", endTime: "", description: "", category: "Work" });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const checkOverlap = (dayEvents, newEvent) => {
    return dayEvents.some(event => {
      return (
        (newEvent.startTime < event.endTime && newEvent.endTime > event.startTime)
      );
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newEvent = { ...eventForm };

    if (isEditing) {
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        updatedEvents[selectedDay][editingIndex] = newEvent;
        return updatedEvents;
      });
    } else {
      setEvents((prevEvents) => {
        const dayEvents = prevEvents[selectedDay] || [];
        if (checkOverlap(dayEvents, newEvent)) {
          alert("This event overlaps with an existing event.");
          return prevEvents;
        }
        return {
          ...prevEvents,
          [selectedDay]: [...dayEvents, newEvent],
        };
      });
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

  const exportEvents = (format) => {
    const eventsForMonth = Object.entries(events).filter(([day]) => {
      const eventDate = new Date(year, month, day);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

    const data = eventsForMonth.map(([day, events]) => ({ day, events }));

    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, `events-${year}-${month + 1}.json`);
    } else if (format === "csv") {
      const csvRows = ["Day , Month , Year ,Event Name,Start Time,End Time,Description,Category"];
      data.forEach(({ day, events }) => {
        events.forEach((event) => {
          csvRows.push(
            `${day} , ${month}, ${year},${event.name},${event.startTime},${event.endTime},${event.description},${event.category}`
          );
        });
      });
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      saveAs(blob, `events-${year}-${month + 1}.csv`);
    }
  };
  const filteredEvents = Object.entries(events).reduce((acc, [day, dayEvents]) => {
    const filtered = dayEvents.filter(event =>
      event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      event.month === month ||  // Add month filter
      event.year === year       // Add year filter
    );
    if (filtered.length > 0) {
      acc[day] = filtered;
    }
    return acc;
  }, {});
  

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

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter events by keyword"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => exportEvents("json")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export JSON
        </button>
        <button
          onClick={() => exportEvents("csv")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
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
              {isEditing ? "Edit Event" : "Add Event"} for {selectedDay} {currentDate.toLocaleString("default", { month: "long" })}
            </h3>
            <ul className="mb-4">
              {(events[selectedDay] || []).map((event, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center border-b py-2 ${
                    event.category === "Work" ? "bg-blue-100" :
                    event.category === "Personal" ? "bg-green-100" :
                                        event.category === "Other" ? "bg-yellow-100" : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold">{event.name}</p>
                    <p className="text-sm">
                      {event.startTime} - {event.endTime}
                    </p>
                    <p className="text-xs text-gray-500">{event.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editEvent(index)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(index)}
                      className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-2">
                <label className="block text-sm font-medium">Event Name</label>
                <input
                  type="text"
                  value={eventForm.name}
                  onChange={(e) =>
                    setEventForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-2 flex gap-2">
                <div>
                  <label className="block text-sm font-medium">Start Time</label>
                  <input
                    type="time"
                    value={eventForm.startTime}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Time</label>
                  <input
                    type="time"
                    value={eventForm.endTime}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={eventForm.category}
                  onChange={(e) =>
                    setEventForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isEditing ? "Save Changes" : "Add Event"}
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


