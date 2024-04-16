"use client";

import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, InputNumber, Layout, message } from "antd";
import Loading from "../components/loading";
import moment, { Moment } from "moment";

const { Content } = Layout;

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

  // useEffect(() => {
  //   // Mencari script tag dengan src yang sesuai atau bisa juga dengan atribut khusus
  //   const scriptTag = document.querySelector("script[apiKey]");
  //   const apiKeyFromTag = scriptTag ? scriptTag.getAttribute("apiKey") : null;

  //   if (apiKeyFromTag) {
  //     setApiKey(apiKeyFromTag);
  //     console.log("API Key retrieved:", apiKeyFromTag);
  //   } else {
  //     console.log("API Key not found in script tag.");
  //   }
  // }, []);

  // useEffect(() => {
  //   const apiKey = process.env.API_KEY;

  //   if (apiKey) {
  //     setApiKey(apiKey);
  //   } else {
  //     console.log("API Key not found.");
  //   }
  // }, []);

  const handleFinish = async (values: FormValues) => {
    const startDateFormatted = values.startDate.format("YYYY-MM-DD");
    const endDateFormatted = values.endDate.format("YYYY-MM-DD");
    try {
      const queryString = `startDate=${startDateFormatted}&endDate=${endDateFormatted}&capacity=${values.capacity}&apiKey=${apiKey}`;
      window.location.href = `http://localhost:3000/vehicles?${queryString}`;
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
    <Content
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        {...formItemLayout}
        style={{
          background: "#f7f7f7",
          padding: "20px",
          borderRadius: "8px",
        }}
        onFinish={handleFinish}
        variant="filled"
      >
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select the start date!" }]}
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
        <h1
          style={{
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.5)",
            fontWeight: "normal",
            fontSize: "1rem",
            marginTop: "20px",
          }}
        >
          Powered By RentalinAja
        </h1>
      </Form>
    </Content>
  );
};

export default Schedules;
