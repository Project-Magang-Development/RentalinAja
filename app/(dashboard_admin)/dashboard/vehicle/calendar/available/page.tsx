"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import CalendarSkeleton from "@/app/components/calendarSkeleton";
import Title from "antd/es/typography/Title";
import moment from "moment";
import Cookies from "js-cookie";

interface Vehicle {
  vehicles_id: string;
  name: string;
  model: string;
  no_plat: string;
}

interface Schedule {
  schedules_id: string;
  start_date: string;
  end_date: string;
  price: number;
  Vehicle: Vehicle;
}

const fetcher = async (url: string) => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }
  return response.json();
};

function CalendarAvailable() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const {
    data: schedules,
    error,
    isValidating,
  } = useSWR(
    startDate && endDate
      ? `/api/schedule/showAvailable?startDate=${startDate}&endDate=${endDate}`
      : null,
    fetcher
  );

  const colors = [
    "rgb(229, 115, 115)",
    "rgb(255, 182, 77)",
    "rgb(78, 182, 171)",
  ];

  const addOneDay = (date: any) => {
    return moment(date).add(1, "days").toDate();
  };

  if (error) {
    return <div>Error loading schedules: {error.message}</div>;
  }

  if (!schedules || isValidating) {
    return <CalendarSkeleton />;
  }

  const events = schedules.map((schedule: Schedule, index: number) => ({
    title: `${schedule.Vehicle.name} (${schedule.Vehicle.no_plat})`,
    start: schedule.start_date,
    end: addOneDay(schedule.end_date),
    backgroundColor: colors[index % colors.length],
    borderColor: colors[index % colors.length],
    allDay: true,
    extendedProps: {
      vehicles_id: schedule.Vehicle.vehicles_id,
      price: schedule.price,
    },
  }));

  return (
    <div>
      <Title level={3}>Jadwal Kendaraan Yang Tersedia</Title>
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
