"use client";

import React, { useEffect, useState } from "react";
import { Divider, message, Table } from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";
import Cookies from "js-cookie";

interface Package {
  package_id: string;
  package_name: string;
  package_price: number;
  storage_limit: number;
}

interface Merchant {
  merchant_id: string;
  merchant_name: string;
  package: Package;
}

export default function AdminMerchantDashboard() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });

  const fetchMerchants = async () => {
    setLoading(true);
    const token = Cookies.get("tokenAdmin");
    if (!token) {
      message.error("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/merchant/show", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch merchants.");

      const data = await response.json();
      setMerchants(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      message.error("Failed to fetch merchants.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const columns = [
    {
      title: "No",
      dataIndex: "merchant_id",
      key: "merchant_id",
      render: (value: number, _: Merchant, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Nama Merchant",
      dataIndex: "merchant_name",
      key: "merchant_name",
    },
    {
      title: "Nama Paket",
      dataIndex: "package",
      key: "package_name",
      render: (packageData: Package) =>
        packageData?.package_name || "Tidak tersedia",
    },
    {
      title: "Penyimpanan",
      dataIndex: "package",
      key: "storage_limit",
      render: (packageData: Package) =>
        `${packageData?.storage_limit} GB` ||
        packageData?.storage_limit ||
        "Tidak tersedia",
    },
    {
      title: "Harga Paket",
      dataIndex: "package",
      key: "package_price",
      render: (packageData: Package) =>
        packageData?.package_price.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }) || "Tidak tersedia",
    },
  ];

  return (
    <div>
      <Title level={3}>Data Merchant</Title>
      <Divider />
      <Table
        columns={columns}
        dataSource={merchants}
        loading={loading}
        rowKey="merchant_id"
        pagination={pagination}
        onChange={(newPagination) => {
          setPagination({
            pageSize: newPagination.pageSize || 10,
            current: newPagination.current || 1,
          });
        }}
      />
    </div>
  );
}
