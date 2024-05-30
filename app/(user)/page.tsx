"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Layout,
  Row,
  message,
  Steps,
  Input,
} from "antd";
import Image from "next/image";
import Loading from "../components/loading";
import moment, { Moment } from "moment";

const { Content } = Layout;
const { Step } = Steps;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface FormValues {
  startDate: Moment;
  endDate: Moment;
  capacity: number;
}

const Schedules: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const dateFormat = "DD MMMM YYYY";

  useEffect(() => {
    const key = document
      .querySelector("script[apiKey]")
      ?.getAttribute("apiKey");
    if (key) {
      setApiKey(key);
    }
  }, []);

  const handleFinish = async (values: FormValues) => {
    const startDateFormatted = values.startDate.format("YYYY-MM-DD");
    const endDateFormatted = values.endDate.format("YYYY-MM-DD");
    try {
      const queryString = `startDate=${startDateFormatted}&endDate=${endDateFormatted}&capacity=${values.capacity}&apiKey=${apiKey}`;
      window.location.href = `/vehicles?${queryString}`;
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      message.error("Search failed.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Content>
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "900px",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form
            onFinish={handleFinish}
            style={{
              width: "100%",
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
                size="small"
                current={0}
                style={{ marginBottom: "20px", backgroundColor: "##6B7CFF" }}
              >
                <Step title="Select Date" />
                <Step title="Select Vehicle" />
                <Step title="Fill Personal Data & Payment" />
                <Step title="Done" />
              </Steps>
            </Row>
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: "Please select the start date!",
                  },
                ]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ flex: "1 1 30%" }}
              >
                <DatePicker
                  format={dateFormat}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #d9d9d9",
                  }}
                  placeholder="Select Date"
                />
              </Form.Item>

              <Form.Item
                label="End Date"
                name="endDate"
                rules={[
                  { required: true, message: "Please select the end date!" },
                ]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ flex: "1 1 30%" }}
              >
                <DatePicker
                  format={dateFormat}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #d9d9d9",
                  }}
                  placeholder="Select Date"
                />
              </Form.Item>

              <Form.Item
                label="Capacity"
                name="capacity"
                rules={[
                  { required: true, message: "Please input the capacity!" },
                ]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ flex: "1 1 30%" }}
              >
                <Input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #d9d9d9",
                  }}
                  placeholder="Capacity"
                />
              </Form.Item>
            </div>

            <Form.Item
              wrapperCol={{ span: 24 }}
              style={{ textAlign: "center" }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#6B7CFF",
                  borderColor: "#6B7CFF",
                  padding: "10px 0",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                Order Now
              </Button>
            </Form.Item>

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
          </Form>
        </div>
      </Row>
    </Content>
  );
};

export default Schedules;
