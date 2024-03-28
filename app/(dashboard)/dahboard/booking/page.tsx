"use client";

import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";

interface Booking {
  booking_id: number;
  merchant_id: number;
  vehicles_id: number;
  start_date: string;
  end_date: string;
  customer_name: string;
  price: number;
  Schedule: {
    Vehicle: {
      vehicle_id: number;
      name: string;
      imageUrl: string;
      model: string;
    };
    schedules_id: number;
    merchant_id: number;
    vehicles_id: number;
    start_date: string;
    end_date: string;
    price: number;
  };
}

export default function AdminBookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });

  const fetchBookings = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token not found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/booking/show", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch bookings.");

      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to fetch bookings.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Nama Pelanggan",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Nama Kendaraan",
      key: "vehicleName",
      render: (record: Booking) =>
        record?.Schedule?.Vehicle?.name || "Tidak tersedia",
    },
    {
      title: "Model Kendaraan",
      key: "vehicleModel",
      render: (record: Booking) =>
        record?.Schedule?.Vehicle?.model || "Tidak tersedia",
    },
    {
      title: "Tanggal Mulai",
      dataIndex: "start_date",
      key: "start_date",
      render: (text: any) => moment(text).format("DD MMMM YYYY"),
    },
    {
      title: "Tanggal Selesai",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any) => moment(text).format("DD MMMM YYYY"),
    },
    {
      title: "Total Harga",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (data: any) => {
        const formattedPrice = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(data);
        return formattedPrice;
      },
    },
    {
      title: "Metode Pembayaran",
      dataIndex: "status",
      key: "status",
      render: (text: any, record: any) => record?.Payment?.payment_method || "",
    },
    {
      title: "Status Pembayaran",
      dataIndex: "status",
      key: "status",
      render: (text: any, record: any) => record?.Payment?.status || "Pending",
    },
  ];

  return (
    <div>
      <Title level={3}>Data Penyewaan Kendaraan</Title>
      <Table
        columns={columns}
        dataSource={bookings}
        loading={loading}
        rowKey="booking_id"
        onChange={(pagination) => {
          setPagination({
            pageSize: pagination.pageSize || 10,
            current: pagination.current || 1,
          });
        }}
      />
    </div>
  );
}
