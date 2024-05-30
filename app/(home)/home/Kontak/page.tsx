"use client";
import Navbar from "@/app/components/Navbar";
import FooterSection from "@/app/components/footer";
import { Button, Flex, Form, Input } from "antd";
import React from "react";

function Kontak() {
  return (
    <>
      <Navbar />
      <Flex justify="center" align="start" style={{ minHeight: "100vh" }}>
        <Flex
          style={{
            position: "relative",
            width: "1000px",
            height: "470px",
            borderRadius: "30px",
            overflow: "hidden",
          }}
        >
          {/* Bagian kiri dengan warna berbeda */}
          <div
            style={{
              backgroundColor: "#C5CBF9", // Ganti dengan warna kiri yang diinginkan
              width: "75%",
              height: "100%",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          ></div>
          {/* Bagian kanan dengan warna 6B7CFF */}
          <div
            style={{
              backgroundColor: "#6B7CFF",
              width: "25%",
              height: "100%",
              position: "absolute",
              right: 0,
              top: 0,
            }}
          ></div>
          {/* Konten di dalam Flex */}
          <Flex
            gap={30}
            justify="space-between"
            align="center"
            style={{
              position: "relative",
              width: "100%",
              height: "100  %",
              paddingInline: "3rem",
            }}
          >
            <Flex vertical flex={1} justify="start" align="start">
              {" "}
              <p
                style={{ color: "black", fontSize: "25px", fontWeight: "bold" }}
              >
                Hubungi Kami
              </p>
              <p
                style={{
                  fontSize: "15px",
                  textAlign: "justify",
                  marginBlock: "5px",
                }}
              >
                Di RentalinAja, kami membantu bisnis rental melalui solusi
                teknologi inovatif yang mendorong pertumbuhan, dan mendorong
                perubahan positif. Memiliki Pertanyaan, hubungi kami!
              </p>
              <Form style={{ marginTop: "8px" }} size="large" layout="vertical">
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "Nama" }]}
                >
                  <Input
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid gray",
                    }}
                    placeholder="Nama"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: "Email" }]}
                >
                  <Input
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid gray",
                    }}
                    placeholder="Email"
                    type="email"
                  />
                </Form.Item>
                <Form.Item
                  name="message"
                  rules={[{ required: true, message: "No Telepon" }]}
                >
                  <Input
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid gray",
                    }}
                    placeholder="Nomor Telp"
                  />
                </Form.Item>
                <Button
                  style={{
                    backgroundColor: "#1D2130",
                    color: "white",
                    fontWeight: "bold",
                    width: "100%",
                  }}
                  htmlType="submit"
                >
                  Kirim
                </Button>
                <Flex gap={15} style={{ padding: "15px" }}>
                  <Flex>
                    <img src="/icons/phone.svg" alt="" />
                  </Flex>
                  <Flex vertical>
                    <p style={{ fontWeight: "bold" }}>Whatsapp</p>
                    <p style={{ color: "#5B5B5B" }}>+6281337373155</p>
                  </Flex>
                  <Flex>
                    <img src="/icons/pesan.svg" alt="" />
                  </Flex>
                  <Flex vertical>
                    <p style={{ fontWeight: "bold" }}>Email</p>
                    <p style={{ color: "#5B5B5B" }}>RentalinAja.id</p>
                  </Flex>
                  <Flex>
                    <img src="/icons/web.svg" alt="" />
                  </Flex>
                  <Flex vertical>
                    <p style={{ fontWeight: "bold" }}>Web</p>
                    <p style={{ color: "#5B5B5B" }}>www.RentalinAja.id</p>
                  </Flex>
                </Flex>
              </Form>
            </Flex>
            <Flex
              style={{ paddingTop: "2rem" }}
              flex={1}
              justify="center"
              align="center"
            >
              <img src="/image/map.png" alt="" width={360} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <FooterSection />
    </>
  );
}

export default Kontak;
