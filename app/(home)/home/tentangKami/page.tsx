"use client";

import React from "react";

import { Button, Flex } from "antd";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import RadialBlur from "@/app/components/radialBlur";
import FooterDaftar from "@/app/components/footerDaftar";
import { Footer } from "antd/es/layout/layout";
import FooterSection from "@/app/components/footer";

const TentangKami = () => {
  return (
    <>
      <Navbar />
      <Flex wrap="wrap" gap={50} justify="space-between" style={{ zIndex: 1 }}>
        <Flex vertical flex={2} style={{ paddingLeft: "50px", zIndex: 1 }}>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "22px",
              color: "#6B7CFF",
              marginBottom: "5px",
            }}
          >
            Tentang Kami
          </p>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "22px",
              marginBottom: "5px",
            }}
          >
            Solusi Cerdas untuk Bisnis Rental <br />
            yang Sukses
          </p>
          <p style={{ textAlign: "justify", fontSize: "13px" }}>
            RentalinAja adalah platform SaaS (Software as a Service) sistem
            booking yang membantu perusahaan rental kendaraan di Indonesia untuk
            mengelola bisnis mereka secara online dengan mudah dan efisien.
            Platform ini menawarkan berbagai fitur canggih, seperti manajemen
            reservasi, armada, dan laporan. RentalinAja mudah digunakan,
            skalabel, dan aman, menjadikannya solusi ideal untuk meningkatkan
            efisiensi, profitabilitas, dan kepuasan pelanggan. Platform ini
            membantu Anda menghemat waktu dan uang, meningkatkan pendapatan dan
            profitabilitas, serta memberikan layanan pelanggan yang lebih baik.
            Daftar di RentalinAja hari ini dan rasakan manfaatnya!
          </p>
          <div style={{ paddingRight: "22rem" }}>
            <Link href="/home/pricing">
              <Button
                size="large"
                style={{
                  marginTop: "1rem",
                  backgroundColor: "#0A142F",
                  color: "white",
                  width: "100%",
                  border: "none",
                  fontSize: "14px",
                }}
              >
                Gabung Sekarang!
              </Button>
            </Link>
          </div>
        </Flex>
        <Flex flex={1.4} justify="end" style={{ zIndex: "1" }}>
          <img
            style={{ width: "450px", height: "auto", objectFit: "contain" }}
            src="/image/bluecar.png"
            alt="Mobil"
          />
        </Flex>
        <RadialBlur
          layer={0}
          opacity={0.9}
          height="300px"
          left="1000px"
          top="90px"
          width="400px"
        />
        {/* //?waves */}
        <img
          style={{
            zIndex: -1,
            objectFit: "cover",
            position: "absolute",
            top: "390px",
          }}
          draggable="false"
          src="/waves/wave4.svg"
          alt=""
        />
      </Flex>
      <Flex
        gap={20}
        justify="center"
        align="center"
        vertical
        wrap="wrap"
        style={{
          zIndex: 1,
          paddingInline: "60px",
          textAlign: "center",
          marginTop: "11rem",
          marginBottom: "10rem",
        }}
      >
        <Flex wrap="wrap" vertical style={{ zIndex: 1 }}>
          <p style={{ fontSize: "22px", fontWeight: " bold" }}>
            {" "}
            Manfaat RentalinAja Bagi Rental
          </p>
          <p style={{ fontSize: "13px" }}>
            Mulai gabung bersama kami dan nikmati manfaat <br /> yang kami
            berikan
          </p>
        </Flex>
        {/* //?Manfaat */}
        <Flex wrap="wrap" justify="center" align="center">
          <Flex
            gap={20}
            style={{
              borderRadius: " 10px",
              padding: "1rem",
              height: "200px",
              width: "400px",
              backgroundColor: "#F4F6FA",
              margin: "10px",
            }}
          >
            <Flex vertical gap={5}>
              <p
                style={{
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "start",
                }}
              >
                Ketersediaan Produk Akurat
              </p>
              <p style={{ fontSize: "13px", textAlign: "start" }}>
                Dengan update real-time produk yang tersedia, pelanggan pasti
                bisa menyewa produk yang dibutuhkan.
              </p>
            </Flex>
            <Flex>
              <img src="/image/manajemen.svg" alt="foto" width={300} />
            </Flex>
          </Flex>
          <Flex
            gap={20}
            style={{
              borderRadius: " 10px",
              padding: "1rem",
              height: "200px",
              width: "400px",
              backgroundColor: "#F4F6FA",
              margin: "10px",
            }}
          >
            <Flex vertical gap={5}>
              <p
                style={{
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "start",
                }}
              >
                Manajemen Rental Order Mudah
              </p>
              <p style={{ fontSize: "13px", textAlign: "start" }}>
                Proses penyewaan rental pelanggan dapat terproses dengan baik
                dan riwayat order pelanggan terkelola dengan maksimal
              </p>
            </Flex>
            <Flex>
              <img src="/image/produk.svg" alt="foto" width={300} />
            </Flex>
          </Flex>
        </Flex>
        {/* //?Manfaat2 */}
        <Flex wrap="wrap" justify="center" align="center">
          <Flex
            gap={20}
            style={{
              borderRadius: " 10px",
              padding: "1rem",
              height: "200px",
              width: "400px",
              backgroundColor: "#F4F6FA",
              margin: "10px",
            }}
          >
            <Flex vertical gap={5}>
              <p
                style={{
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "start",
                }}
              >
                Laporan Tercatat Otomatis
              </p>
              <p style={{ fontSize: "13px", textAlign: "start" }}>
                Laporan penjualan akan tercatat otomatis pada dashboard
              </p>
            </Flex>
            <Flex>
              <img src="/image/chart.svg" alt="foto" width={300} />
            </Flex>
          </Flex>
          <Flex
            gap={20}
            style={{
              borderRadius: " 10px",
              padding: "1rem",
              height: "200px",
              width: "400px",
              backgroundColor: "#F4F6FA",
              margin: "10px",
            }}
          >
            <Flex vertical gap={5}>
              <p
                style={{
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "start",
                }}
              >
                Proses Transaksi yang Cepat
              </p>
              <p style={{ fontSize: "13px", textAlign: "start" }}>
                Sistem terintegrasi dengan payment gateaway sehingga proses
                checkout dapat lebih cepat dan efektif
              </p>
            </Flex>
            <Flex>
              <img src="/image/pay.svg" alt="foto" width={300} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <FooterDaftar />

      <RadialBlur
        layer={-1}
        opacity={1}
        height="300px"
        left="280px"
        top="1390px"
        width="600px"
      />
      <FooterSection />
    </>
  );
};

export default TentangKami;
