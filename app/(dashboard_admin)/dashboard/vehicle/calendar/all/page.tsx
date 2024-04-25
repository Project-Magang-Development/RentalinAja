"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import CalendarSkeleton from "@/app/components/calendarSkeleton";
import Title from "antd/es/typography/Title";

interface Vehicle {
  vehicles_id: number;
  name: string;
  model: string;
  no_plat: string;
}

interface Schedule {
  schedules_id: number;
  vehicles_id: number;
  start_date: string;
  end_date: string;
  price: number;
  Vehicle: Vehicle;
}

function CalendarAvailable() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchScheduleAvailable();
  }, []);

  const fetchScheduleAvailable = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
       '/api/schedule/showAll',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }

      const data = await response.json();
      setSchedules(data);
      setError("");
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to load the schedules.");
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    "rgb(229, 115, 115)",
    "rgb(255, 182, 77)",
    "rgb(78, 182, 171)",
  ];

  const events = schedules.map((schedule, index) => ({
    title: `${schedule.Vehicle.name} (${schedule.Vehicle.no_plat})`,
    start: schedule.start_date,
    end: schedule.end_date,
    backgroundColor: colors[index % colors.length],
    borderColor: colors[index % colors.length],
    allDay: true,
    extendedProps: {
      vehicles_id: schedule.Vehicle.vehicles_id,
      price: schedule.price,
    },
  }));

  if (loading) {
    return <CalendarSkeleton />;
  }

  return (
    <div>
      <Title level={3}>Jadwal Seluruh Kendaraan</Title>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="id"
        events={events}
      />
    </div>
  );
}

export default CalendarAvailable;
