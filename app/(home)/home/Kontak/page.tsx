"use client";
import Navbar from "@/app/components/Navbar";
import Section from "@/app/components/RevealAnimation";
import FooterSection from "@/app/components/footer";
import { Button, Flex, Form, Input, message, notification } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";

function Kontak() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        message: values.message,
      }),
    });

    setLoading(false);

    if (response.ok) {
      notification.success({
        message: "Pesan Berhasil Di Kirim",
      });
      form.resetFields();
    } else {
      notification.error({
        message: "Pesan Gagal Di Kirim",
      });
    }
  };

  return (
    <Flex vertical style={{ overflow: "hidden" }}>
      <Navbar />
      <Section>
        <Flex
          justify="center"
          align="center"
          style={{ padding: "1rem", minHeight: "100vh" }} // Center content vertically
        >
          <Flex
            wrap="wrap"
            style={{
              position: "relative",
              width: "1000px",
              height: "auto", // Adjust height to auto to accommodate content
              borderRadius: "30px",
              overflow: "hidden",
              backgroundColor: "#C5CBF9", // Unified background color for the card
              padding: "1.5rem", // Add padding to the card for better spacing
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
              className="right-color"
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
              wrap="wrap"
              gap={30}
              justify="center"
              align="center"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <Flex vertical flex={1} justify="start" align="start">
                <p
                  style={{
                    color: "black",
                    fontSize: "25px",
                    fontWeight: "bold",
                    paddingInline: "0.5rem", // Padding to the text for better appearance
                  }}
                >
                  Hubungi Kami
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    textAlign: "justify",
                    marginBlock: "5px",
                    paddingInline: "0.5rem", // Padding to the text for better appearance
                  }}
                >
                  Di RentalinAja, kami membantu bisnis rental melalui solusi
                  teknologi inovatif yang mendorong pertumbuhan, dan mendorong
                  perubahan positif. Memiliki Pertanyaan, hubungi kami!
                </p>
                <Form
                  form={form}
                  style={{ marginTop: "8px", width: "100%" }}
                  size="large"
                  layout="vertical"
                  onFinish={onFinish}
                >
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
                    rules={[{ required: true, message: "Pesan" }]}
                  >
                    <TextArea
                      style={{
                        backgroundColor: "transparent",
                        border: "2px solid gray",
                      }}
                      placeholder="Pesan"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      style={{
                        backgroundColor: "#1D2130",
                        color: "white",
                        fontWeight: "bold",
                        width: "100%",
                      }}
                      htmlType="submit"
                      loading={loading}
                    >
                      Kirim
                    </Button>
                  </Form.Item>
                  <Flex gap={15} style={{ padding: "15px" }}>
                    <Flex>
                      <img
                        src="/icons/phone.svg"
                        alt=""
                        style={{ objectFit: "contain" }}
                      />
                    </Flex>
                    <Flex vertical>
                      <p style={{ fontWeight: "bold" }}>Whatsapp</p>
                      <p style={{ color: "#5B5B5B" }}>+6281337373155</p>
                    </Flex>
                    <Flex>
                      <img
                        src="/icons/pesan.svg"
                        alt=""
                        style={{ objectFit: "contain" }}
                      />
                    </Flex>
                    <Flex vertical>
                      <p style={{ fontWeight: "bold" }}>Email</p>
                      <p style={{ color: "#5B5B5B" }}>RentalinAja.id</p>
                    </Flex>
                    <Flex>
                      <img
                        src="/icons/web.svg"
                        alt=""
                        width={25}
                        style={{ objectFit: "contain" }}
                      />
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
                justify="center"
                align="center"
              >
                <img src="/image/map.png" alt="" width={360} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Section>
      <FooterSection />
    </Flex>
  );
}

export default Kontak;
