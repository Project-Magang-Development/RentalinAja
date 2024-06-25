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
import Section from "@/app/components/RevealAnimation";
import PricingSkeleton from "@/app/components/pricingSkeleton";

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
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
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
    return <PricingSkeleton />;
  }

  const handleCardClick = async (packageId: string) => {
    try {
      setLoadingButton(packageId);
      router.push(`/home/register?package=${packageId}`);
    } catch (error) {
      console.log(error);
      message.error("Terjadi kesalahan saat memilih paket");
    } finally {
      setLoadingButton(null);
    }
  };

  return (
    <>
      <Navbar />
      <Section>
        <Flex align="center" vertical>
          <h1
            style={{ fontSize: "20px", color: "#6B7CFF", fontWeight: "bold" }}
          >
            Pilihan Paket Untuk Anda
          </h1>
          <p
            style={{
              fontSize: "13px",
              textAlign: "center",
              width: "50%",
              marginTop: "1rem",
            }}
          >
            Temukan paket sempurna untuk kebutuhan Anda dengan opsi harga yang
            terjangkau. Temukan harga bersaing dan dapatkan nilai luar biasa
            yang kami tawarkan pada layanan terbaik kami.
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
                    loading={loadingButton === pkg.package_id.toString()}
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
        </Flex>
      </Section>

      <FooterSection />
    </>
  );
};

export default Home;
