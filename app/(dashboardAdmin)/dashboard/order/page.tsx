"use client";

import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";

interface Order {
  order_id: number;
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
      no_plat: string
    };
    schedules_id: number;
    merchant_id: number;
    vehicles_id: number;
    start_date: string;
    end_date: string;
    price: number;
  };
}

export default function AdminOrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token not found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/order/show", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders.");

      const data = await response.json();
      console.log(data)
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
      title: "No Plat",
      key: "no_plat",
      render: (record: Order) =>
        record?.Schedule.Vehicle?.no_plat || "Tidak tersedia",
    },
    {
      title: "Nama Kendaraan",
      key: "vehicleName",
      render: (record: Order) =>
        record?.Schedule?.Vehicle?.name || "Tidak tersedia",
    },
    {
      title: "Model Kendaraan",
      key: "vehicleModel",
      render: (record: Order) =>
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
        dataSource={orders}
        loading={loading}
        rowKey="order_id"
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
