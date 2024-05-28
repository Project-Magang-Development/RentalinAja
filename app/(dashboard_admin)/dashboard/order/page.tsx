"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Table,
} from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";
import TableSkeleton from "@/app/components/tableSkeleton";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
const { Option } = Select;

interface Order {
  order_id: string;
  merchant_id: string;
  vehicles_id: string;
  start_date: string;
  end_date: string;
  customer_name: string;
  price: number;
  status: string;
  phone: string;
  Schedule: Schedule;
}

interface Schedule {
  schedules_id: string;
  merchant_id: string;
  vehicles_id: string;
  start_date: string;
  end_date: string;
  price: number;
  Vehicle: Vehicle;
}
interface Vehicle {
  vehicle_id: string;
  name: string;
  imageUrl: string;
  model: string;
  no_plat: string;
  status: string;
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
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { data: vehicles } = useSWR(
    startDate && endDate
      ? `/api/vehicle/show?startDate=${startDate}&endDate=${endDate}`
      : null,
    fetcher
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const dateFormat = "DD MMMM YYYY";
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const [form] = Form.useForm();

  const StatusFilter = () => (
    <Radio.Group onChange={handleFilterChange} value={filterStatus}>
      <Radio.Button value="">Semua</Radio.Button>
      <Radio.Button value="PAID">Berhasil</Radio.Button>
      <Radio.Button value="Pending">Pending</Radio.Button>
      <Radio.Button value="EXPIRED">Gagal</Radio.Button>
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
      title: "No. Telp Pelanggan",
      dataIndex: "customer_phone",
      key: "customer_phone",
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
        } else if (status === "EXPIRED") {
          textColor = "#EF3826";
        }
        if (status === "Pending") {
          backgroundColor = "#FCF3D4";
        } else if (status === "PAID") {
          backgroundColor = "#CCF0EB";
        } else if (status === "EXPIRED") {
          backgroundColor = "#FCD7D4";
        }

        return (
          <div
            style={{
              backgroundColor: backgroundColor,
              color: textColor,
              padding: "5px",
              borderRadius: "5px",
              textAlign: "center",
              fontWeight: "bold",
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
        router.push(`/dashboard/order/${record.external_id}`);
      },
    };
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = async (values: any) => {
    const startDate = values.startDate.format("YYYY-MM-DD");
    const endDate = values.endDate.format("YYYY-MM-DD");

    const payloadData = {
      start_date: startDate,
      end_date: endDate,
      customer_name: values.name,
      schedules_id: selectedScheduleId,
      price: selectedPrice,
      phone: values.phone,
    };

    try {
      const response = await fetch("/api/order/createOrder", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleDateChange = async (field: string, value: any) => {
    if (field === "startDate") {
      setStartDate(value ? value.format("YYYY-MM-DD") : null);
    } else if (field === "endDate") {
      setEndDate(value ? value.format("YYYY-MM-DD") : null);
    }

    if (startDate && endDate) {
      setLoading(true);
      try {
        await mutate(
          `/api/vehicle/show?startDate=${startDate}&endDate=${endDate}`
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to refresh vehicle data:", error);
      }
    }
  };

  const availableVehicles =
    vehicles?.filter((vehicle: Vehicle) => vehicle.status === "Tersedia") || [];

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredOrder = useMemo(() => {
    if (!orders) return [];

    return orders.filter(
      (order: any) =>
        order.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
        order.Schedule.Vehicle.name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        order.Schedule.Vehicle.model
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        order.start_date.toLowerCase().includes(searchText.toLowerCase()) ||
        order.end_date.toLowerCase().includes(searchText.toLowerCase()) ||
        order.status.toLowerCase().includes(searchText.toLowerCase()) ||
        order.total_amount.toString().includes(searchText)
    );
  }, [orders, searchText]);

  if (loading) {
    return <TableSkeleton />;
  }

  if (!orders) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <Flex justify="space-between">
        <Title level={3}>Data Penyewaan Kendaraan</Title>
        <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
          Tambah Order
        </Button>
      </Flex>
      <Divider />
      <Flex justify="space-between">
        <Space direction="vertical" style={{ marginBottom: "24px" }}>
          <StatusFilter />
        </Space>
        <Input
          placeholder="Cari Order..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "50%", height: "35px" }}
        />
      </Flex>

      <Table
        onRow={rowClickHandler}
        columns={columns}
        dataSource={filteredOrder.map((order: any, index: any) => ({
          ...order,
          index,
          key: order.order_id,
        }))}
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
        title="Tambah Order"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleFinish}>
          <Form.Item
            name="startDate"
            rules={[
              { required: true, message: "Please select the start date!" },
            ]}
          >
            <DatePicker
              format={dateFormat}
              placeholder="Pilih Waktu Mulai"
              onChange={(value) => handleDateChange("startDate", value)}
            />
          </Form.Item>
          <Form.Item
            name="endDate"
            rules={[{ required: true, message: "Please select the end date!" }]}
          >
            <DatePicker
              format={dateFormat}
              placeholder="Pilih Waktu Selesai"
              onChange={(value) => handleDateChange("endDate", value)}
            />
          </Form.Item>
          <Form.Item name="vehicle">
            <Select
              placeholder="Pilih Kendaraan"
              value={selectedVehicle}
              onChange={(value) => {
                const selectedVehicle = availableVehicles.find(
                  (vehicle: any) => vehicle.name === value
                );
                if (selectedVehicle && selectedVehicle.Schedules.length > 0) {
                  const firstSchedule = selectedVehicle.Schedules[0];
                  setSelectedVehicleId(selectedVehicle.vehicle_id);
                  setSelectedVehicle(selectedVehicle.name);
                  setSelectedScheduleId(firstSchedule.schedules_id);
                  setSelectedPrice(firstSchedule.price);
                }
              }}
            >
              {availableVehicles.map((vehicle: any) => (
                <Option key={vehicle.vehicle_id} value={vehicle.name}>
                  {vehicle.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: "Masukan Nama Pelanggan" }]}
          >
            <Input placeholder="Masukan Nama" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Masukan No. Telpon Pelanggan" },
            ]}
          >
            <Input placeholder="Masukan No. Telepon Pelanggan" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
