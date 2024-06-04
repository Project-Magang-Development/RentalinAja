"use client";

import React from "react";
import { Layout, Row, Col, Typography, Button, Input, Card, Flex } from "antd";
import Image from "next/image";
import YouTubeEmbed from "@/app/components/youtubeEmbed";
import RadialBlur from "@/app/components/radialBlur";
import Navbar from "@/app/components/Navbar";
import Testimonials from "@/app/components/testimoni";
import Testimonial from "@/app/components/testimoni";
import Testimo from "@/app/components/testimoni";
import TestimonialComponent from "@/app/components/testimoni";
import InfiniteTestimonials from "@/app/components/testimoni";
import CustomCollapse from "@/app/components/Accordion";
import Accordion from "@/app/components/Accordion";
import FooterDaftar from "@/app/components/footerDaftar";
import FooterSection from "@/app/components/footer";
import "../../../app/globals.css";

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
    <div style={{ overflow: "hidden" }}>
      <Navbar />

      <Layout style={{ background: "#FFFFFF", overflow: "hidden" }}>
        <RadialBlur
          layer={0}
          opacity={0.9}
          height="490px"
          width="490px"
          left="auto"
          top="-220px"
        />

        <Content
          style={{ paddingInline: "50px", marginBottom: "5rem", zIndex: 1 }}
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
                <Paragraph style={{ textAlign: "justify" }}>
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
            <Flex
              wrap="wrap"
              style={{ marginBlock: "4.3rem" }}
              justify="center"
            >
              <Flex className="box1" gap={20} style={{ marginInline: "20px" }}>
                {RentalInfo.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
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

          <Flex vertical justify="center" align="center" wrap="wrap">
            <p
              style={{
                fontSize: "15px",
                fontWeight: "bolder",
                color: "#6097FA",
              }}
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
            objectFit: "cover",
            position: "absolute",
            bottom: 0,
            width: "100%",

            height: "auto",
            zIndex: 0,
            top: "170px",
          }}
        />
        <Flex
          gap={100}
          vertical
          style={{ zIndex: 1, paddingInline: "7rem", marginTop: "3.5rem" }}
        >
          <Flex gap={20} justify="center" wrap="wrap">
            <Flex flex={2}>
              <img
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  height: "auto",
                }}
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
                untuk Pelanggan
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
                Berikan kemudahan pemesanan bagi pelanggan untuk melakukan
                booking online kapan saja dan di mana saja!
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
                        flex: "0 0 12%",
                        height: "60px",
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
          <Flex gap={10}>
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
                untuk Pelanggan
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "28px",
                  marginBottom: "10px",
                }}
              >
                SISTEM
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
                <br /> UNTUK KEMUDAHAN BERTRANSAKSI
              </p>
              <p>
                Fasilitasi transaksi pembayaran secara online dengan
                menghubungkan situs web dengan bank atau lembaga keuangan yang
                memproses pembayaran.
              </p>
              <Flex style={{ paddingTop: "1rem" }}>
                <Flex flex={2} vertical align="center">
                  {" "}
                  <div
                    style={{
                      width: "55px",
                      height: "55px",
                      borderRadius: "26px",
                      backgroundColor: "#DADEF8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <img
                      style={{ width: "30px", height: "auto" }}
                      src="/icons/cancel.svg"
                      alt=""
                    />
                  </div>{" "}
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    Mengurangi Risiko Pembatalan
                  </p>
                  <p style={{ textAlign: "center", fontSize: "14px" }}>
                    Dengan payment gateaway dapat mengurangi risiko pembatalan
                    atau pengembalian dana, karena pelanggan telah melakukan
                    pembayaran terlebih dahulu
                  </p>
                </Flex>
                <Flex
                  flex={1}
                  align="start"
                  justify="center"
                  style={{ paddingTop: "20px" }}
                >
                  <img
                    style={{ width: "160px", height: "auto" }}
                    src="/icons/line.svg"
                    alt=""
                  />
                </Flex>
                <Flex flex={2} vertical align="center">
                  {" "}
                  <div
                    style={{
                      width: "55px",
                      height: "55px",
                      borderRadius: "26px",
                      backgroundColor: "#DADEF8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <img
                      style={{ width: "30px", height: "auto" }}
                      src="/icons/search.svg"
                      alt=""
                    />
                  </div>{" "}
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    Pelacakan dan Pelaporan
                  </p>
                  <p style={{ textAlign: "center", fontSize: "14px" }}>
                    Memberikan kemampuan untuk melacak dan melaporkan semua
                    transaksi yang dilakukan melalui sistem
                  </p>
                </Flex>
              </Flex>
            </Flex>
            <Flex flex={1}>
              <img
                src="/image/gambar2.png"
                alt="gambar 2"
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  height: "auto",
                }}
                loading="lazy"
              />
            </Flex>
          </Flex>
          {/* Section Feature 3 */}
          <Flex gap={20} justify="space-between" align="center">
            <Flex flex={1}>
              <img src="/image/gambar3.png" alt="" />
            </Flex>
            <Flex flex={1} vertical>
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
                untuk Rental
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "28px",
                  marginBottom: "10px",
                }}
              >
                KELOLA
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
                  DASHBOARD
                </span>{" "}
                {""}
                BISNIS <br /> ANDA DENGAN MUDAH
              </p>
              <p>
                Berikan kemudahan pemesanan bagi pelanggan untuk melakukan
                booking online kapan saja dan di mana saja!
              </p>
              <Flex style={{ marginTop: "1rem" }} gap={20}>
                <img src="/icons/checklist.svg" alt="" loading="lazy" />
                <p style={{ textAlign: "justify" }}>
                  Dashboard memungkinkan Anda untuk melihat, mengelola, dan
                  mengonfirmasi booking dengan cepat, menjadikannya lebih mudah.
                </p>
              </Flex>
              <Flex style={{ marginTop: "1rem" }} gap={20}>
                <img src="/icons/checklist.svg" alt="" loading="lazy" />
                <p style={{ textAlign: "justify" }}>
                  Dashboard dapat digunakan untuk melacak inventaris kendaraan
                  secara akurat. Dengan informasi ini, Anda dapat mengoptimalkan
                  pengelolaan inventaris, memastikan ketersediaan kendaraan yang
                  cukup untuk memenuhi permintaan pelanggan.
                </p>
              </Flex>
            </Flex>
          </Flex>

          {/* Section Feature 4 */}

          <Flex gap={20} justify="space-between" align="center">
            <Flex flex={1} vertical>
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
                untuk Rental
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "28px",
                  marginBottom: "10px",
                }}
              >
                ATUR
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
                  PENJADWALAN
                </span>{" "}
                {""}
                <br /> KENDARAAN ANDA
              </p>
              <p style={{ maxWidth: "400px" }}>
                Kelola sistem penjadwalan inventaris kendaraan anda serta dapat
                mengatur harga yang diberikan sesuai jadwalnya
              </p>
            </Flex>
            <Flex flex={1}>
              <img src="/image/gambar4.png" alt="" />
            </Flex>
          </Flex>
        </Flex>

        <Flex
          vertical
          justify="center"
          align="center"
          style={{
            marginTop: "12rem",
            zIndex: 2,
            marginBottom: " 10rem",
            objectFit: "contain",
          }}
          gap={30}
        >
          <Flex vertical align="center">
            <p
              style={{
                fontSize: "15px",
                fontWeight: "bolder",
                color: "#6097FA",
                textAlign: "center",
              }}
            >
              Keunggulan Kami
            </p>
            <p
              style={{
                ...bigSizeFont,
                color: "#332C5C",
                zIndex: "1",
                textAlign: "center",
              }}
            >
              Kenapa Harus{" "}
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
                RentalinAja
              </span>
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
          <Flex
            wrap="wrap"
            gap={50}
            style={{
              zIndex: 2,
              width: "50rem",
              height: "auto",
              backgroundColor: "#9DA8FF",
              borderRadius: "15px",
              paddingInline: "40px",
              paddingBlock: "30px",
            }}
          >
            <img
              style={{ width: "250px", height: "auto" }}
              src="/image/price.svg"
              alt=""
            />
            <Flex wrap="wrap" vertical>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: " #1D2130",
                }}
              >
                RentalinAja menawarkan harga
                <br /> yang terjangkau{" "}
                <span style={{ color: " #FFDC60" }}>hanya dengan</span>
              </p>
              <p
                style={{
                  fontSize: "60px",
                  fontWeight: "bold",
                  color: " white",
                }}
              >
                RP.300.000<span style={{ fontSize: "14px" }}>/bulan</span>
              </p>
              <p
                style={{
                  marginBottom: "1rem",
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                Anda sudah bisa menggunakan layanan kami
              </p>
              <Button
                size="large"
                style={{
                  backgroundColor: "#0A142F",
                  color: "white",
                  width: "230px",
                  border: "none",
                }}
              >
                Lihat Selengkapnya
              </Button>
            </Flex>
          </Flex>

          {/* //? Wave background */}

          <img
            src="/waves/wave2.svg"
            style={{
              objectFit: "cover",
              position: "absolute",
              bottom: -3120,
              width: "100%",
              height: "auto",
              zIndex: 0,
            }}
          />
        </Flex>
        <Flex vertical align="center" style={{ marginBottom: " 5.8rem" }}>
          <p
            style={{
              fontSize: "15px",
              fontWeight: "bolder",
              color: "#6097FA",
              textAlign: "center",
            }}
          >
            Testimoni
          </p>
          <p
            style={{
              ...bigSizeFont,
              color: "#332C5C",
              zIndex: "1",
              textAlign: "center",
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
              Dipercaya
            </span>{" "}
            Lebih dari Puluhan Customer
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

        <div className="wave-slider">
          <img
            draggable={false}
            style={{
              backgroundSize: "contain",
              position: "absolute",
              objectFit: "cover",
              bottom: 0,
              width: "100%",
              height: "auto",
              zIndex: 0,
            }}
            src="/waves/wave3.svg"
            alt=""
          />
        </div>
        <InfiniteTestimonials />

        <Flex vertical align="center">
          <p
            style={{
              fontSize: "15px",
              fontWeight: "bolder",
              color: "#6097FA",
              textAlign: "center",
            }}
          >
            Roadmap
          </p>
          <p
            style={{
              ...bigSizeFont,
              color: "#332C5C",
              zIndex: "1",
              textAlign: "center",
            }}
          >
            Bagaimana Anda Bisa Memulainya ?
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
        <Flex justify="center" style={{ padding: "5rem" }}>
          <img
            src="/image/roadmap.png"
            alt="roadmap"
            style={{ objectFit: "cover" }}
          />
        </Flex>
        <Flex style={{ padding: "5rem" }}>
          {" "}
          <Flex
            gap={20}
            justify="space-between"
            align="center"
            style={{
              background: "radial-gradient(circle, #6F80FF, #98A4FF)",
              borderRadius: "30px",
              height: "100%",
              width: "100%",
              padding: "5rem",
            }}
          >
            <Flex vertical justify="center" align="center" flex={2}>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#FFDC60",
                }}
              >
                FAQ
              </p>
              <p
                style={{
                  fontSize: "20px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Temukan Jawaban yang Anda <br /> Butuhkan
              </p>
            </Flex>
            <Flex flex={3}>
              <Accordion />
            </Flex>
          </Flex>
        </Flex>
        <FooterDaftar />
        <RadialBlur
          layer={0}
          opacity={1}
          height="400px"
          width="400px"
          left="400px"
          top="5690px"
        />
        <FooterSection />
      </Layout>
    </div>
  );
};

export default Home;
