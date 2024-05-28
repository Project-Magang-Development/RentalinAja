"use client";

import React from "react";
import { Layout, Row, Col, Typography, Button, Input, Card, Flex } from "antd";
import Image from "next/image";
import YouTubeEmbed from "@/app/components/youtubeEmbed";
import RadialBlur from "@/app/components/radialBlur";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const RentalInfo = [
  {
    imgSrc: "/icons/3user.svg",
    percentage: "99%",
    description: "Kepuasan pengguna",
  },
  {
    imgSrc: "/icons/unduh.svg",
    percentage: "30K",
    description: "Total berlangganan",
  },
  {
    imgSrc: "/icons/2user.svg",
    percentage: "10K",
    description: "Pengguna baru perbulan",
  },
];

const featureSection = [
  {
    icon: "/icons/feature1.svg",
    title: "Pilih tanggal dan waktu penyewaan",
    desc: "Pastikan untuk memilih tanggal dan waktu yang sesuai dengan kebutuhan",
  },
  {
    icon: "/icons/feature2.svg",
    title: "Temukan kendaraan yang diinginkan",
    desc: "Pilih kendaraan yang sesuai dengan kebutuhan",
  },
  {
    icon: "/icons/feature3.svg",
    title: "Lakukan pembayaran",
    desc: "Lakukan pembayaran biaya sewa kendaraan",
  },
  {
    icon: "/icons/feature4.svg",
    title: "Penyewaan berhasil",
    desc: "Pelanggan akan menerima konfirmasi pemesanan  beserta rincian penyewaan kendaraan",
  },
];

const bigSizeFont = { fontSize: "32px", fontWeight: "bold" };
const primaryColor = { backgroundColor: "#6B7CFF" };
const Home = () => {
  return (
    <Layout style={{ background: "#FFFFFF" }}>
      <RadialBlur left="-170px" top="-220px" />
      <RadialBlur left="1150px" top="120px" />

      <Content
        style={{ paddingInline: "50px", marginBottom: "10rem", zIndex: 1 }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "auto",
            marginBottom: "5rem",
          }}
        >
          <Row
            justify="space-between"
            gutter={42}
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            <Col span={12} style={{ alignContent: "" }}>
              <Title
                style={{
                  textAlign: "justify",
                  ...bigSizeFont,
                }}
              >
                Solusi Kelola Rental Kendaraan yang Tepat untuk Bisnis Anda
              </Title>
              <Paragraph style={{ textAlign: "justify", fontWeight: "bold" }}>
                Optimalkan pelayanan pelanggan dengan Sistem Booking
                RentalinAja. Berikan kemudahan pada pelanggan untuk memesan
                secara online.
              </Paragraph>
              <Flex gap={20} style={{ paddingTop: "30px", maxWidth: "100%" }}>
                <Button
                  size="large"
                  style={{
                    backgroundColor: "#0A142F",
                    color: "white",
                    width: "230px",
                  }}
                >
                  Gabung Sekarang!
                </Button>
                <Button
                  size="large"
                  style={{
                    width: "230px",
                    border: "1px solid #0A142F",
                    color: "#0A142F",
                  }}
                >
                  Uji Coba Gratis
                </Button>
              </Flex>
            </Col>
            {/* Video Embed */}
            <Col span={10}>
              <YouTubeEmbed videoId="XHTrLYShBRQ" />
            </Col>
          </Row>
          {/* Rental Info */}
          <Flex wrap="wrap" style={{ marginBlock: "4.3rem" }} justify="center">
            <Flex className="box1" gap={20} style={{ marginInline: "20px" }}>
              {RentalInfo.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "30px",
                      backgroundColor: "#DADEF8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={item.imgSrc}
                      alt=""
                      style={{ width: "35%", height: "auto" }}
                    />
                  </div>
                  <Flex vertical justify="center">
                    <p
                      style={{
                        fontWeight: "bolder",
                        fontSize: "25px",
                        color: "#332C5C",
                      }}
                    >
                      {item.percentage}
                    </p>
                    <p
                      style={{
                        fontWeight: "bolder",
                        fontSize: "15px",
                        color: "#5E587A",
                      }}
                    >
                      {item.description}
                    </p>
                  </Flex>
                </div>
              ))}
            </Flex>
          </Flex>
        </div>

        <Flex vertical justify="center" align="center">
          <p
            style={{ fontSize: "15px", fontWeight: "bolder", color: "#6097FA" }}
          >
            Fitur Kami
          </p>
          <p style={{ ...bigSizeFont, color: "#332C5C", zIndex: "1" }}>
            Dapatkan Solusi terbaik untuk Bisnis Rental Anda
          </p>
          <div
            style={{
              marginTop: "10px",
              borderRadius: "10px",
              width: "100px",
              height: "4px",
              ...primaryColor,
            }}
          ></div>
        </Flex>
      </Content>
      {/* //? Wave background */}
      <img
        src="/waves/wave1.svg"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "auto",
          zIndex: 0,
          top: "160px",
        }}
      />

      <Flex gap={100} vertical style={{ zIndex: 1, paddingInline: "10rem" }}>
        <Flex gap={20} justify="center" wrap="wrap">
          <Flex flex={2}>
            <img
              style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
              src="/image/gambar1.png"
              alt=""
              loading="lazy"
            />
          </Flex>
          <Flex flex={2} vertical>
            <p
              style={{
                color: "white",
                backgroundColor: "#6B7CFF",
                width: "130px",

                borderRadius: "20px",
                textAlign: "center",
                padding: "5px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              untuk pelanggan
            </p>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  color: "#6B7CFF",
                  backgroundColor: "#FFDC60",
                  width: "150px",

                  borderRadius: "20px",
                  textAlign: "center",
                  paddingInline: "8px",
                  fontWeight: "bold",
                }}
              >
                BOOKING
              </span>{" "}
              {""}
              ONLINE CEPAT <br /> & EFISIEN
            </p>
            <p>
              Berikan kemudahan pemesanan bagi pelanggan untuk melakukan booking
              online kapan saja dan di mana saja!
            </p>

            {/* Sectiom Feature */}
            <Flex
              wrap="wrap"
              style={{ paddingBlock: "1rem" }}
              gap={15}
              vertical
            >
              {featureSection.map((item, index) => (
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      flexWrap: "wrap",
                      flex: "0 0 17%",
                      height: "80px",
                      borderRadius: "20px",
                      backgroundColor: "#ECF5FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    <img
                      src={item.icon}
                      alt="icon"
                      style={{ width: "25px", height: "auto" }}
                    />
                  </div>

                  <Flex vertical>
                    <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                      {item.title}
                    </p>
                    <p style={{ color: "#5E587A" }}>{item.desc}</p>
                  </Flex>
                </div>
              ))}
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Flex vertical>
            <p
              style={{
                color: "white",
                backgroundColor: "#6B7CFF",
                width: "130px",

                borderRadius: "20px",
                textAlign: "center",
                padding: "5px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              untuk pelanggan
            </p>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              {""}
              <span
                style={{
                  color: "#6B7CFF",
                  backgroundColor: "#FFDC60",
                  width: "150px",

                  borderRadius: "20px",
                  textAlign: "center",
                  paddingInline: "8px",
                  fontWeight: "bold",
                }}
              >
                PAYMENT GATEAWAY
              </span>{" "}
              {""}
              ONLINE CEPAT <br /> & EFISIEN
            </p>
            <p>
              Berikan kemudahan pemesanan bagi pelanggan untuk melakukan booking
              online kapan saja dan di mana saja!
            </p>
          </Flex>
          <Flex>
            <img
              src="/image/gambar2.png"
              alt="gambar 2"
              style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
              loading="lazy"
            />
          </Flex>
        </Flex>
      </Flex>

      {/* Features Section
      <Row gutter={[16, 16]} style={{ marginTop: "40px", zIndex: 1 }}>
        <Col
        span={8}
          style={{
            background: "#E0E4FC",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Title level={4}>Keamanan Data</Title>
          <Paragraph>
            Data terjamin aman, sehingga anda tidak perlu khawatir dengan
            kebocoran data.
          </Paragraph>
        </Col>
      </Row>

      <Row
        justify="center"
        style={{
          marginTop: "40px",
          background: "#E0E4FC",
          padding: "50px",
          borderRadius: "20px",
        }}
      >
        <Col span={24} style={{ textAlign: "center" }}>
          <Title>Apa yang bisa Anda dapatkan?</Title>
          <Paragraph>Discover the benefits...</Paragraph>
          <Input.Group compact>
            <Input
              style={{ width: "calc(100% - 200px)" }}
              defaultValue="Email address"
            />
            <Button type="primary">Subscribe</Button>
          </Input.Group>
        </Col>
      </Row> */}
    </Layout>
  );
};

export default Home;
