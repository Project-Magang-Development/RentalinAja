"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  message,
  Radio,
  Space,
  Table,
  Tooltip,
  Modal,
  Form,
  UploadFile,
  Upload,
  notification,
} from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";
import TableSkeleton from "@/app/components/tableSkeleton";
import {
  InboxOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { UploadChangeParam } from "antd/es/upload";

interface Booking {
  booking_id: number;
  merchant_id: number;
  imageUrl: string;
  Order: Order;
  Payment: Payment;
}

interface Payment {
  payment_id: number;
  amount: number;
  payment_method: string;
  status: string;
}

interface Order {
  order_id: number;
  merchant_id: number;
  vehicles_id: number;
  start_date: string;
  end_date: string;
  customer_name: string;
  price: number;
  status: string;
  Schedule: {
    Vehicle: {
      vehicle_id: number;
      name: string;
      imageUrl: string;
      model: string;
      no_plat: string;
    };
    schedules_id: number;
    merchant_id: number;
    vehicles_id: number;
    start_date: string;
    end_date: string;
    price: number;
  };
}

export default function AdminBookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Booking | null>(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const fetchBooking = async (status?: string) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token not found.");
      setLoading(false);
      return;
    }
    try {
      const query = status ? `?status=${status}` : "";
      const response = await fetch(`/api/booking/show${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders.");

      const data = await response.json();
      console.log("Fetched bookings:", data);
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking(filterStatus);
  }, [filterStatus]);

  const StatusFilter = () => (
    <Radio.Group onChange={handleFilterChange} value={filterStatus}>
      <Radio.Button value="">Semua</Radio.Button>
      <Radio.Button value="Berhasil">Berhasil</Radio.Button>
      <Radio.Button value="Gagal">Gagal</Radio.Button>
    </Radio.Group>
  );

  const handleFilterChange = (e: any) => {
    setFilterStatus(e.target.value);
  };

  const convertFileToBase64 = (
    file: Blob,
    callback: (result: string | ArrayBuffer | null) => void
  ) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
  };

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

  const showModal = (booking_id: number) => {
    const booking = bookings.find((b) => b.booking_id === booking_id);
    if (booking) {
      setSelectedRecord(booking);
      setIsModalVisible(true);
    } else {
      message.error("Booking not found");
    }
  };

  const showUploadModal = (booking_id: number) => {
    const booking = bookings.find((b) => b.booking_id === booking_id);
    if (booking) {
      setSelectedRecord(booking);
      setIsUploadModalVisible(true);
    } else {
      message.error("Booking not found");
    }
  };

  const handleUploadModalOk = async () => {
    const imageUrl = fileList.length > 0 ? fileList[0].url : "";
    const payload = {
      imageUrl,
    };
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/booking/update/${selectedRecord?.booking_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        notification.success({
          message: "Sukses",
          description: "Data Kredensial Berhasil Di Tambah.",
        });

        fetchBooking(filterStatus);
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      notification.error({
        message: "Gagal",
        description: "Data Kredensial Gagal Di Tambah.",
      });
    } finally {
      setIsUploadModalVisible(false);
      setFileList([]);
      form.resetFields();
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsUploadModalVisible(false);
  };

  const column = [
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
      render: (text: any, record: any) =>
        record?.Order?.customer_name || "Data tidak tersedia",
    },
    {
      title: "No Plat",
      key: "no_plat",
      render: (record: any) =>
        record?.Order?.Schedule.Vehicle?.no_plat || "Tidak tersedia",
    },
    {
      title: "Nama Kendaraan",
      key: "vehicleName",
      render: (record: any) =>
        record?.Order?.Schedule?.Vehicle?.name || "Tidak tersedia",
    },
    // {
    //   title: "Model Kendaraan",
    //   key: "vehicleModel",
    //   render: (record: any) =>
    //     record?.Order?.Schedule?.Vehicle?.model || "Tidak tersedia",
    // },
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
      render: (_: any, record: any) => {
        const formattedPrice = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(record.Payment.amount); // Use Payment from Booking
        return formattedPrice;
      },
    },
    // {
    //   title: "Metode Pembayaran",
    //   dataIndex: "payment_method",
    //   key: "payment_method",
    //   render: (_: any, record: any) => record.Payment.payment_method, // Use Payment from Booking
    // },
    {
      title: "Status Pembayaran",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (_: any, record: any) => record.Payment.status, // Use Payment from Booking
    },
    {
      title: "Aksi",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Tambah Kredensial">
            <Button
              icon={<PlusOutlined />}
              onClick={() => showUploadModal(record.booking_id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Tooltip>
          <Tooltip title="Detail">
            <Button
              icon={<InfoCircleOutlined />}
              onClick={() => showModal(record.booking_id)}
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

  const dataSource = [
    {
      key: "customer_name",
      attribute: "Nama Pelanggan",
      value: selectedRecord?.Order?.customer_name || "N/A",
    },
    {
      key: "no_plat",
      attribute: "No Plat",
      value: selectedRecord?.Order?.Schedule?.Vehicle?.no_plat || "N/A",
    },
    {
      key: "vehicle_name",
      attribute: "Nama Kendaraan",
      value: selectedRecord?.Order?.Schedule?.Vehicle?.name || "N/A",
    },
    {
      key: "vehicle_model",
      attribute: "Model Kendaraan",
      value: selectedRecord?.Order?.Schedule?.Vehicle?.model || "N/A",
    },
    {
      key: "start_date",
      attribute: "Tanggal Mulai",
      value: selectedRecord?.Order
        ? moment(selectedRecord.Order.start_date).format("DD MMMM YYYY")
        : "N/A",
    },
    {
      key: "end_date",
      attribute: "Tanggal Berakhir",
      value: selectedRecord?.Order
        ? moment(selectedRecord.Order.end_date).format("DD MMMM YYYY")
        : "N/A",
    },
    {
      key: "total_price",
      attribute: "Total Harga",
      value: selectedRecord?.Payment
        ? `${new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(selectedRecord.Payment.amount)}`
        : "N/A",
    },
    {
      key: "payment_method",
      attribute: "Metode Pembayaran",
      value: selectedRecord?.Payment?.payment_method || "N/A",
    },
    {
      key: "payment_status",
      attribute: "Status Pembayaran",
      value: selectedRecord?.Payment?.status || "N/A",
    },
    {
      key: "imageUrl",
      attribute: "Foto Kredensial",
      value: selectedRecord?.imageUrl || "N/A",
      render: (imageUrl: any) => {
        return imageUrl !== "N/A" ? (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src={imageUrl}
              alt="Kredensial"
              style={{ width: "100px", height: "auto" }}
            />
          </a>
        ) : (
          "N/A"
        );
      },
    },
  ];

  const columns = [
    {
      title: "Atribut",
      dataIndex: "attribute",
      key: "attribute",
    },
    {
      title: "Nilai",
      dataIndex: "value",
      key: "value",
      render: (text: any, record: any) => {
        if (record.key === "imageUrl" && record.value !== "N/A") {
          return (
            <Image
              src={record.value}
              alt="booking image"
              width={500}
              height={500}
              unoptimized={true}
            />
          );
        }
        return text;
      },
    },
  ];

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <Title level={3}>Data Booking Kendaraan</Title>
      <Divider />
      <Space direction="vertical" style={{ marginBottom: "24px" }}>
        <StatusFilter />
      </Space>
      <Table
        columns={column}
        dataSource={bookings}
        loading={loading}
        rowKey="booking_id"
        onChange={(pagination) => {
          setPagination({
            pageSize: pagination.pageSize || 10,
            current: pagination.current || 1,
          });
        }}
      />
      {selectedRecord && (
        <Modal
          title="Detail Booking"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Kembali
            </Button>,
          ]}
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
          />
        </Modal>
      )}
      {selectedRecord && (
        <Modal
          title="Upload Foto Kredensial"
          visible={isUploadModalVisible}
          onOk={handleUploadModalOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Kembali
            </Button>,
            <Button key="submit" type="primary" onClick={handleUploadModalOk}>
              Upload
            </Button>,
          ]}
        >
          <Form
            form={form}
            name="addCredentialForm"
            initialValues={{ remember: true }}
            onFinish={handleUploadModalOk}
            autoComplete="off"
          >
            <Form.Item
              name="imageUrl"
              valuePropName="fileList"
              getValueFromEvent={({ fileList: newFileList }) => {
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
                accept="image/png, image/jpeg"
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
                      Support untuk single upload. Hanya file PNG, JPEG, dan JPG
                      yang diterima.
                    </p>
                  </div>
                )}
              </Upload.Dragger>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
