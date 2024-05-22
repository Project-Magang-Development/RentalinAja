"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  message,
  Modal,
  Radio,
  Space,
  Table,
} from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";
import TableSkeleton from "@/app/components/tableSkeleton";
import useSWR from "swr";
import Cookies from "js-cookie";

interface Order {
  order_id: string;
  merchant_id: string;
  vehicles_id: string;
  start_date: string;
  end_date: string;
  customer_name: string;
  price: number;
  status: string;
  Schedule: {
    Vehicle: {
      vehicle_id: string;
      name: string;
      imageUrl: string;
      model: string;
      no_plat: string;
    };
    schedules_id: string;
    merchant_id: string;
    vehicles_id: string;
    start_date: string;
    end_date: string;
    price: number;
  };
}

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

export default function AdminOrderDashboard() {
  const [filterStatus, setFilterStatus] = useState<string>("");
  const { data: orders, error } = useSWR(
    `/api/order/show?status=${filterStatus}`,
    fetcher
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const StatusFilter = () => (
    <Radio.Group onChange={handleFilterChange} value={filterStatus}>
      <Radio.Button value="">Semua</Radio.Button>
      <Radio.Button value="Paid">Berhasil</Radio.Button>
      <Radio.Button value="Pending">Pending</Radio.Button>
    </Radio.Group>
  );

  const handleFilterChange = (e: any) => {
    setFilterStatus(e.target.value);
  };

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
    // {
    //   title: "Metode Pembayaran",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (text: any, record: any) => record?.Payment?.payment_method || "",
    // },
    {
      title: "Status Pembayaran",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let backgroundColor = "gray";
        let textColor = "#FFFFFF";
        if (status === "Pending") {
          textColor = "#EFC326";
        } else if (status === "PAID") {
          textColor = "#00B69B";
        }
        if (status === "Pending") {
          backgroundColor = "#FCF3D4";
        } else if (status === "PAID") {
          backgroundColor = "#CCF0EB";
        }

        return (
          <div
            style={{
              backgroundColor: backgroundColor,
              color: textColor, // Apply text color
              padding: "5px",
              borderRadius: "5px",
              textAlign: "center",
              fontWeight: "bold", // Optional: make text bold for better visibility
            }}
          >
            {status || "Pending"}
          </div>
        );
      },
    },
  ];

  const rowClickHandler = (record: any) => {
    return {
      onClick: () => {
        window.location.href = `/dashboard/order/${record.external_id}`;
      },
    };
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (!orders) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <Title level={3}>Data Penyewaan Kendaraan</Title>
      <Divider />
      <Flex justify="space-between">
        <Space direction="vertical" style={{ marginBottom: "24px" }}>
          <StatusFilter />
        </Space>
        <Button type="primary" onClick={showModal}>
          Tambah Order
        </Button>
      </Flex>

      <Table
        onRow={rowClickHandler}
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
      <Modal
        title={<div style={{ marginBottom: "16px" }}>Tambah Order</div>}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      ></Modal>
    </div>
  );
}
