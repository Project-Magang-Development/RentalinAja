"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Layout, Typography, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

const RegisterDashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const planDetailsString = localStorage.getItem("planDuration");
    const duration = JSON.parse(planDetailsString || "{}");
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        company: values.company,
        domain: values.domain,
        email: values.email,
        password: values.password,
        plan: duration,
      };
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      localStorage.removeItem("planDuration")
      // router.push("/dashboard/login");
      message.success("Registration successful!");
      setLoading(false);
    } catch {
      message.error("Registration failed.");
      setLoading(false);
    }
  };

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Content
        style={{
          padding: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form
          name="register"
          className="register-form"
          onFinish={onFinish}
          style={{ maxWidth: "300px" }}
        >
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            Register
          </Title>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Name"
            />
          </Form.Item>
          <Form.Item
            name="company"
            rules={[{ required: true, message: "Please input your Company!" }]}
          >
            <Input
              prefix={<BankOutlined className="site-form-item-icon" />}
              placeholder="Company"
            />
          </Form.Item>
          <Form.Item
            name="domain"
            rules={[
              { required: true, message: "Please input your Domain Company!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Domain Company"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
                type: "email",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
              block
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default RegisterDashboard;
