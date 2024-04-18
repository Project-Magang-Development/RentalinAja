"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Space,
  Form,
  Input,
  Flex,
  Modal,
  Upload,
  DatePicker,
  Divider,
  Tooltip,
  Skeleton,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import dynamic from "next/dynamic";
import TableSkeleton from "@/app/components/tableSkeleton";


const { RangePicker } = DatePicker;


interface Vehicle {
  vehicles_id: number;
  name: string;
  capacity: number;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const router = useRouter();
  const [hoverDelete, setHoverDelete] = useState(false);

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

  useEffect(() => {
    if (editingVehicle && editingVehicle.imageUrl) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: editingVehicle.imageUrl,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [editingVehicle]);

  const handleFileChange = (info: UploadChangeParam) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);

    if (newFileList[0] && newFileList[0].originFileObj) {
      convertFileToBase64(newFileList[0].originFileObj, (base64) => {
        const fileInBase64 = base64 as string;

        setFileList([
          {
            uid: "-1",
            name: newFileList[0].name,
            status: "done",
            url: fileInBase64, 
          },
        ]);
      });
    } else {
      setFileList([]);
    }
  };

  const handleEdit = (vehicles_id: number) => {
    const vehicleToEdit = vehicles.find(
      (vehicle) => vehicle.vehicles_id === vehicles_id
    );
    if (vehicleToEdit) {
      setEditingVehicle(vehicleToEdit);
      form.setFieldsValue({
        ...vehicleToEdit,
        imageUrl: vehicleToEdit.imageUrl
          ? [{ url: vehicleToEdit.imageUrl }]
          : [],
      });
      setIsModalVisible(true);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const imageUrl = fileList.length > 0 ? fileList[0].url : "";
      const payload = {
        name: values.name,
        capacity: parseInt(values.capacity, 10),
        model: values.model,
        year: parseInt(values.year, 10),
        no_plat: values.no_plat,
        imageUrl,
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
      setFileList([]);
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

  const handleSubmit = async (values: any) => {
    const [startDate, endDate] = values.dateRange;

    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");

    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/schedule/findVehicle", {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch vehicles.");

      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = (vehicles_id: number) => {
    router.push(`/dashboard/vehicle/calendar/${vehicles_id}`);
  };

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const name = vehicle.name || "";
    const model = vehicle.model || "";

    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      model.toLowerCase().includes(searchText.toLowerCase())
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

  const convertFileToBase64 = (
    file: Blob,
    callback: (result: string | ArrayBuffer | null) => void
  ) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
  };

  const handleMouseEnter = () => {
    setHoverDelete(true);
  };

  const handleMouseLeave = () => {
    setHoverDelete(false);
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
      title: "Gambar",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl: string) => (
        <Image
          src={imageUrl}
          alt="vehicle"
          width={100}
          height={60}
          unoptimized={true}
        />
      ),
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
      title: "Nomer Plat",
      dataIndex: "no_plat",
      key: "no_plat",
    },
    {
      title: "Tahun",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Aksi",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.vehicles_id)}
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
              onClick={() => handleDelete(record.vehicles_id)}
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
          <Tooltip title="Jadwal">
            <Button
              icon={<ScheduleOutlined />}
              onClick={() => handleSchedule(record.vehicles_id)}
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  const modalTitle = editingVehicle
    ? "Edit Data Kendaraan"
    : "Tambah Data Kendaraan";

    if (loading) {
      return (
        <TableSkeleton/>
      );
    }

  return (
    <div style={{ background: "#FFF", padding: "16px" }}>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >
          <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
            Data Kendaraan
          </Title>
          <Form
            onFinish={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Form.Item
              name="dateRange"
              rules={[
                { required: true, message: "Pilih Tanggal Mulai dan Selesai" },
              ]}
              style={{ margin: 0 }}
            >
              <RangePicker />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Filter
            </Button>
          </Form>
        </div>
        <Divider />
        <Flex
          justify="space-between"
          gap="16px"
          style={{ marginBottom: "16px", marginTop: "24px" }}
        >
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
          style={{ marginTop: "32px" }}
        />
        <Modal
          title={<div style={{ marginBottom: "16px" }}>{modalTitle}</div>}
          visible={isModalVisible}
          footer={null}
          onCancel={handleCancel}
        >
          <Form
            form={form}
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
            <Form.Item
              name="no_plat"
              rules={[
                {
                  required: true,
                  message: "Tolong Masukan Nomor Plat Kendaraan!",
                },
              ]}
            >
              <Input placeholder="Nomor Plat" />
            </Form.Item>
            <Form.Item
              name="imageUrl"
              valuePropName="fileList"
              getValueFromEvent={({ fileList: newFileList }) => {
                if (newFileList.length > 1) {
                  const lastFile = newFileList[newFileList.length - 1];
                  return [lastFile].map((file) => ({
                    ...file,
                    url: file.originFileObj
                      ? URL.createObjectURL(file.originFileObj)
                      : file.url,
                  }));
                }
                return newFileList.map((file: any) => ({
                  ...file,
                  url: file.originFileObj
                    ? URL.createObjectURL(file.originFileObj)
                    : file.url,
                }));
              }}
            >
              <Upload.Dragger
                name="files"
                listType="picture-card"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                showUploadList={false}
              >
                {fileList.length > 0 ? (
                  fileList.map((file) => (
                    <div
                      key={file.uid}
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        marginBottom: "16px",
                      }}
                    >
                      <Image
                        src={file.url ?? (file.thumbUrl || "")}
                        alt={file.name}
                        layout="fill"
                        objectFit="contain"
                      />
                      {file.status === "uploading" && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            background: "rgba(255,255,255,0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>Loading...</div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Klik atau drag file ke area ini untuk upload
                    </p>
                    <p className="ant-upload-hint">
                      Support untuk single upload.
                    </p>
                  </div>
                )}
              </Upload.Dragger>
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
    </div>
  );
}
