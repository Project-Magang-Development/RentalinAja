"use client";

import { useSearchParams } from "next/navigation";
import { Form, Input, Button, Typography, Layout, notification } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

const { Title, Link } = Typography;
const { Content } = Layout;

export default function ConfirmPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      notification.success({
        message: "Password berhasil diubah",
      });

      router.push("/dashboard/login");
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        maxHeight: "100vh",
        minHeight: "100vh",
        overflow: "hidden",
        background: "linear-gradient(135deg, #f0f2f5, #d9e4f1)",
        position: "relative",
      }}
    >
      <img
        src="/icons/buletan 1.svg"
        alt=""
        style={{
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
          objectFit: "cover",
          position: "absolute",
          top: 258,
          right: -20,
          width: 250,
          height: 250,
        }}
      />

      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            maxWidth: 300,
            padding: "40px 20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
            Reset Password
          </Title>
          <Form
            name="reset_password"
            className="reset-password-form"
            initialValues={{ email: email }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "The input is not valid Email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
                style={{
                  border: "none",
                  borderBottom: "1px solid #000",
                  borderRadius: "0",
                  paddingLeft: "0",
                  paddingBottom: "8px",
                }}
                className="custom-input"
                readOnly
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="New Password"
                style={{
                  border: "none",
                  borderBottom: "1px solid #000",
                  borderRadius: "0",
                  paddingLeft: "0",
                  paddingBottom: "8px",
                }}
                className="custom-input"
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your Password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Password Tidak Sama!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm Password"
                style={{
                  border: "none",
                  borderBottom: "1px solid #000",
                  borderRadius: "0",
                  paddingLeft: "0",
                  paddingBottom: "8px",
                }}
                className="custom-input"
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{
                  backgroundColor: "#6B7CFF",
                }}
                type="primary"
                htmlType="submit"
                className="reset-password-form-button"
                block
                loading={loading}
              >
                Reset Password
              </Button>
            </Form.Item>
            <Form.Item>
              <Link
                href="#"
                onClick={() => router.push("/dashboard/login")}
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "16px",
                  color: "#6B7CFF",
                }}
              >
                Kembali Ke Login
              </Link>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}
