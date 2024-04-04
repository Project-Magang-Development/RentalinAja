"use client";

import React, { useEffect, useState } from "react";
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
  Tooltip
} from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";
import { DeleteOutlined } from "@ant-design/icons";

interface Vehicle {
  vehicles_id: number;
  name: string;
  model: string;
  no_plat: string;
}

interface Schedule {
  schedules_id?: number;
  vehicles_id?: number;
  start_date?: Date;
  end_date?: Date;
  price?: number;
  Vehicle?: Vehicle;
}

type PayloadType = {
  start_date: any;
  end_date: any;
  vehicles_id: number | undefined;
  price: any;
  schedules_id?: number; 
};

function Calendar() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const query = useParams();
  const vehicles_id = query.vehicles_id;
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const [vehicleDetails, setVehicleDetails] = useState<Vehicle | null>(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchSchedule = async () => {
    if (!vehicles_id) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/schedule/show/${vehicles_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch schedules.");

      const data = await response.json();
      if (data.length > 0) {
        setVehicleDetails(data[0].Vehicle);
      }
      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to fetch schedules.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicles_id) {
      fetchSchedule();
    }
  }, [vehicles_id]);

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
    const token = localStorage.getItem("token");
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
        vehicles_id: Number(vehicles_id),
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

      const data = await response.json();
      showSuccessNotification(!!payload.schedules_id);
      setIsModalVisible(false);
      fetchSchedule();
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

  const handleDateClick = (dateClickInfo: any) => {
    const newSelectedEvent = {
      start_date: moment(dateClickInfo.dateStr),
      end_date: undefined,
      price: 0,
    };

    setSelectedEvent(newSelectedEvent);
    setIsModalVisible(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const { event } = clickInfo;
    setSelectedEvent({
      ...event.extendedProps,
      start_date: moment(event.start),
      end_date: moment(event.end),
    });
    setIsModalVisible(true);
  };

  // Function to handle deletion of an event
  const handleDeleteEvent = async (schedules_id: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
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

      // Success - Remove the schedule from state to update UI
      const newSchedules = schedules.filter(
        (schedule) => schedule.schedules_id !== schedules_id
      );
      setSchedules(newSchedules);
      notification.success({
        message: "Berhasil",
        description: "Berhasil Menghapus Jadwal.",
      });
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      notification.error({
        message: "Gagal",
        description: "Berhasil Menghapus Jadwal.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Adjusted eventContent to include a Popconfirm for deletion
  const eventContent = (eventInfo: any) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <b>{eventInfo.timeText}</b>
          <br />
          {eventInfo.event.title}
        </div>
        <Tooltip title="Hapus Jadwal">
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus jadwal ini?"
            onConfirm={(e) => {
              e?.stopPropagation(); // Prevent the modal from opening
              handleDeleteEvent(eventInfo.event.extendedProps.schedules_id);
            }}
            onCancel={(e) => e?.stopPropagation()} // Prevent the modal from opening
            okText="Ya"
            cancelText="Tidak"
            placement="topRight"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              style={{ color: "red", marginLeft: 8 }}
              onClick={(e) => e.stopPropagation()} // Prevent the event click from being triggered
            />
          </Popconfirm>
        </Tooltip>
      </div>
    );
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div>
      {vehicleDetails && (
        <Title level={2}>
          {vehicleDetails.name} - {vehicleDetails.model} -{" "}
          {vehicleDetails.no_plat}
        </Title>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={allLocales}
        locale="id"
        events={schedules.map((schedule) => ({
          title: `Harga: ${
            schedule.price
              ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(schedule.price)
              : "Price not available"
          }`,
          start: schedule.start_date,
          end: schedule.end_date,
          extendedProps: schedule,
          backgroundColor: getRandomColor(),
          borderColor: getRandomColor(),
        }))}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventContent={eventContent}
      />
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
