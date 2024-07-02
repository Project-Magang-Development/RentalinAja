"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Modal,
  notification,
  Space,
  Table,
  Tooltip,
} from "antd";
import Title from "antd/es/typography/Title";
import useSWR from "swr";
import TableSkeleton from "@/app/components/tableSkeleton";
import Cookies from "js-cookie";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

interface Package {
  package_id: string;
  package_name: string;
  package_description: string;
  package_feature: string;
  package_price: number;
  count: number;
  duration: number;
}

const fetcher = async (url: string) => {
  const token = Cookies.get("tokenAdmin");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }
  return response.json();
};

export default function AdminPackageDashboard() {
  const {
    data: packages,
    mutate,
    isLoading,
  } = useSWR("/api/package/show", fetcher);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [hoverDelete, setHoverDelete] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditingPackage(null);
    form.resetFields();
    setIsModalVisible(false);
  };

  const modalTitle = editingPackage ? "Edit Data Paket" : "Tambah Data Paket";

  const handleOk = async () => {
    let response;
    try {
      const values = await form.validateFields();

      const payload = {
        package_name: values.name,
        package_description: values.description,
        package_feature: values.feature,
        package_price: parseInt(values.price),
        count_order: parseInt(values.count_order),
        count_vehicle: parseInt(values.count_vehicle),
        duration: parseInt(values.duration),
      };
      console.log(payload);
      setLoading(true);

      const token = Cookies.get("token");

      if (editingPackage) {
        response = await fetch(
          `/api/package/update/${editingPackage.package_id}`,
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
        response = await fetch("/api/package/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
      } else {
        notification.success({
          message: "Sukses",
          description: editingPackage
            ? "Data Paket Berhasil Di Update."
            : "Data Paket Berhasil Di Tambah.",
        });
        mutate();
        form.resetFields();
        setIsModalVisible(false);
        setEditingPackage(null);
      }
    } catch (error) {
      notification.error({
        message: "Gagal",
        description: editingPackage
          ? "Data Paket Gagal Di Update."
          : "Data Paket Gagal Di Tambah.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setHoverDelete(true);
  };

  const handleMouseLeave = () => {
    setHoverDelete(false);
  };

  const handleEdit = (package_id: string) => {
    if (!packages || packages.length === 0) {
      console.error("Packages data is empty or undefined");
      return;
    }

    const packageToEdit = packages.find(
      (packageData: any) => packageData.package_id === package_id
    );

    if (!packageToEdit) {
      console.error("Package not found");
      return;
    }

    console.log("Count:", packageToEdit.count);
    console.log("Description:", packageToEdit.package_description);

    console.log(packageToEdit);

    setEditingPackage(packageToEdit);
    form.setFieldsValue({
      name: packageToEdit.package_name,
      description: packageToEdit.package_description,
      feature: packageToEdit.package_feature,
      price: packageToEdit.package_price,
      count_order: packageToEdit.count_order,
      count_vehicle: packageToEdit.count_vehicle,
      duration: packageToEdit.duration,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (package_id: string) => {
    Modal.confirm({
      title: "Konfirmasi Penghapusan",
      content: "Kamu yakin menghapus data ini?",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/package/delete/${package_id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
          if (!response.ok) throw new Error("Deletion failed");

          mutate(
            packages.filter(
              (v: { package_id: string }) => v.package_id !== package_id
            ),
            false
          );
          notification.success({ message: "Data Paket Berhasil Di Hapus" });
        } catch (error) {
          notification.error({
            message: "Deletion failed",
            description: (error as Error).message,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (!packages) {
    return <TableSkeleton />;
  }

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
      title: "Deskripsi",
      dataIndex: "package_description",
      key: "package_description",
    },
    {
      title: "Fitur",
      dataIndex: "package_feature",
      key: "package_feature",
    },
    {
      title: "Penyimpanan Data Kendaraan",
      dataIndex: "count_vehicle",
      key: "count_vechicle",
    },
    {
      title: "Penyimpanan Data Order",
      dataIndex: "count_order",
      key: "count_order",
    },
    {
      title: "Durasi",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration} Bulan`,
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
    {
      title: "Aksi",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.package_id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.package_id)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              danger={hoverDelete}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}> Data Paket</Title>
      <Divider />
      <Flex>
        <Button
          style={{ backgroundColor: "#6B7CFF", color: "white" }}
          onClick={showModal}
          icon={<PlusOutlined />}
        >
          Tambah Data Paket
        </Button>
      </Flex>
      <Table
        scroll={{ x: 500 }}
        columns={columns}
        dataSource={packages}
        rowKey="package_id"
        style={{ marginTop: "20px" }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          onChange: (page) =>
            setPagination((prev) => ({ ...prev, current: page })),
        }}
      />
      <Modal
        title={<div style={{ marginBottom: "16px" }}>{modalTitle}</div>}
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addPacketForm"
          initialValues={{ remember: true }}
          onFinish={handleOk}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Tolong Masukan Nama Paket!" }]}
          >
            <Input placeholder="Nama Paket" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: "Tolong Masukan Deskripsi!" }]}
          >
            <Input placeholder="Deskripsi" />
          </Form.Item>
          <Form.Item
            name="feature"
            rules={[{ required: true, message: "Tolong Masukan fitur!" }]}
          >
            <Input placeholder="Fitur" />
          </Form.Item>
          <Form.Item
            name="price"
            rules={[{ required: true, message: "Tolong Masukan Harga Paket!" }]}
          >
            <Input placeholder="Harga Paket" />
          </Form.Item>
          <Form.Item
            name="count_vehicle"
            rules={[
              {
                required: true,
                message: "Tolong Masukan Penyimpanan Data Order Yang Masuk!",
              },
            ]}
          >
            <Input placeholder="Penyimpanan Data Order Yang Masuk (Boleh Kosong)" />
          </Form.Item>
          <Form.Item
            name="count_order"
            rules={[
              {
                required: true,
                message:
                  "Tolong Masukan Penyimpanan Data Kendaraan Yang Masuk!",
              },
            ]}
          >
            <Input placeholder="Penyimpanan Data Kendaraan Yang Masuk (Boleh Kosong)" />
          </Form.Item>
          <Form.Item
            name="duration"
            rules={[
              {
                required: true,
                message: "Tolong Masukan Durasi Paket!",
              },
            ]}
          >
            <Input placeholder="Durasi Paket Dalam Bulan" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button key="back" onClick={handleCancel}>
                Batal
              </Button>
              <Button key="submit" type="primary" htmlType="submit">
                {editingPackage ? "Update" : "Tambah"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
