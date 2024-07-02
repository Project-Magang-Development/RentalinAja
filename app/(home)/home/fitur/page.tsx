"use client";
import React from "react";
import { CSSProperties } from "react";
import { Flex } from "antd";
import Navbar from "@/app/components/Navbar";
import GlassContainer from "@/app/components/glassContainer";
import FooterDaftar from "@/app/components/footerDaftar";
import RadialBlur from "@/app/components/radialBlur";
import FooterSection from "@/app/components/footer";
import Section from "@/app/components/RevealAnimation";

const Fitur = () => {
  return (
    <Flex
      vertical
      style={{ overflow: "hidden", position: "relative", zIndex: "0" }}
    >
      <Navbar />

      <Flex vertical align="center" style={{ zIndex: "3" }}>
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

      <Flex
        vertical
        gap={12}
        justify="center"
        align="center"
        style={{
          position: "relative",
          alignContent: "center",
          marginBlock: "12rem ",
          zIndex: "1",
        }}
      >
        <div
          className="wave-fitur"
          style={{
            position: "absolute",
            width: "100%",
            maxWidth: "100%",
            minWidth: "1200px",
            objectFit: "contain",
            zIndex: "-1",
          }}
        >
          <img
            src="/waves/wave5.svg"
            alt="Wave"
            style={{
              width: "100%",
              maxWidth: "100%",
              height: "auto",
              zIndex: -1,
            }}
          />
        </div>
        <Section>
          <Flex
            className="glass-fitur"
            gap={15}
            wrap="wrap"
            justify="center"
            style={{
              paddingInline: "1rem",
              zIndex: "2",
              marginBlock: "2.5rem",
            }}
          >
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
                kontak, dan berkomunikasi dengan pelanggan melalui email dan
                SMS.
              </p>
            </GlassContainer>
          </Flex>
        </Section>
        <Section>
          <Flex
            gap={15}
            wrap="wrap"
            justify="center"
            style={{ paddingInline: "1rem", zIndex: "99" }}
          >
            <GlassContainer width={450} height={180}>
              <p style={{ fontWeight: "bold", color: "#082653" }}>
                Penjadwalan Kendaraan
              </p>
              <p style={{ color: "#082653", textAlign: "justify" }}>
                Memberikan pengguna laporan dan analisis yang komprehensif
                tentang kinerja bisnis mereka, seperti tingkat okupansi
                kendaraan, pendapatan, dan profitabilitas.
              </p>
            </GlassContainer>
            <GlassContainer width={350} height={180}>
              <p style={{ fontWeight: "bold", color: "#082653" }}>
                Payment Gateaway
              </p>
              <p style={{ color: "#082653", textAlign: "justify" }}>
                Memungkinkan pengguna untuk menerima pembayaran online dengan
                aman dan mudah melalui berbagai metode pembayaran.
              </p>
            </GlassContainer>
          </Flex>
        </Section>
      </Flex>

      <FooterDaftar />

      <Flex
        className="radial"
        justify="center"
        style={{
          position: "relative",
          zIndex: -1,
          left: "85%",
          transform: "translateX(-50%)",
        }}
      >
        <RadialBlur
          layer={0}
          opacity={1}
          height="290px"
          width="270px"
          left="0px"
          top="0px"
        />
      </Flex>
      <FooterSection />
    </Flex>
  );
};

export default Fitur;
