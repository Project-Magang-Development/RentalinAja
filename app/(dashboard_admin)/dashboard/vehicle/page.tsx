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
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import TableSkeleton from "@/app/components/tableSkeleton";
import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import Cookies from "js-cookie";

const { RangePicker } = DatePicker;

interface Vehicle {
  vehicles_id: string;
  name: string;
  capacity: number;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  status: string;
}

const fetcher = (url: any) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  }).then((res) => res.json());

export default function AdminVehicleDashboard() {
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const router = useRouter();
  const [hoverDelete, setHoverDelete] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const fetchUrl = useMemo(() => {
    let url = "/api/vehicle/show";
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return `${url}?${params.toString()}`;
  }, [startDate, endDate]);
  const { data: vehicles, error, mutate } = useSWR(fetchUrl, fetcher);
  const { available, notAvailable } = useMemo(() => {
    const available: Vehicle[] = [];
    const notAvailable: Vehicle[] = [];
    vehicles?.forEach((vehicle: any) => {
      if (vehicle.status === "Tersedia") available.push(vehicle);
      else notAvailable.push(vehicle);
    });
    return { available, notAvailable };
  }, [vehicles]);

  const handleDelete = async (vehicleId: string) => {
    Modal.confirm({
      title: "Konfirmasi Penghapusan",
      content: "Kamu yakin menghapus data ini?",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/vehicle/delete/${vehicleId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
          if (!response.ok) throw new Error("Deletion failed");

          mutate(
            vehicles.filter(
              (v: { vehicles_id: string }) => v.vehicles_id !== vehicleId
            ),
            false
          );
          notification.success({ message: "Data Kendaraan Berhasil Dihapus" });
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

  const handleEdit = (vehicles_id: string) => {
    const vehicleToEdit = vehicles.find(
      (vehicle: any) => vehicle.vehicles_id === vehicles_id
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
    let response;
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

      const token = Cookies.get("token");

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          notification.error({
            message: "Gagal",
            description: "Limit Tambah Kendaraan Sudah Habis",
          });
        } else {
          throw new Error(errorData.message || "Failed to process vehicle");
        }
      } else {
        notification.success({
          message: "Sukses",
          description: editingVehicle
            ? "Data Kendaraan Berhasil Di Update."
            : "Data Kendaraan Berhasil Di Tambah.",
        });
        mutate();
        form.resetFields();
        setIsModalVisible(false);
        setEditingVehicle(null);
        setFileList([]);
      }
    } catch (error) {
      notification.error({
        message: "Gagal",
        description: editingVehicle
          ? "Data Kendaraan Gagal Di Update."
          : "Data Kendaraan Gagal Di Tambah.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingVehicle(null);
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleSchedule = (vehicles_id: number) => {
    router.push(`/dashboard/vehicle/calendar/${vehicles_id}`);
  };

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    setSearchPerformed(startDate || endDate ? true : false);
  }, [startDate, endDate]);

  const handleFilterSubmit = (values: any) => {
    const { dateRange } = values;
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      const formattedStartDate = startDate.format("YYYY-MM-DD");
      const formattedEndDate = endDate.format("YYYY-MM-DD");
      router.push(
        `/dashboard/vehicle?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      setSearchPerformed(true);
    } else {
      router.push("/dashboard/vehicle");
      setSearchPerformed(false);
    }
  };

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

  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];

    return vehicles.filter(
      (vehicle: any) =>
        vehicle.name.toLowerCase().includes(searchText.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [vehicles, searchText]);

  const handleScheduleAvailable = () => {
    router.push(
      `/dashboard/vehicle/calendar/available?startDate=${startDate}&endDate=${endDate}`
    );
  };

  const handleScheduleAll = () => {
    router.push("/dashboard/vehicle/calendar/all");
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

  if (!vehicles) return <TableSkeleton />;

  if (loading) return <TableSkeleton />;

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
            onFinish={handleFilterSubmit}
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
        {!searchPerformed && (
          <Flex
            justify="space-between"
            gap="16px"
            style={{ marginBottom: "16px", marginTop: "24px" }}
          >
            <Button type="primary" onClick={showModal}>
              Tambah Data Kendaraan
            </Button>

            <Space>
              <Button
                onClick={() => handleScheduleAll()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ScheduleOutlined />
                Jadwal Seluruh Kendaraan
              </Button>
            </Space>

            <Input
              placeholder="Cari Kendaraan..."
              value={searchText}
              onChange={handleSearch}
              style={{ width: "50%" }}
            />
          </Flex>
        )}
        {searchPerformed ? (
          <>
            <Flex justify="space-between">
              <Title level={4}>Kendaraan Yang Tersedia</Title>
              <Space>
                <Button
                  onClick={() => handleScheduleAvailable()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ScheduleOutlined />
                  Jadwal Kendaraan Tersedia
                </Button>
              </Space>
            </Flex>
            <Table
              dataSource={available}
              columns={columns}
              pagination={pagination}
              style={{ marginTop: "32px" }}
            />
            <Title level={4} style={{ marginTop: "32px" }}>
              Kendaraan Yang Tidak Tersedia
            </Title>
            <Table
              dataSource={notAvailable}
              columns={columns}
              pagination={pagination}
              style={{ marginTop: "32px" }}
            />
          </>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredVehicles.map((vehicle: any, index: any) => ({
              ...vehicle,
              index,
              key: vehicle.vehicles_id,
            }))}
            pagination={pagination}
            loading={loading}
            style={{ marginTop: "32px" }}
          />
        )}
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
