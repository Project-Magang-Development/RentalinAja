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
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

const { Title, Paragraph } = Typography;
const { Content } = Layout;


interface Vehicle {
  vehicles_id: string;
  name: string;
  capacity: number;
  price: number;
  imageUrl: string;
  model: string;
  no_plat: string;
  year: number;
  Schedules?: Schedule[];
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
  const query = useParams();
  const vehicles_id = query.vehicles_id;
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

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

      const tokenMerchant = Cookies.get("token");

      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: values.name,
          start_date: values.startDate.format("YYYY-MM-DD"),
          end_date: values.endDate.format("YYYY-MM-DD"),
          schedules_id: selectedSchedule.schedules_id,
          merchant_id: selectedSchedule.merchant_id,
          price: selectedSchedule.price,
          token: tokenMerchant,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const newData = {
        ...data,
        order_id: data.order_id || Math.floor(Math.random() * 1000000), // Use server-generated ID if available
      };

      notification.success({
        message: "Order Successful",
        description: "Your order has been successfully created.",
        duration: 5,
      });

      setIsModalVisible(true);
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
        {vehicle ? (
          <>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Image
                  src={vehicle.imageUrl}
                  alt="vehicle"
                  width={500}
                  height={300}
                  layout="responsive"
                />
              </Col>
              <Col xs={24} md={12}>
                <Title>{vehicle.name}</Title>
                <Paragraph>Capacity: {vehicle.capacity}</Paragraph>
                <Paragraph>
                  Price: Rp
                  {selectedSchedule
                    ? new Intl.NumberFormat("id-ID").format(
                        selectedSchedule.price
                      )
                    : ")" 
                  }
                  / Hari
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
                    style={{ display: "none" }}
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
                    <strong>Order ID:</strong> {invoiceData.order_id}
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
