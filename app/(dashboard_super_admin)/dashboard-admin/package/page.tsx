"use client";

import React, { useEffect, useState } from "react";
import { message, Table } from "antd";

interface Package {
  package_id: number;
  package_name: string;
  package_price: number;
  storage_limit: number;
}

export default function AdminPackageDashboard() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });

  const getPackages = async () => {
    setLoading(true);
    const token = localStorage.getItem("tokenAdmin");
    if (!token) {
      message.error("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/package/show", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch packages.");

      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("Failed to fetch packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPackages();
  }, []);

  const columns = [
    {
      title: "No",
      dataIndex: "package_id",
      key: "package_id",
      render: (text: any, record: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Nama Paket",
      dataIndex: "package_name",
      key: "package_name",
    },
    {
      title: "Penyimpanan (GB)",
      dataIndex: "storage_limit",
      key: "storage_limit",
      render: (text: number) => `${text} GB`,
    },
    {
      title: "Harga Paket",
      dataIndex: "package_price",
      key: "package_price",
      render: (price: number) =>
        price.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }),
    },
  ];

  return (
    <div>
      <h3>Data Paket</h3>
      <Table
        columns={columns}
        dataSource={packages}
        loading={loading}
        rowKey="package_id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          onChange: (page) =>
            setPagination((prev) => ({ ...prev, current: page })),
        }}
      />
    </div>
  );
}
