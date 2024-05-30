"use client";
import React from "react";
import { CSSProperties } from "react";
import { Flex } from "antd";
import Navbar from "@/app/components/Navbar";
import GlassContainer from "@/app/components/glassContainer";
import FooterDaftar from "@/app/components/footerDaftar";
import RadialBlur from "@/app/components/radialBlur";
import FooterSection from "@/app/components/footer";

const Fitur = () => {
  return (
    <>
      <Navbar />
      <Flex vertical align="center">
        <p style={{ fontSize: "25px", fontWeight: "bold", color: "#6B7CFF" }}>
          Fitur
        </p>
        <p style={{ fontSize: "15px", textAlign: "center" }}>
          Platform kami menawarkan serangkaian layanan untuk
          <br /> mengoptimalkan operasional bisnis rental Anda
        </p>
        <img
          src="/image/computer.png"
          alt="Fitur"
          width={800}
          style={{ objectFit: "contain" }}
        />
      </Flex>
      {/* //?waves */}
      <img
        style={{
          zIndex: -1,
          objectFit: "cover",
          position: "absolute",
          top: "390px",
        }}
        draggable="false"
        src="/waves/wave5.svg"
        alt=""
      />

      <Flex
        vertical
        gap={12}
        justify="center"
        align="center"
        style={{
          paddingInline: "8rem",
          marginTop: "5.5rem",
          marginBottom: "15rem",
        }}
      >
        <Flex gap={15} wrap="wrap">
          <GlassContainer width={350} height={180}>
            <p style={{ fontWeight: "bold", color: "#082653" }}>
              Manajemen Booking
            </p>
            <p style={{ color: "#082653", textAlign: "justify" }}>
              Memungkinkan pengguna untuk memesan kendaraan secara online,
              mengelola reservasi, dan melihat ketersediaan kendaraan secara
              real-time.
            </p>
          </GlassContainer>
          <GlassContainer width={450} height={180}>
            <p style={{ fontWeight: "bold", color: "#082653" }}>
              Manajemen Dashboard
            </p>
            <p style={{ color: "#082653", textAlign: "justify" }}>
              Memungkinkan pengguna menyimpan informasi pelanggan, mengelola
              kontak, dan berkomunikasi dengan pelanggan melalui email dan SMS.
            </p>
          </GlassContainer>
        </Flex>
        <Flex gap={15} wrap="wrap">
          <GlassContainer width={450} height={180}>
            <p style={{ fontWeight: "bold", color: "#082653" }}>
              Penjadwalan Kendaraan
            </p>
            <p style={{ color: "#082653", textAlign: "justify" }}>
              Memberikan pengguna laporan dan analisis yang komprehensif tentang
              kinerja bisnis mereka, seperti tingkat okupansi kendaraan,
              pendapatan, dan profitabilitas.
            </p>
          </GlassContainer>
          <GlassContainer width={350} height={180}>
            <p style={{ fontWeight: "bold", color: "#082653" }}>
              Payment Gateaway
            </p>
            <p style={{ color: "#082653", textAlign: "justify" }}>
              Memungkinkan pengguna untuk menerima pembayaran online dengan aman
              dan mudah melalui berbagai metode pembayaran.
            </p>
          </GlassContainer>
        </Flex>
      </Flex>
      <FooterDaftar />
      <RadialBlur
        layer={-1}
        opacity={1}
        height="300px"
        left="270px"
        top="1350px"
        width="600px"
      />
      <FooterSection />
    </>
  );
};

export default Fitur;
