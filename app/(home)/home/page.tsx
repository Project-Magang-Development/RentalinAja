"use client";

import React, { useRef } from "react";
import { Layout, Row, Col, Typography, Button, Input, Card, Flex } from "antd";
import Image from "next/image";
import YouTubeEmbed from "@/app/components/youtubeEmbed";
import RadialBlur from "@/app/components/radialBlur";
import Navbar from "@/app/components/Navbar";

import InfiniteTestimonials from "@/app/components/testimoni";

import Accordion from "@/app/components/Accordion";
import FooterDaftar from "@/app/components/footerDaftar";
import FooterSection from "@/app/components/footer";
import "../../../app/globals.css";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import Section from "@/app/components/RevealAnimation";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const bigSizeFont = { fontSize: "32px", fontWeight: "bold" };
const primaryColor = { backgroundColor: "#6B7CFF" };
const Home = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <Flex vertical style={{ overflow: "hidden" }}>
      <Navbar />

      <Layout
        style={{
          background: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <div className="radial">
          <RadialBlur
            layer={0}
            opacity={0.9}
            height="490px"
            width="490px"
            left="-25%"
            top="-220px"
          />
        </div>
        <motion.div
          style={{ zIndex: 1 }}
          initial={{ opacity: 0, y: -50 }} // Initial animation properties
          animate={{ opacity: 1, y: 0 }} // Animation properties when component enters the viewport
          transition={{ duration: 0.3 }} // Transition duration
        >
          <Content
            className="parent"
            style={{ paddingLeft: "2.8rem", marginBottom: "5rem", zIndex: 1 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "auto",
                marginBottom: "5rem",
              }}
            >
              <Flex wrap="wrap-reverse">
                <Col
                  className="text-utama"
                  span={24} // Saat layar kecil, teks akan mengambil seluruh lebar
                  md={12} // Saat layar medium ke atas, teks akan mengambil setengah lebar
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <p style={{ fontSize: "27px", fontWeight: "bold" }}>
                    Solusi Kelola Rental Kendaraan yang Tepat untuk Bisnis Anda.
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600" }}>
                    Optimalkan pelayanan pelanggan dengan Sistem Booking
                    RentalinAja. Berikan kemudahan pada pelanggan untuk memesan
                    secara online.
                  </p>
                  <Flex
                    className="button-utama"
                    gap={20}
                    style={{ width: "100%", paddingRight: "50%" }}
                  >
                    <Link href={"/pricing"}>
                      <Button
                        block
                        size="large"
                        style={{
                          backgroundColor: "#0A142F",
                          color: "white",
                          width: "100%",
                        }}
                      >
                        Gabung Sekarang
                      </Button>
                    </Link>
                    <Link href={"/pricing"}>
                      <Button
                        size="large"
                        block
                        style={{ border: "1px solid #0A142F", width: "100%" }}
                      >
                        Uji Coba Gratis
                      </Button>
                    </Link>
                  </Flex>
                </Col>
                <Col
                  span={24} // Saat layar kecil, YouTube embed akan mengambil seluruh lebar
                  md={12} // Saat layar medium ke atas, YouTube embed akan mengambil setengah lebar
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    className="embedyt"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "100%",
                      minWidth: "35%",
                    }}
                  >
                    <YouTubeEmbed videoId="KPYTN3bjKZ4" />
                  </div>
                </Col>
              </Flex>

              <Flex
                className="icon-3"
                gap={20}
                wrap="wrap"
                style={{
                  marginBlock: "4.3rem",
                }}
                justify="center"
                align="center"
              >
                {/* 1 */}
                <Flex gap={10} wrap="wrap">
                  <Flex
                    justify="center"
                    align="center"
                    style={{
                      height: "70px",
                      width: "70px",
                      borderRadius: "15px",
                      backgroundColor: " #D8DCF8",
                    }}
                  >
                    <img width={30} src="icons/3user.svg" alt="" />
                  </Flex>
                  <Flex vertical>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        color: "#332C5C",
                      }}
                    >
                      99%
                    </p>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: "#5E587A",
                      }}
                    >
                      Kepuasan pengguna
                    </p>
                  </Flex>
                </Flex>
                {/* 2 */}
                <Flex gap={10}>
                  <Flex
                    justify="center"
                    align="center"
                    style={{
                      height: "70px",
                      width: "70px",
                      borderRadius: "15px",
                      backgroundColor: " #D8DCF8",
                    }}
                  >
                    <img width={30} src="icons/unduh.svg" alt="" />
                  </Flex>
                  <Flex vertical>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        color: "#332C5C",
                      }}
                    >
                      30K
                    </p>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: "#5E587A",
                      }}
                    >
                      Total berlangganan
                    </p>
                  </Flex>
                </Flex>
                {/* 3 */}
                <Flex gap={10}>
                  <Flex
                    justify="center"
                    align="center"
                    style={{
                      height: "70px",
                      width: "70px",
                      borderRadius: "15px",
                      backgroundColor: " #D8DCF8",
                    }}
                  >
                    <img width={30} src="icons/2user.svg" alt="" />
                  </Flex>
                  <Flex vertical>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        color: "#332C5C",
                      }}
                    >
                      10K
                    </p>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: "#5E587A",
                      }}
                    >
                      Pengguna baru perbulan
                    </p>
                  </Flex>
                </Flex>
              </Flex>
            </div>

            <div>
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
                <p
                  style={{
                    ...bigSizeFont,
                    color: "#332C5C",
                    zIndex: "1",
                    textAlign: "center",
                  }}
                >
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
            </div>
          </Content>
        </motion.div>
        {/* //? Wave background */}

        <img
          className="wave1"
          src="/waves/wave1.svg"
          style={{
            objectFit: "cover",
            position: "absolute",
            bottom: 0,
            width: "100%",

            height: "auto",
            zIndex: 0,
            left: 0,
            right: 0,
            top: "150px",
          }}
        />
        <Flex
          gap={85}
          vertical
          style={{
            zIndex: 1,
            paddingInline: "2.8rem",
            marginTop: "3.5rem",
          }}
        >
          <Section>
            <Flex gap={20} justify="center" wrap="wrap">
              <img
                width={525}
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  height: "auto",
                }}
                src="/image/gambar1.png"
                alt=""
                loading="lazy"
              />
              <Flex wrap="wrap" flex={2} vertical>
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
                  className="section-feature"
                  wrap="wrap"
                  style={{ paddingBlock: "0.8rem" }}
                  gap={15}
                  vertical
                >
                  {/* 1 */}
                  <Flex className="booking-feature" gap={10} wrap="wrap">
                    <Flex
                      justify="center"
                      align="center"
                      style={{
                        height: "70px",
                        width: "70px",
                        borderRadius: "20px",
                        backgroundColor: "#ECF5FF",
                      }}
                    >
                      <img width={40} src="/icons/feature1.svg" alt="" />
                    </Flex>
                    <Flex vertical justify="center">
                      <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Pilih tanggal dan waktu penyewaan
                      </p>
                      <p>
                        Pastikan untuk memilih tanggal dan waktu yang sesuai
                        dengan kebutuhan
                      </p>
                    </Flex>
                  </Flex>
                  {/* 2 */}
                  <Flex className="booking-feature" gap={10} wrap="wrap">
                    <Flex
                      justify="center"
                      align="center"
                      style={{
                        height: "70px",
                        width: "70px",
                        borderRadius: "20px",
                        backgroundColor: "#ECF5FF",
                      }}
                    >
                      <img width={40} src="/icons/feature2.svg" alt="" />
                    </Flex>
                    <Flex vertical justify="center">
                      <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Temukan kendaraan yang diinginkan
                      </p>
                      <p>Pilih kendaraan yang sesuai dengan kebutuhan</p>
                    </Flex>
                  </Flex>
                  {/* 3 */}
                  <Flex className="booking-feature" gap={10} wrap="wrap">
                    <Flex
                      justify="center"
                      align="center"
                      style={{
                        height: "70px",
                        width: "70px",
                        borderRadius: "20px",
                        backgroundColor: "#ECF5FF",
                      }}
                    >
                      <img width={40} src="/icons/feature3.svg" alt="" />
                    </Flex>
                    <Flex vertical justify="center">
                      <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Lakukan pembayaran
                      </p>
                      <p>Lakukan pembayaran biaya sewa kendaraans</p>
                    </Flex>
                  </Flex>
                  {/* 4 */}
                  <Flex className="booking-feature" gap={10} wrap="wrap">
                    <Flex
                      justify="center"
                      align="center"
                      style={{
                        height: "70px",
                        width: "70px",
                        borderRadius: "20px",
                        backgroundColor: "#ECF5FF",
                      }}
                    >
                      <img width={40} src="/icons/feature4.svg" alt="" />
                    </Flex>
                    <Flex vertical justify="center">
                      <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Penyewaan berhasil
                      </p>
                      <p>
                        Pelanggan akan menerima konfirmasi pemesanan beserta
                        rincian penyewaan kendaraan
                      </p>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Section>
          <Section>
            <Flex gap={10} wrap="wrap-reverse" justify="center">
              <Flex flex={2} vertical wrap="wrap">
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
                  </span>
                  <br /> UNTUK KEMUDAHAN BERTRANSAKSI
                </p>
                <p>
                  Fasilitasi transaksi pembayaran secara online dengan
                  menghubungkan situs web dengan bank atau lembaga keuangan yang
                  memproses pembayaran.
                </p>
                <Flex style={{ paddingTop: "1rem" }} wrap="wrap">
                  <Flex flex={2} vertical align="center" wrap="wrap">
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

              <img
                width={540}
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
          </Section>
          {/* Section Feature 3 */}
          <Section>
            <Flex gap={20} justify="space-between" align="center" wrap="wrap">
              <img width={550} src="/image/gambar3.png" alt="" />

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
                    mengonfirmasi booking dengan cepat, menjadikannya lebih
                    mudah.
                  </p>
                </Flex>
                <Flex style={{ marginTop: "1rem" }} gap={20}>
                  <img src="/icons/checklist.svg" alt="" loading="lazy" />
                  <p style={{ textAlign: "justify" }}>
                    Dashboard dapat digunakan untuk melacak inventaris kendaraan
                    secara akurat. Dengan informasi ini, Anda dapat
                    mengoptimalkan pengelolaan inventaris, memastikan
                    ketersediaan kendaraan yang cukup untuk memenuhi permintaan
                    pelanggan.
                  </p>
                </Flex>
              </Flex>
            </Flex>
          </Section>

          {/* Section Feature 4 */}
          <Section>
            <Flex
              gap={20}
              justify="space-between"
              align="center"
              wrap="wrap-reverse"
            >
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
                  Kelola sistem penjadwalan inventaris kendaraan anda serta
                  dapat mengatur harga yang diberikan sesuai jadwalnya
                </p>
              </Flex>

              <img width={540} src="/image/gambar4.png" alt="" />
            </Flex>
          </Section>
        </Flex>

        <Flex
          vertical
          justify="center"
          align="center"
          style={{
            marginTop: "5rem",
            zIndex: 2,

            objectFit: "contain",
          }}
        >
          <Section>
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
          </Section>

          <Flex
            justify="center"
            align="center"
            wrap="wrap"
            gap={50}
            style={{
              backgroundImage: 'url("/waves/wave2.svg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "0px -50px",
              objectFit: "scale-down",
              width: "100%", // Atur lebar div sesuai kebutuhan
              height: "760px", // Atur tinggi div sesuai kebutuhan
              alignContent: "center",
              marginBottom: "1rem",
            }}
          >
            <Section>
              <Flex
                wrap="wrap"
                gap={25}
                align="center"
                justify="center"
                style={{
                  backgroundColor: "#9DA8FF",
                  borderRadius: "15px",
                  paddingInline: "40px",
                  paddingBlock: "30px ",
                  width: "100%",
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
                      fontSize: "13px",
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
                      fontSize: "40px",
                      fontWeight: "bolder",
                      color: " white",
                    }}
                  >
                    RP.300.000<span style={{ fontSize: "13px" }}>/bulan</span>
                  </p>
                  <p
                    style={{
                      marginBottom: "1rem",
                      color: "white",
                      fontWeight: "normal",
                      fontSize: "13px",
                    }}
                  >
                    Anda sudah bisa menggunakan layanan kami
                  </p>
                  <Link href={"/home/pricing"}>
                    <Button
                      size="large"
                      style={{
                        backgroundColor: "#0A142F",
                        color: "white",
                        width: "230px",
                        border: "none",
                        fontSize: "13px",
                      }}
                    >
                      Lihat Selengkapnya
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            </Section>
          </Flex>
        </Flex>

        <Section>
          <Flex vertical align="center" style={{ marginBottom: " 2.8rem" }}>
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
        </Section>

        <div
          style={{
            backgroundImage: 'url("/waves/wave3.svg")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            objectFit: "scale-down",
            width: "100%",
            height: "570px",
            alignContent: "center",
            marginBottom: "3rem",
          }}
        >
          <Section>
            <InfiniteTestimonials />
          </Section>
        </div>

        <Section>
          <Flex vertical align="center" style={{ marginBottom: "2.3rem" }}>
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
        </Section>
        <Section>
          <Flex justify="center" style={{ padding: "1rem" }}>
            <img
              src="/image/roadmap.png"
              alt="roadmap"
              style={{ objectFit: "fill", backgroundSize: "cover" }}
            />
          </Flex>
        </Section>
        <Section>
          <Flex wrap="wrap" style={{ padding: "2.5rem" }}>
            {" "}
            <Flex
              wrap="wrap"
              gap={20}
              justify="space-between"
              align="center"
              style={{
                background: "radial-gradient(circle, #6F80FF, #98A4FF)",
                borderRadius: "30px",
                height: "100%",
                width: "100%",
                padding: "2rem",
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
              <Flex flex={3} align="center" justify="center">
                <Accordion />
              </Flex>
            </Flex>
          </Flex>
        </Section>
        <FooterDaftar />
        <Flex
          className="radial"
          justify="center"
          style={{
            position: "relative",
            zIndex: 1,
            left: "85%",
            transform: "translateX(-50%)",
          }}
        >
          <RadialBlur
            layer={0}
            opacity={1}
            height="300px"
            width="400px"
            left="0px"
            top="0px"
          />
        </Flex>
        <FooterSection />
      </Layout>
    </Flex>
  );
};

export default Home;
