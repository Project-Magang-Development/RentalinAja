"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Row,
  Spin,
  Alert,
  Flex,
  Button,
  message,
  Input,
  Form,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  BankOutlined,
  CheckOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Navbar from "@/app/components/Navbar";
import FooterSection from "@/app/components/footer";
import Title from "antd/es/typography/Title";

interface Package {
  package_id: string;
  package_name: string;
  package_price: number;
  package_description: string;
  package_feature: string;
  duration: number;
}

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch packages.");
  }
  return response.json();
};

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[][]>([]);
  const { data: packages, error } = useSWR<Package[]>(
    "/api/showPackage",
    fetcher
  );
  const router = useRouter();

  useEffect(() => {
    if (packages) {
      const featureList = packages.map((pkg) =>
        pkg.package_feature ? pkg.package_feature.split(",") : []
      );
      setFeatures(featureList);
      console.log("Feature List:", featureList); // Logging the feature list
    }
  }, [packages]);

  if (error) {
    return <Alert message="Error loading packages!" type="error" showIcon />;
  }

  if (!packages) {
    return (
      <Spin size="large" tip="Loading Packages...">
        <Row gutter={16} style={{ minHeight: "200px" }} />
      </Spin>
    );
  }

  const handleCardClick = (packageId: string) => {
    try {
      setLoading(true);
      router.push(`/home/register?package=${packageId}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error(" Terjadi kesalahan saat memilih paket");
    }
  };

  function onFinish(values: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Navbar />
      <Flex align="center" vertical>
        <h1 style={{ fontSize: "25px", color: "#6B7CFF", fontWeight: "bold" }}>
          Pilihan Paket Untuk Anda
        </h1>
        <p
          style={{
            fontSize: "15px",
            textAlign: "center",
            width: "50%",
            marginBlock: "1rem",
          }}
        >
          Temukan paket sempurna untuk kebutuhan Anda dengan opsi harga yang
          terjangkau. Temukan harga bersaing dan dapatkan nilai luar biasa yang
          kami tawarkan pada layanan terbaik kami.
        </p>
        <Flex
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {packages.map((pkg, index) => (
            <Flex
              vertical
              justify="end"
              gap={40}
              align="center"
              key={pkg.package_id}
              style={{
                margin: "1rem",
                padding: "2rem",
                width: "320px",
                height: "auto",
                borderRadius: "15px",
                WebkitBoxShadow: "-39px 16px 79px -1px rgba(0,0,0,0.14)",
                MozBoxShadow: "-39px 16px 79px -1px rgba(0,0,0,0.14)",
                boxShadow: "-39px 16px 79px -1px rgba(0,0,0,0.14)",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                maxWidth: "100%",
                transition: "border 0.1s", // Transisi untuk efek hover
                border: "2px solid transparent", // Set default border
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "2px solid #6B7CFF"; // Ubah warna border saat hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "2px solid transparent"; // Kembalikan warna border saat tidak dihover
              }}
            >
              <Flex vertical>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p style={{ fontSize: "17px", fontWeight: "bold" }}>
                    {pkg.package_name}
                  </p>
                  <p style={{ marginTop: "0.1rem", fontSize: "15px" }}>
                    {pkg.duration} Months
                  </p>
                </div>
                <div style={{ marginTop: "0.5rem" }}>
                  <p style={{ fontSize: "25px", fontWeight: "bold" }}>
                    Rp {pkg.package_price.toLocaleString()}
                  </p>
                  <p style={{ color: "gray" }}>/bulan</p>
                </div>
                <p
                  style={{
                    marginTop: "20px",
                    textAlign: "justify",
                    fontSize: "13px",
                  }}
                >
                  {pkg.package_description}
                </p>
                <ul style={{ marginTop: "0.2rem" }}>
                  {features[index]?.length > 0 ? (
                    features[index].map((feature, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "0.6rem",
                        }}
                      >
                        <CheckOutlined
                          style={{
                            marginRight: "5px",
                            color: "#6B7CFF",
                          }}
                        />
                        {feature.trim()}
                      </li>
                    ))
                  ) : (
                    <li>Tidak ada fitur yang tersedia</li>
                  )}
                </ul>
              </Flex>
              <Flex style={{ width: "100%" }}>
                <Button
                  onClick={() => handleCardClick(pkg.package_id.toString())}
                  loading={loading}
                  block
                  size="large"
                  style={{
                    backgroundColor: "#6B7CFF",
                    color: "white",
                  }}
                >
                  Daftar Sekarang
                </Button>
              </Flex>
            </Flex>
          ))}
        </Flex>
        <Flex
          justify="center"
          align="center"
          style={{
            marginTop: "2rem",
            padding: "5rem",
            paddingInline: "8rem",
            position: "relative",
            width: "100%",
            height: "auto",
          }}
        >
          <Flex
            style={{ position: "relative", width: "100%", height: "30rem" }}
          >
            {/* Gambar */}
            <img
              style={{
                objectFit: "cover",
                borderRadius: "20px",
                width: "100%",

                height: "100%",
              }}
              src="/image/freeTrial.png"
              alt=""
            />
            {/* Div dengan form di dalamnya */}
            <Flex
              vertical
              style={{
                position: "absolute",
                top: 0,
                left: -240,
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Form
                layout="vertical"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  padding: "10px",
                  borderRadius: "20px",
                  maxWidth: "400px",
                }}
                name="basic"
                onFinish={onFinish}
              >
                <Title
                  level={3}
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  Dapatkan Uji Coba Gratis Sekarang!
                </Title>
                <Form.Item
                  style={{ padding: "0" }}
                  label="Nama Lengkap"
                  name="fullName"
                  rules={[
                    { required: true, message: "Masukkan Nama Lengkap Anda!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Masukkan Nama Lengkap Anda"
                  />
                </Form.Item>

                <Form.Item
                  required={true}
                  label="Nama Perusahaan"
                  name="companyName"
                >
                  <Input
                    prefix={<BankOutlined />}
                    placeholder="Masukkan Nama Perusahaan Anda"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Masukkan Email Anda!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Masukkan Email Anda"
                  />
                </Form.Item>

                <Form.Item label="Nomor Telepon" name="phone">
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Masukkan Nomor Telepon Anda"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: "100%",
                      backgroundColor: "#1D2130",
                      fontWeight: "bold",
                    }}
                  >
                    Kirim Permintaan
                  </Button>
                </Form.Item>
              </Form>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <FooterSection />
    </>
  );
};

export default Home;
