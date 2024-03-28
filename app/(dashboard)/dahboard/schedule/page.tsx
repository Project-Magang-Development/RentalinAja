"use client";

import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  message,
  notification,
  Input,
} from "antd";
import moment from "moment";
import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import "moment/locale/id";

interface Vehicle {
  vehicles_id: number;
  name: string;
  model: string;
}

interface Schedule {
  schedules_id?: number; // Make schedules_id optional to accommodate vehicles without schedules
  vehicles_id: number;
  start_date?: Date; // Optional because not all vehicles have a schedule
  end_date?: Date; // Optional because not all vehicles have a schedule
  price?: number; // Optional because not all vehicles have a schedule
  Vehicle?: Vehicle;
}

type PayloadType = {
  start_date: any;
  end_date: any;
  vehicles_id: number | undefined;
  price: any;
  schedules_id?: number; // add schedules_id to the type
};

export default function AdminReservationDashboard() {
  moment.locale("id");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchVehicles = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/vehicle/show", {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch vehicles.");

      const data = await response.json();
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to fetch vehicles.");
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token not found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/schedule/show", {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch schedule.");

      const data = await response.json();
      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      message.error("Failed to fetch schedule.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchSchedule();
  }, []);

  const showEditScheduleModal = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    const vehicleSchedule = schedules.find(
      (s) => s.vehicles_id === vehicle.vehicles_id
    );
    if (vehicleSchedule) {
      form.setFieldsValue({
        start_date: moment(vehicleSchedule.start_date),
        end_date: moment(vehicleSchedule.end_date),
        price: vehicleSchedule.price,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      await form.validateFields();
      const formData = form.getFieldsValue();

      const vehicleSchedule = schedules.find(
        (schedule) => schedule.vehicles_id === currentVehicle?.vehicles_id
      );

      const payload: PayloadType = {
        start_date: formData.start_date
          ? formData.start_date.format("YYYY-MM-DD")
          : undefined,
        end_date: formData.end_date
          ? formData.end_date.format("YYYY-MM-DD")
          : undefined,
        vehicles_id: currentVehicle?.vehicles_id,
        price: formData.price,
      };

      if (vehicleSchedule) {
        payload["schedules_id"] = vehicleSchedule.schedules_id;
      }

      setLoading(true);
      const endpoint = vehicleSchedule
        ? `/api/schedule/update/${vehicleSchedule.schedules_id}`
        : `/api/schedule/create`;
      const method = vehicleSchedule ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      showSuccessNotification(!!vehicleSchedule);
      setIsModalVisible(false);
      setLoading(false);

      fetchSchedule();
    } catch (error) {
      console.error("Error creating/updating schedule:", error);
      message.error({
        content: "Failed to create/update schedule.",
        duration: 5,
      });
      setLoading(false);
    }
  };

  const showSuccessNotification = (isUpdate: any) => {
    notification.success({
      message: `Jadwal ${isUpdate ? "Diperbarui" : "Dibuat"}`,
      description: `Jadwal kendaraan ${
        isUpdate ? "telah berhasil diperbarui." : "telah berhasil dibuat."
      }`
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      title: "Nama Kendaraan",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Model Kendaraan",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Tanggal Mulai",
      dataIndex: "start_date",
      key: "start_date",
      render: (text: any, record: Schedule) =>
        record.start_date
          ? moment(record.start_date).format("DD MMMM YYYY")
          : "Belum Diatur",
    },
    {
      title: "Tanggal Selesai",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: Schedule) =>
        record.end_date
          ? moment(record.end_date).format("DD MMMM YYYY")
          : "Belum Diatur",
    },
    {
      title: "Harga",
      dataIndex: "price",
      key: "price",
      render: (data: any, record: Schedule) =>
        record.price ? `Rp ${record.price.toLocaleString()}` : "Belum Diatur",
    },
    {
      title: "Aksi",
      key: "action",
      render: (record: Vehicle) => (
        <Space size="middle">
          <Button
            onClick={() => showEditScheduleModal(record)}
            icon={<EditOutlined />}
          />
        </Space>
      ),
    },
  ];

  

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredVehicles = vehicles
    .filter((vehicle) => {
      return (
        vehicle.name.toLowerCase().includes(searchText.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchText.toLowerCase())
      );
    })
    .map((vehicle) => {
      // Find the schedule for the filtered vehicle
      const vehicleSchedule = schedules.find(
        (schedule) => schedule.vehicles_id === vehicle.vehicles_id
      );
      // Return the vehicle data with the schedule details included
      return {
        ...vehicle,
        start_date: vehicleSchedule?.start_date,
        end_date: vehicleSchedule?.end_date,
        price: vehicleSchedule?.price,
      };
    });


  return (
    <div>
      <Title level={3}>Jadwal Kendaraan</Title>
      <Input
        placeholder="Cari Kendaraan..."
        value={searchText}
        onChange={handleSearch}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Table
        dataSource={filteredVehicles}
        columns={columns}
        rowKey="vehicles_id"
        onChange={(pagination) => {
          setPagination({
            pageSize: pagination.pageSize || 10,
            current: pagination.current || 1,
          });
        }}
      />
      <Modal
        title="Edit Jadwal Kendaraan"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="start_date"
            label="Tanggal Mulai"
            rules={[
              { required: true, message: "Silakan pilih tanggal mulai!" },
            ]}
          >
            <DatePicker format="DD MMMM YYYY" />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="Tanggal Selesai"
            rules={[
              { required: true, message: "Silakan pilih tanggal selesai!" },
            ]}
          >
            <DatePicker format="DD MMMM YYYY" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Harga Per Hari"
            rules={[{ required: true, message: "Silakan masukkan harga!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button key="back" onClick={handleCancel}>
                Batal
              </Button>
              <Button key="submit" onClick={handleOk}>
                Tambah
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
