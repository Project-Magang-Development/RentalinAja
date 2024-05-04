"use client";

import React, {useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { useParams } from "next/navigation";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Space,
  message,
  notification,
  Popconfirm,
  Tooltip,
} from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";
import { DeleteOutlined } from "@ant-design/icons";
import CalendarSkeleton from "@/app/components/calendarSkeleton";
import useSWR from "swr";
import Cookies from "js-cookie";

interface Vehicle {
  vehicles_id: string;
  name: string;
  model: string;
  no_plat: string;
}

interface Schedule {
  schedules_id?: string;
  start_date?: any;
  end_date?: any;
  price?: number;
  Vehicle?: Vehicle;
}

interface Holiday {
  holiday_name: string;
  holiday_date: Date;
}

type PayloadType = {
  start_date: Date | undefined;
  end_date: Date | undefined;
  vehicles_id: string;
  price: any;
  schedules_id?: string;
};

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

function Calendar() {
  const query = useParams();
  const vehicles_id = query.vehicles_id;
  const {
    data: schedules,
    mutate,
  } = useSWR(`/api/schedule/show/${vehicles_id}`, fetcher);

  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const [vehicleDetails, setVehicleDetails] = useState<Vehicle | null>(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

   useEffect(() => {
     if (schedules && schedules.length > 0) {
       setVehicleDetails(schedules[0].Vehicle);
     }
   }, [schedules]);

  const showSuccessNotification = (isUpdate: any) => {
    notification.success({
      message: `Jadwal ${isUpdate ? "Diperbarui" : "Dibuat"}`,
      description: `Jadwal kendaraan ${
        isUpdate ? "telah berhasil diperbarui." : "telah berhasil dibuat."
      }`,
    });
  };
  const showFailureNotification = () => {
    notification.error({
      message: "Gagal Membuat Jadwal",
      description: "Jadwal kendaraan ini sudah ada.",
    });
  };

  const handleOk = async () => {
    const token = Cookies.get("token");
    if (!token) {
      message.error("Authentication token not found.");
      return;
    }

    try {
      await form.validateFields();
      const formData = form.getFieldsValue();

      const payload: PayloadType = {
        start_date: formData.start_date
          ? formData.start_date.format("YYYY-MM-DD")
          : undefined,
        end_date: formData.end_date
          ? formData.end_date.format("YYYY-MM-DD")
          : undefined,
        vehicles_id: Array.isArray(vehicles_id)
          ? vehicles_id.join(",")
          : vehicles_id,
        price: formData.price,
        schedules_id: selectedEvent?.schedules_id,
      };

      const endpoint = payload.schedules_id
        ? `/api/schedule/update/${payload.schedules_id}`
        : `/api/schedule/create`;
      const method = payload.schedules_id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process request");
      }

      showSuccessNotification(!!payload.schedules_id);
      setIsModalVisible(false);
      mutate();
    } catch (error) {
      showFailureNotification();
      setIsModalVisible(false);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (selectedEvent && isModalVisible) {
      form.setFieldsValue({
        start_date: selectedEvent.start_date,
        end_date: selectedEvent.end_date || null,
        price: selectedEvent.price || 0,
      });
    }
  }, [selectedEvent, isModalVisible, form]);

  const handleDateClick = (clickInfo: any) => {
    const newSelectedEvent = {
      start_date: moment(clickInfo.dateStr),
      end_date: undefined,
      price: 0,
    };

    setSelectedEvent(newSelectedEvent);
    setIsModalVisible(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const { event } = clickInfo;
    const endDate = event.end ? moment(event.end) : undefined;

    if (endDate && endDate.isSame(endDate.clone().startOf("day"))) {
      endDate.subtract(1, "days");
    }

    setSelectedEvent({
      ...event.extendedProps,
      start_date: moment(event.start),
      end_date: endDate,
    });
    setIsModalVisible(true);
  };

  const handleDeleteEvent = async (schedules_id: number) => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await fetch(`/api/schedule/delete/${schedules_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete schedule");
      }

      mutate(
        schedules.filter((schedule: any) => schedule.schedules_id !== schedules_id),
        false
      );
      notification.success({
        message: "Berhasil",
        description: "Berhasil Menghapus Jadwal.",
      });
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      notification.error({
        message: "Gagal",
        description: "Gagal Menghapus Jadwal.",
      });
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    "rgb(229, 115, 115)",
    "rgb(255, 182, 77)",
    "rgb(78, 182, 171)",
  ];

  const addOneDay = (date: any) => {
    return moment(date).add(1, "days").toDate();
  };

  const eventContent = (eventInfo: any) => {
    const priceFormatted = eventInfo.event.extendedProps.price
      ? `<b>${new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(eventInfo.event.extendedProps.price)}</b>`
      : "<b>Price not available</b>";

    return (
      <Tooltip title="Edit">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              {eventInfo.timeText}
            </span>
            <br />
            <span
              style={{ fontSize: "14px", fontWeight: "bold" }}
              dangerouslySetInnerHTML={{ __html: priceFormatted }}
            />
          </div>
          <Tooltip title="Hapus">
            <Popconfirm
              title="Apakah Anda yakin ingin menghapus jadwal ini?"
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDeleteEvent(eventInfo.event.extendedProps.schedules_id);
              }}
              onCancel={(e) => e?.stopPropagation()}
              okText="Ya"
              cancelText="Tidak"
              placement="topRight"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                style={{ color: "red", marginLeft: 8 }}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      </Tooltip>
    );
  };

  const checkOverlap = (holidayDate: any, schedules: any) => {
    const holiday = new Date(holidayDate).getTime();
    return schedules.some((schedule: any) => {
      const start = new Date(schedule.start_date).getTime();
      const end = new Date(schedule.end_date).getTime();
      return holiday >= start && holiday <= end;
    });
  };

  const calendarEvents = () => {
    const events = schedules?.map((schedule: any, index: any) => ({
      title: `Price: ${
        schedule.price
          ? new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(schedule.price)
          : "Price not available"
      }`,
      start: schedule.start_date,
      end: addOneDay(schedule.end_date),
      allDay: true,
      extendedProps: schedule,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length],
    }));

    const nonOverlappingHolidays = holidays.filter(
      (holiday) => !checkOverlap(holiday.holiday_date, schedules)
    );
    nonOverlappingHolidays.forEach((holiday) => {
      events?.push({
        title: `Holiday: ${holiday.holiday_name}`,
        start: holiday.holiday_date,
        end: holiday.holiday_date,
        allDay: true,
        backgroundColor: "red",
        borderColor: "darkred",
        extendedProps: {},
      });
    });

    return events;
  };

  if (!schedules) return <CalendarSkeleton />;

  if (loading) {
    return <CalendarSkeleton />;
  }

  return (
    <div>
      {vehicleDetails && (
        <Title level={2}>
          {vehicleDetails.name} - {vehicleDetails.model} -{" "}
          {vehicleDetails.no_plat}
        </Title>
      )}
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={allLocales}
          locale="id"
          events={calendarEvents()}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={eventContent}
        />
      </div>
      {isModalVisible && (
        <Modal
          title={selectedEvent?.schedules_id ? "Edit Jadwal" : "Tambah Jadwal"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleOk}
            initialValues={{
              start_date: selectedEvent
                ? moment(selectedEvent.start_date)
                : null,
              end_date:
                selectedEvent && selectedEvent.end_date
                  ? moment(selectedEvent.end_date)
                  : null,
              price: selectedEvent ? selectedEvent.price : null,
            }}
          >
            <Form.Item
              name="start_date"
              label="Tanggal Mulai"
              rules={[{ required: true }]}
            >
              <DatePicker format="DD MMMM YYYY" />
            </Form.Item>

            <Form.Item
              name="end_date"
              label="Tanggal Selesai"
              rules={[{ required: true }]}
            >
              <DatePicker format="DD MMMM YYYY" />
            </Form.Item>
            <Form.Item name="price" label="Harga" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Batal</Button>
              <Button type="primary" htmlType="submit">
                Simpan
              </Button>
            </Space>
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default Calendar;
