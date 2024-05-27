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
  Steps
} from "antd";
import moment from "moment";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { Footer } from "antd/es/layout/layout";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;
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
  const query = useParams();
  const vehicles_id = query.vehicles_id;
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const apiKey = searchParams.get("apiKey");

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
        amount: invoiceData.total_amount * diffDays,
        currency: "IDR",
        customer: {
          given_names: invoiceData.customer_name,
        },
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
        window.open(result.invoice_url, "_blank");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalVisible(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "20px 50px" }}>
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
        {vehicle ? (
          <>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                {vehicle.VehicleImages && vehicle.VehicleImages.length > 0 ? (
                  <Carousel autoplay>
                    {vehicle.VehicleImages.map((image, index) => (
                      <div key={index}>
                        <Image
                          src={image.imageUrl}
                          alt={`vehicle-${index}`}
                          width={500}
                          height={300}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div>No images available</div>
                )}
              </Col>
              <Col xs={24} md={12}>
                <Card>
                  <Title level={3}>{vehicle.name}</Title>
                  <Paragraph>
                    <strong>Model:</strong> {vehicle.model}
                  </Paragraph>
                  <Paragraph>
                    <strong>Capacity:</strong> {vehicle.capacity} people
                  </Paragraph>
                  <Paragraph>
                    <strong>License Plate:</strong> {vehicle.no_plat}
                  </Paragraph>
                  <Paragraph>
                    <strong>Year:</strong> {vehicle.year}
                  </Paragraph>
                  <Paragraph>
                    Price: Rp
                    {selectedSchedule
                      ? selectedSchedule.price
                      : vehicle.price}{" "}
                    / Hari
                  </Paragraph>
                </Card>
              </Col>
            </Row>
            <Row gutter={24} style={{ marginTop: "24px" }}>
              <Col xs={24} md={12}>
                <Card>
                  <Title level={4}>Book This Vehicle</Title>
                  <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={initialValues}
                  >
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        { required: true, message: "Please enter your name" },
                      ]}
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
                    <Form.Item
                      label="Start Date"
                      name="startDate"
                      rules={[
                        {
                          required: true,
                          message: "Please select a start date",
                        },
                      ]}
                    >
                      <DatePicker />
                    </Form.Item>
                    <Form.Item
                      label="End Date"
                      name="endDate"
                      rules={[
                        {
                          required: true,
                          message: "Please select an end date",
                        },
                      ]}
                    >
                      <DatePicker />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Spin />
        )}
      </Content>
      <Modal
        title="Booking Confirmation"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Proceed to Payment"
      >
        <p>
          Thank you for your booking. Please proceed to payment to confirm your
          booking.
        </p>
      </Modal>
      <Modal
        title="Payment"
        visible={isPaymentModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Pay Now"
      >
        <p>
          Your booking is successful. Click the button below to proceed to
          payment.
        </p>
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
