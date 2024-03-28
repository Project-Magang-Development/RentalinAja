"use client";

import React, { useEffect, useState } from "react";
import { Button, Space, Table, Modal, Form, Input, Select, Flex } from "antd";
import Title from "antd/es/typography/Title";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { notification } from "antd";

interface Vehicle {
  vehicles_id: number;
  name: string;
  capacity: number;
  model: string;
  year: number;
  price: number;
}

export default function AdminVehicleDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form] = Form.useForm();

  const handleDelete = async (vehicles_id: number) => {
    Modal.confirm({
      title: "Yakin Hapus Data Kendaraan?",
      content: "Aksi ini tidak dapat dikembalikan.",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`/api/vehicle/delete/${vehicles_id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete vehicle");
          }

          setVehicles((prevVehicles) =>
            prevVehicles.filter(
              (vehicle) => vehicle.vehicles_id !== vehicles_id
            )
          );
          notification.success({
            message: "Sukses",
            description: "Data Kendaraan Berhasil Di Hapus.",
          });
        } catch (error) {
          console.error("Failed to delete vehicle:", error);
          notification.error({
            message: "Gagal",
            description: "Data Kendaraan Gagal Di Hapus.",
          });
        } finally {
          setLoading(false);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleEdit = (vehicles_id: number) => {
    const vehicleToEdit = vehicles.find(
      (vehicle) => vehicle.vehicles_id === vehicles_id
    );
    if (vehicleToEdit) {
      setEditingVehicle(vehicleToEdit);
      form.setFieldsValue(vehicleToEdit);
      setIsModalVisible(true);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        capacity: parseInt(values.capacity, 10),
        model: values.model,
        year: parseInt(values.year, 10),
      };
      setLoading(true);

      const token = localStorage.getItem("token");
      let response;

      if (editingVehicle) {
        response = await fetch(
          `/api/vehicle/update/${editingVehicle.vehicles_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch("/api/vehicle/create", {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process vehicle");
      }

      notification.success({
        message: "Sukses",
        description: editingVehicle
          ? "Data Kendaraan Berhasil Di Update."
          : "Data Kendaraan Berhasil Di Tambah.",
      });

      form.resetFields();
      setIsModalVisible(false);
      setEditingVehicle(null);
      setLoading(false);
      fetchVehicles();
    } catch (error) {
      notification.error({
        message: "Gagal",
        description: editingVehicle
          ? "Data Kendaraan Gagal Di Update."
          : "Data Kendaraan Gagal Di Tambah.",
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingVehicle(null); // Reset editing state
    form.resetFields(); // Clear form fields
    setIsModalVisible(false); // Close the modal
  };

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    return (
      vehicle.name.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchText.toLowerCase())
    );
  });

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

  useEffect(() => {
    fetchVehicles();
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
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kapasitas",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Tahun",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Aksi",
      key: "action",
      render: (text: any, data: any) => (
        <Space size="middle">
          <button onClick={() => handleEdit(data.vehicles_id)}>
            <EditOutlined />
          </button>
          <button onClick={() => handleDelete(data.vehicles_id)}>
            <DeleteOutlined />
          </button>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  }

  const modalTitle = editingVehicle
    ? "Edit Data Kendaraan"
    : "Tambah Data Kendaraan";

  return (
    <div>
      <Title level={3}>Data Kendaraan</Title>
      <Flex justify="space-between" gap="16px" style={{ marginBottom: "16px" }}>
        <Button type="primary" onClick={showModal}>
          Tambah Data Kendaraan
        </Button>

        <Input
          placeholder="Cari Kendaraan..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "50%" }}
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredVehicles.map((vehicle, index) => ({
          ...vehicle,
          index,
          key: vehicle.vehicles_id,
        }))}
        pagination={pagination}
        onChange={(pagination) => {
          setPagination({
            pageSize: pagination.pageSize || 10,
            current: pagination.current || 1,
          });
        }}
        loading={loading}
      />
      <Modal
        title={<div style={{ marginBottom: "16px" }}>{modalTitle}</div>}
        visible={isModalVisible}
        footer={null} // This removes the footer buttons
      >
        <Form
          form={form} // Make sure to use the form instance created with Form.useForm()
          name="addVehicleForm"
          initialValues={{ remember: true }}
          onFinish={handleOk}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Tolong Masukan Nama Kendaraan!" },
            ]}
          >
            <Input placeholder="Nama Kendaraan" />
          </Form.Item>
          <Form.Item
            name="capacity"
            rules={[
              {
                required: true,
                message: "Tolong Masukan Kapasitas Kendaraan!",
              },
            ]}
          >
            <Input placeholder="Kapasitas" />
          </Form.Item>
          <Form.Item
            name="model"
            rules={[
              { required: true, message: "Tolong Masukan Model Kendaraan!" },
            ]}
          >
            <Input placeholder="Model" />
          </Form.Item>
          <Form.Item
            name="year"
            rules={[
              { required: true, message: "Tolong Masukan Tahun Kendaraan!" },
            ]}
          >
            <Input placeholder="Tahun" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button key="back" onClick={handleCancel}>
                Batal
              </Button>
              <Button key="submit" type="primary" htmlType="submit">
                {editingVehicle ? "Update" : "Tambah"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
