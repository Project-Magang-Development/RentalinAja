"use client";

import React from "react";
import { Layout, Row, Col, Card, Typography, Button, Steps, Flex } from "antd";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircleFilled, LeftOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Navbar from "@/app/components/Navbar";
import FooterSection from "@/app/components/footer";
import Link from "next/link";

const { Content, Footer } = Layout;
const { Step } = Steps;

const SuccesPage = () => {
  return (
    <div style={{ zIndex: 2 }}>
      <img
        src="/waves/wave7.svg"
        alt=""
        style={{
          position: "absolute",
          bottom: "-380px",
          left: 0,
          width: "100%",
          zIndex: 1,
        }}
      />
      <Navbar />
      <Layout
        style={{
          minHeight: "100vh",
          position: "relative",
          backgroundColor: "white",
        }}
      >
        <Content
          style={{
            padding: "20px 50px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              position: "relative",

              textAlign: "center",
              width: "100%",
            }}
          >
            <Flex align="center" justify="center">
              <Flex vertical>
                <div style={{ textAlign: "center" }}>
                  <CheckCircleFilled
                    style={{ fontSize: "80px", color: "#6B7CFF" }}
                  />
                </div>
                <Title
                  level={2}
                  style={{
                    color: "#6B7CFF",
                    margin: 0,
                    marginTop: 30,
                    textAlign: "center",
                  }}
                >
                  Pendaftaran Berhasil
                </Title>
                <Title
                  level={5}
                  style={{
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  Terima kasih telah mendaftarkan Rental Anda
                </Title>
                <Link href="/home">
                  <Button
                    style={{ backgroundColor: "#6B7CFF", color: "white" }}
                    icon={<LeftOutlined />}
                  >
                    Halaman Utama
                  </Button>
                </Link>
              </Flex>

              <img
                src="/image/success.png"
                alt=""
                width={400}
                style={{ zIndex: 1 }}
              />
            </Flex>
          </div>
        </Content>
        <FooterSection />
      </Layout>
    </div>
  );
};

export default SuccesPage;
