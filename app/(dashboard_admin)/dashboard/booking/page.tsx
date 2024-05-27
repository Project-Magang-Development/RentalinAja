"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Image,
  notification,
  Flex,
  Input,
} from "antd";
import moment from "moment";
import Title from "antd/es/typography/Title";
import TableSkeleton from "@/app/components/tableSkeleton";
import {
  IdcardTwoTone,
  InboxOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import useSWR from "swr";
import Cookies from 'js-cookie';

interface Booking {
  booking_id: string;
  merchant_id: string;
  imageUrl: string;
  Order: Order;
  Payment: Payment;
}

interface Payment {
  payment_id: string;
  amount: number;
  payment_method: string;
  status: string;
}

interface Order {
  order_id: string;
  merchant_id: string;
  vehicles_id: string;
  start_date: string;
  end_date: string;
  customer_name: string;
  price: number;
  status: string;
  customer_phone: string;
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

export default function AdminBookingDashboard() {
  const [filterStatus, setFilterStatus] = useState<string>("");
   const { data: bookings, error, mutate } = useSWR<Booking[]>(
     `/api/booking/show?status=${filterStatus}`,
     fetcher
   );
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Booking | null>(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [searchText, setSearchText] = useState("");



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
    const booking = bookings?.find((b: any) => b.booking_id === booking_id);
    if (booking) {
      setSelectedRecord(booking);
      setIsModalVisible(true);
    } else {
      message.error("Booking not found");
    }
  };

  const showUploadModal = (booking_id: number) => {
    const booking = bookings?.find((b: any) => b.booking_id === booking_id);
    if (booking) {
      setSelectedRecord(booking);
      setIsUploadModalVisible(true);
    } else {
      message.error("Booking not found");
    }
  };

  function calculateTotalFileSize(files: any[]) {
    return files.reduce((total: number, file: any) => {
      if (file.url && file.url.startsWith("data:image")) {
        const base64String = file.url.replace(/^data:image\/\w+;base64,/, "");
        const sizeInBytes =
          (base64String.length * 3) / 4 -
          (base64String.endsWith("==")
            ? 2
            : base64String.endsWith("=")
            ? 1
            : 0);
        const sizeInMB = sizeInBytes / 1024 / 1024;
        return total + sizeInMB;
      }
      return total;
    }, 0);
  }

  const handleUploadModalOk = async () => {
    const imageUrl = fileList.length > 0 ? fileList[0].url : "";
     const storageSize = calculateTotalFileSize(fileList);
    const payload = {
      imageUrl,
      storageSize
    };
    try {
      const token = Cookies.get("token");
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

        mutate();
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

  const hasImage = () => {
    return bookings?.some(
      (booking) => booking.imageUrl && booking.imageUrl.trim() !== ""
    );
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
      title: "No. Telp Pelanggan",
      dataIndex: "customer_phone",
      key: "customer_phone",
      render: (text: any, record: any) =>
        record?.Order?.customer_phone || "Data tidak tersedia",
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
        }).format(record.Payment.amount);
        return formattedPrice;
      },
    },
    {
      title: "Status Pembayaran",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (_: any, record: any) => {
        const status = record.Payment.status;
        let backgroundColor = "gray";
        let textColor = "#FFFFFF";
        if (status === "PAID") {
          textColor = "#00B69B";
          backgroundColor = "#CCF0EB";
        }
        return (
          <div
            style={{
              backgroundColor,
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
    {
      title: "Aksi",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip
            title={
              hasImage()
                ? "Foto Kredensial Sudah Di Upload"
                : "Foto Kredensial Belum Di Upload"
            }
          >
            <Button
              icon={
                hasImage() ? (
                  <IdcardTwoTone />
                ) : (
                  <IdcardTwoTone twoToneColor="#D9D9D9" />
                )
              }
              onClick={() => showUploadModal(record.booking_id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: hasImage() ? undefined : "#D9D9D9",
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
      key: "customer_phone",
      attribute: "No. Telp Pelanggan",
      value: selectedRecord?.Order?.customer_phone || "N/A",
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
          <Image src={imageUrl} alt="Kredensial" width={10} height={10} />
        ) : (
          "Belum Di Upload"
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
              width={150}
              height={100}
            />
          );
        }
        return text;
      },
    },
  ];

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const filteredBooking = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter(
      (booking: any) =>
        booking.Order?.customer_name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        booking.Order?.Schedule?.Vehicle?.no_plat
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        booking.Order?.Schedule?.Vehicle?.name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        booking.Order.start_date.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.Order.end_date.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.Payement?.status.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.Payment?.amount.toString().includes(searchText)
    );
  }, [bookings, searchText]);

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <Title level={3}>Data Booking Kendaraan</Title>
      <Divider />
      <Flex justify="end">
        {/* <Space direction="vertical" style={{ marginBottom: "24px" }}>
          <StatusFilter />
        </Space> */}
        <Input
          placeholder="Cari Booking."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "50%", height: "35px", marginBottom: "24px" }}
        />
      </Flex>
      <Table
        columns={column}
        dataSource={filteredBooking.map((booking: any, index: any) => ({
          ...booking,
          index,
          key: booking.booking_id,
        }))}
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
