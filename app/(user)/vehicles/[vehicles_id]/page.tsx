"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Form,
  DatePicker,
  Image,
  Button,
  Input,
  notification,
  Modal,
  Spin,
  Carousel,
  Card,
  Steps,
  Flex,
  Divider,
} from "antd";
import moment from "moment";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;
const { Content, Footer } = Layout;
const { Step } = Steps;

interface Vehicle {
  vehicles_id: string;
  name: string;
  capacity: number;
  price: number;
  VehicleImages: VehicleImage[];
  model: string;
  no_plat: string;
  year: number;
  Schedules?: Schedule[];
}

interface VehicleImage {
  imageUrl: string;
}

interface Schedule {
  merchant_id: string;
  schedules_id: number;
  start_date: string;
  end_date: string;
  price: number;
}

interface InvoiceData {
  order_id: number;
  customer_name: string;
  start_date: Date;
  end_date: Date;
  customer_phone: string;
  total_amount: number;
  external_id?: string;
}

export default function DetailVehiclePage() {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const query = useParams();
  const vehicles_id = query.vehicles_id;
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const apiKey = searchParams.get("apiKey");
  const tax = 5000;

  const getDetailVehicle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vehicle/detail/${vehicles_id}`, {
        headers: {
          method: "GET",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicle details");
      }

      const data = await response.json();
      if (data.Schedules && data.Schedules.length > 0) {
        setSelectedSchedule(data.Schedules[0]);
      }
      setVehicle(data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to load vehicle details.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicles_id) {
      getDetailVehicle();
    }
  }, [vehicles_id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInitialValues({
        startDate: startDate ? moment(startDate) : moment(),
        endDate: endDate ? moment(endDate) : moment(),
      });
    }
  }, [startDate, endDate]);

  const startDateInDate = startDate ? new Date(startDate) : null;
  const endDateInDate = endDate ? new Date(endDate) : null;

  if (
    (startDateInDate && isNaN(startDateInDate.getTime())) ||
    (endDateInDate && isNaN(endDateInDate.getTime()))
  ) {
    console.error("Invalid date format");
    return null;
  }

  const diffTime = Math.abs(
    endDateInDate!.getTime() - startDateInDate!.getTime()
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const createInvoice = async (
    invoiceData: any,
    externalId: string
  ): Promise<any> => {
    try {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

      if (!secretKey) {
        throw Error("tidak ada API Key xendit");
      }

      const endpoint = "https://api.xendit.co/v2/invoices";
      const basicAuthHeader = `Basic ${btoa(secretKey + ":")}`;

      const payload = {
        external_id: externalId,
        amount: invoiceData.total_amount * diffDays + tax,
        currency: "IDR",
        customer: {
          given_names: invoiceData.customer_name,
        },
        success_redirect_url: "http://localhost:3000/vehicles/success",
        fees: [
          {
            type: "ADMIN",
            value: tax,
          },
        ],
      };

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: basicAuthHeader,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const { invoice_url, id } = response.data;
        console.log(response.data);

        return { id_invoice: id, invoice_url, external_id: externalId };
      } else {
        console.error("Gagal membuat invoice");
        console.log(response.data);
        return { id_invoice: null, external_id: null };
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      return { id_invoice: null, external_id: null };
    }
  };

  const onFinish = async (values: any) => {
    if (!selectedSchedule) {
      notification.error({
        message: "Submission Error",
        description: "No schedule has been selected.",
      });
      return;
    }

    try {
      setLoading(true);

      const externalId = "INV-" + Math.random().toString(36).substring(2, 9);

      const startDateFormat = moment(startDate, "YYYY-MM-DD");
      const endDateFormat = moment(endDate, "YYYY-MM-DD");

      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: values.name,
          start_date: startDateFormat!.format("YYYY-MM-DD"),
          end_date: endDateFormat!.format("YYYY-MM-DD"),
          schedules_id: selectedSchedule.schedules_id,
          price: selectedSchedule.price,
          phone: values.phone,
          external_id: externalId,
          apiKey,
        }),
      });

      if (!response.ok) {
        console.log("harga kendaraan", vehicle?.price);
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      const newData = {
        ...data,
        order_id: data.order_id || Math.floor(Math.random() * 1000000),
        total_amount: selectedSchedule.price,
        external_id: externalId,
      };

      const result = await createInvoice(newData, externalId);
      console.log(result);

      notification.success({
        message: "Order Successful",
        description: "Your order has been successfully created.",
        duration: 5,
      });

      setIsPaymentModalVisible(true);
      setInvoiceData(newData);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Order Failed",
        description: "Something went wrong. Please try again later.",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsPaymentModalVisible(false);
    setIsBookingModalVisible(false);
  };

  const handleOk = async () => {
    try {
      if (!invoiceData) {
        console.error("Invoice data is not available");
        return;
      }

      const externalId =
        invoiceData.external_id ||
        "INV-" + Math.random().toString(36).substring(2, 9);
      invoiceData.external_id = externalId;

      const result = await createInvoice(invoiceData, externalId);
      console.log(result);

      if (result && result.invoice_url) {
        window.location.href = result.invoice_url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const showBookingModal = () => {
    setIsBookingModalVisible(true);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          padding: "20px 50px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Steps
            current={2}
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <Step title="Select Date" />
            <Step title="Select Vehicle" />
            <Step title="Fill Personal Data & Payment" />
            <Step title="Done" />
          </Steps>
        </Row>
        <Title level={2} style={{ textAlign: "center", color: "#6B7CFF" }}>
          Vehicle Details
        </Title>
        {vehicle ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={15}>
                  {vehicle.VehicleImages && vehicle.VehicleImages.length > 0 ? (
                    <Card
                      style={{
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        flex: "0 0 auto",
                      }}
                    >
                      <Carousel autoplay>
                        {vehicle.VehicleImages.map((image, index) => (
                          <div key={index}>
                            <Image
                              src={image.imageUrl}
                              alt={`vehicle-${index}`}
                              width={900}
                              height={500}
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </Card>
                  ) : (
                    <div>No images available</div>
                  )}
                </Col>
                <Col xs={24} md={9}>
                  <div style={{ marginBottom: "20px" }}>
                    <Row
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        overflowX: "auto",
                      }}
                    >
                      {vehicle.VehicleImages.map((image, index) => (
                        <div
                          key={index}
                          style={{ flex: "0 0 auto", marginRight: "10px" }}
                        >
                          <Card
                            style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                          >
                            <Image
                              src={image.imageUrl}
                              alt={`vehicle-${index}`}
                              width={250}
                              height={150}
                              style={{ objectFit: "cover" }}
                            />
                          </Card>
                        </div>
                      ))}
                    </Row>
                  </div>
                  <Card
                    style={{
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      padding: "20px",
                      backgroundColor: "#fff",
                      marginBottom: "px",
                      flex: "1 1 auto",
                    }}
                  >
                    <Title
                      level={4}
                      style={{ color: "#1F1F1F", marginBottom: "20px" }}
                    >
                      {vehicle.name}
                    </Title>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: "10px" }}>
                        <Text style={{ color: "#888" }}>Model: </Text>
                        <Text strong style={{ color: "#1F1F1F" }}>
                          {vehicle.model}
                        </Text>
                      </div>
                      <div style={{ flex: 1, paddingLeft: "10px" }}>
                        <Text style={{ color: "#888" }}>Kapasitas: </Text>
                        <Text strong style={{ color: "#1F1F1F" }}>
                          {vehicle.capacity} Orang
                        </Text>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: "10px" }}>
                        <Text style={{ color: "#888" }}>Tahun: </Text>
                        <Text strong style={{ color: "#1F1F1F" }}>
                          {vehicle.year}
                        </Text>
                      </div>
                      <div style={{ flex: 1, paddingLeft: "10px" }}>
                        <Text style={{ color: "#888" }}>Plat: </Text>
                        <Text strong style={{ color: "#1F1F1F" }}>
                          {vehicle.no_plat}
                        </Text>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Row style={{ display: "flex", alignItems: "center" }}>
                        {selectedSchedule?.price && (
                          <>
                            <Title
                              level={3}
                              style={{
                                margin: 0,
                                fontWeight: "bold",
                                color: "#333",
                              }}
                            >
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(selectedSchedule.price)}
                            </Title>
                            <Title
                              level={5}
                              style={{
                                color: "grey",
                                margin: 0,
                                marginLeft: 5,
                              }}
                            >
                              /day
                            </Title>
                          </>
                        )}
                      </Row>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#6B7CFF",
                          borderColor: "#6B7CFF",
                          borderRadius: "5px",
                          width: "100px",
                          height: "40px",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                        onClick={showBookingModal}
                      >
                        Order
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </>
        ) : (
          <Spin />
        )}
      </Content>
      <Modal
        title="Fill in the following personal data for rental"
        visible={isBookingModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please enter your phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={isPaymentModalVisible}
        title="Payment Details"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            style={{
              backgroundColor: "#6B7CFF",
              borderColor: "#6B7CFF",
            }}
          >
            Proceed to Payment
          </Button>,
        ]}
      >
        {invoiceData ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <Card
              style={{
                width: "1200px", // Increased width
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Title
                level={3}
                style={{ textAlign: "center", color: "#6B7CFF" }}
              >
                Detail Invoice
              </Title>
              <Text
                style={{
                  textAlign: "center",
                  display: "block",
                  marginBottom: "20px",
                  color: "#B0B3B8",
                }}
              >
                Check Your Rental Details!
              </Text>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text strong>Invoice to:</Text>
                  <Paragraph>{invoiceData.customer_name}</Paragraph>
                  <Paragraph>{invoiceData.customer_phone}</Paragraph>
                </Col>
                <Col span={8}>
                  <Text strong>Date:</Text>
                  <Paragraph>
                    {moment(startDate).format("DD MMM YYYY")} -{" "}
                    {moment(endDate).format("DD MMM YYYY")}
                  </Paragraph>
                </Col>
                <Col span={8}>
                  <Text strong>Order ID:</Text>
                  <Paragraph>{invoiceData.order_id}</Paragraph>
                </Col>
              </Row>
              <Divider />
              <Row
                style={{
                  backgroundColor: "#F0F4FF",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <Col span={12}>
                  <Text strong>Rent</Text>
                </Col>
                <Col span={4}>
                  <Text strong>Price</Text>
                </Col>
                <Col span={4}>
                  <Text strong>Day</Text>
                </Col>
                <Col span={4}>
                  <Text strong>Total</Text>
                </Col>
              </Row>
              <Row
                style={{ padding: "10px", borderBottom: "1px solid #E0E0E0" }}
              >
                <Col span={12}>
                  <Text>{vehicle?.name}</Text>
                </Col>
                <Col span={4}>
                  <Text>Rp {selectedSchedule?.price.toLocaleString()}</Text>
                </Col>
                <Col span={4}>
                  <Text>{diffDays}</Text>
                </Col>
                <Col span={4}>
                  <Text>
                    Rp {(invoiceData.total_amount * diffDays).toLocaleString()}
                  </Text>
                </Col>
              </Row>
              <Row justify="end" style={{ marginTop: "20px" }}>
                <Col span={12}>
                  <Paragraph style={{ textAlign: "right" }}>
                    TAX: Rp {tax.toLocaleString()}
                  </Paragraph>
                  <Divider />
                  <Paragraph strong style={{ textAlign: "right" }}>
                    Invoice total: Rp{" "}
                    {(
                      invoiceData.total_amount * diffDays +
                      tax
                    ).toLocaleString()}
                  </Paragraph>
                </Col>
              </Row>
            </Card>
          </div>
        ) : (
          <Spin />
        )}
      </Modal>
      <Footer>
        <h1
          style={{
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.5)",
            fontWeight: "normal",
            fontSize: "1rem",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Powered By
          <Image
            src="/logo.png"
            alt="Vercel Logo"
            width={120}
            height={30}
            style={{ marginLeft: "8px" }}
          />
        </h1>
      </Footer>
    </Layout>
  );
}
