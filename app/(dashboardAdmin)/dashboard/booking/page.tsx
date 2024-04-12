"use client";

import React, { useEffect, useState } from "react";
import { message, Radio, Space, Table } from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";
import { ColumnType } from "antd/es/table";

interface Booking {
  booking_id: number;
  merchant_id: number;
  Order: Order;
  Payment: Payment;
}

interface Payment {
  payment_id: number;
  amount: number;
  payment_method: string;
  status: string;
}

interface Order {
  order_id: number;
  merchant_id: number;
  vehicles_id: number;
  start_date: string;
  end_date: string;
  customer_name: string;
  price: number;
  status: string;
  Schedule: {
    Vehicle: {
      vehicle_id: number;
      name: string;
      imageUrl: string;
      model: string;
      no_plat: string;
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
  const [bookings, setBookings] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [filterStatus, setFilterStatus] = useState<string>("");

  const fetchBooking = async (status?: string) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token not found.");
      setLoading(false);
      return;
    }
    try {
      const query = status ? `?status=${status}` : "";
      const response = await fetch(`/api/booking/show${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders.");

      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking(filterStatus);
  }, [filterStatus]);

  const StatusFilter = () => (
    <Radio.Group onChange={handleFilterChange} value={filterStatus}>
      <Radio.Button value="">Semua</Radio.Button>
      <Radio.Button value="Berhasil">Berhasil</Radio.Button>
      <Radio.Button value="Gagal">Gagal</Radio.Button>
    </Radio.Group>
  );

  const handleFilterChange = (e: any) => {
    setFilterStatus(e.target.value);
  };

  const column = [
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
      render: (text: any, record: any) =>
        record?.Order?.customer_name || "Data tidak tersedia",
    },
    {
      title: "No Plat",
      key: "no_plat",
      render: (record: any) =>
        record?.Order?.Schedule.Vehicle?.no_plat || "Tidak tersedia",
    },
    {
      title: "Nama Kendaraan",
      key: "vehicleName",
      render: (record: any) =>
        record?.Order?.Schedule?.Vehicle?.name || "Tidak tersedia",
    },
    {
      title: "Model Kendaraan",
      key: "vehicleModel",
      render: (record: any) =>
        record?.Order?.Schedule?.Vehicle?.model || "Tidak tersedia",
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
      render: (_: any, record: any) => {
        const formattedPrice = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(record.Payment.amount); // Use Payment from Booking
        return formattedPrice;
      },
    },
    {
      title: "Metode Pembayaran",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (_: any, record: any) => record.Payment.payment_method, // Use Payment from Booking
    },
    {
      title: "Status Pembayaran",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (_: any, record: any) => record.Payment.status, // Use Payment from Booking
    },
  ];

  return (
    <div>
      <Title level={3}>Data Booking Kendaraan</Title>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <StatusFilter />
      </Space>
      <Table
        columns={column}
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
