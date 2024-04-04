"use client";

import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Select,
  Layout,
  message,
} from "antd";

import { useRouter } from "next/navigation";
import Loading from "../components/loading";

const { Option } = Select;
const { Content } = Layout;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Schedules: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dateFormat = "DD MMMM YYYY";
  const onFinish = async (values: any) => {
    const startDateFormatted = values.startDate.format("YYYY-MM-DD");
    const endDateFormatted = values.endDate.format("YYYY-MM-DD");
    try {
      const queryString = `startDate=${startDateFormatted}&endDate=${endDateFormatted}&capacity=${values.capacity}`;
      router.push(`/vehicles?${queryString}`);

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
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
        }}
      >
        <Form
          {...formItemLayout}
          style={{
            maxWidth: "600px",
            background: "#f7f7f7",
            padding: "20px",
            borderRadius: "8px",
          }}
          onFinish={onFinish}
          variant="filled"
        >
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[
              { required: true, message: "Please select the start date!" },
            ]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true, message: "Please select the end date!" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ required: true, message: "Please input the capacity!" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default Schedules;
