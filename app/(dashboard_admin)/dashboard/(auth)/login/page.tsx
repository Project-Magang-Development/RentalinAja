"use client";

import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Layout,
  Space,
  Typography,
  message,
  notification,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const { Content } = Layout;
const { Title } = Typography;

export default function LoginDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/login_admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (response.status === 403) {
          notification.error({
            message: "Masa Langganan Sudah Habis",
            description: (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="link" onClick={() => router.push("/home/renew")}>
                  Perpanjang Langganan
                </Button>
              </div>
            ),
            duration: 2,
          });
        } else if (response.status === 404) {
          notification.error({
            message: "Email Tidak Terdaftar",
          });
        } else {
          notification.error({
            message: `Error: ${errorMessage}`,
          });
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      Cookies.set("token", data.token, { expires: 1 });
      notification.success({
        message: "Login Berhasil!",
      });
      setLoading(false);
      window.location.href = "/dashboard";
    } catch (error) {
      notification.error({
        message: "Login failed.",
      });
    }
  };

  return (
    <Layout
      style={{
        maxHeight: "100vh",
        minHeight: "100vh",
        overflow: "hidden",
        overflowY: "hidden",
      }}
    >
      <img
        src="/icons/buletan 1.svg"
        alt=""
        style={{
          objectFit: "fill",
          position: "absolute",
          top: 50,
          right: 1000,
          width: 450,
          height: 450,
        }}
      />
      <img
        src="/icons/buletan 2.svg"
        alt=""
        style={{
          position: "absolute",
          top: -10,
          right: -20,
          width: 250,
          height: 250,
        }}
      />
      <img
        src="/icons/panah3.svg"
        alt=""
        style={{
          position: "absolute",
          bottom: 0,
          right: -10,
        }}
      />

      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 300 }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
            Admin Login
          </Title>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                style={{
                  border: "none",
                  borderBottom: "1px solid #000",
                  borderRadius: "0",
                  paddingLeft: "0",
                }}
                className="custom-input"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                style={{
                  border: "none",
                  borderBottom: "1px solid #000",
                  borderRadius: "0",
                  paddingLeft: "0",
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ backgroundColor: "#6B7CFF" }}
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}
