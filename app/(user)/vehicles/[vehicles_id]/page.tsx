"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Input,
  notification,
  Modal
} from "antd";
import moment from "moment";
import { useParams } from "next/navigation";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

interface Vehicle {
  vehicles_id: number;
  name: string;
  capacity: number;
  price: number;
  imageUrl: string;
}

interface Schedule {
  schedules_id: number;
  merchant_id: number;
  start_date: string;
  end_date: string;
  Vehicle: Vehicle;
  price: number;
}

interface InvoiceData {
  booking_id: number;
  customer_name: string;
  start_date: Date;
  end_date: Date;
  total_amount: number;
}

export default function DetailVehiclePage() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const query = useParams();
  const vehicles_id = query.vehicles_id;

  useEffect(() => {
    const storedData = sessionStorage.getItem("schedules");
    if (storedData) {
      const schedules = JSON.parse(storedData);
      const foundSchedule = schedules.find(
        (sch: Schedule) =>
          sch.Vehicle.vehicles_id === parseInt(vehicles_id as string, 10)
      );
      setSchedule(foundSchedule);
      sessionStorage.removeItem("schedules");
    }
  }, [vehicles_id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedStartDate = sessionStorage.getItem("startDate");
      const storedEndDate = sessionStorage.getItem("endDate");

      setInitialValues({
        startDate: storedStartDate ? moment(storedStartDate) : undefined,
        endDate: storedEndDate ? moment(storedEndDate) : undefined,
      });
    }
  }, []);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: values.name,
          start_date: values.startDate.format("YYYY-MM-DD"),
          end_date: values.endDate.format("YYYY-MM-DD"),
          schedules_id: schedule?.schedules_id,
          merchant_id: schedule?.merchant_id,
          price: schedule?.price,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const randomBookingId = Math.floor(Math.random() * 1000000);
      const newData = { ...data, booking_id: randomBookingId };

      notification.success({
        message: "Booking Successful",
        description: "Your booking has been successfully created.",
        duration: 5, 
      });

      setIsModalVisible(true);

      sessionStorage.removeItem("startDate");
      sessionStorage.removeItem("endDate");
      setInvoiceData(newData);

      setLoading(false);
    } catch (error) {
      notification.error({
        message: "Booking Failed",
        description:
        "Something went wrong. Please try again later.",
        duration: 5,
      });
    }
  };

  const dateFormat = "DD MMMM YYYY"; 
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        {schedule ? (
          <>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <img
                  src={schedule.Vehicle.imageUrl || "/default_image.jpg"}
                  alt={schedule.Vehicle.name}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "24px",
                  }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Title>{schedule.Vehicle.name}</Title>
                <Paragraph>Capacity: {schedule.Vehicle.capacity}</Paragraph>
                <Paragraph>
                  Price: Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(schedule.price)} / Hari
                </Paragraph>
                <Form
                  onFinish={onFinish}
                  layout="vertical"
                  initialValues={initialValues}
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      { required: true, message: "Please input your name!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[
                      { required: true, message: "Please select start date!" },
                    ]}
                    style={{ display: "none" }} // Menyembunyikan Form.Item
                  >
                    <DatePicker format={dateFormat} />
                  </Form.Item>
                  <Form.Item
                    label="End Date"
                    name="endDate"
                    rules={[
                      { required: true, message: "Please select end date!" },
                    ]}
                    style={{ display: "none" }} // Menyembunyikan Form.Item
                  >
                    <DatePicker format={dateFormat} />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                  </Button>
                </Form>
              </Col>
            </Row>
            <Modal
              title="Invoice Details"
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Return
                </Button>,
                <Button key="submit" onClick={handleOk}>
                  Payment
                </Button>,
              ]}
            >
              {invoiceData && (
                <>
                  <Paragraph>
                    <strong>Booking ID:</strong> {invoiceData.booking_id}
                  </Paragraph>
                  <Paragraph>
                    <strong>Name:</strong> {invoiceData.customer_name}
                  </Paragraph>
                  <Paragraph>
                    <strong>Start Date:</strong>{" "}
                    {moment(invoiceData.start_date).format("DD MMMM YYYY")}
                  </Paragraph>
                  <Paragraph>
                    <strong>End Date:</strong>{" "}
                    {moment(invoiceData.end_date).format("DD MMMM YYYY")}
                  </Paragraph>
                  <Paragraph>
                    <strong>Total Amount:</strong> Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      invoiceData.total_amount
                    )}
                  </Paragraph>
                </>
              )}
            </Modal>
          </>
        ) : (
          <Title>Vehicle not found</Title>
        )}
      </Content>
    </Layout>
  );
}
