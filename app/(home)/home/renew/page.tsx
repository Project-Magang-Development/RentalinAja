"use client";

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spin, Alert, Button, message, Flex } from "antd";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { CheckOutlined } from "@ant-design/icons";
import Navbar from "@/app/components/Navbar";
import FooterSection from "@/app/components/footer";
import Cookies from "js-cookie";
import Image from "next/image";
import RenewSkeleton from "@/app/components/renewSkeleton";

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

const RenewPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[][]>([]);
  const { data: packages, error } = useSWR<Package[]>(
    "/api/showPackage",
    fetcher
  );
  const router = useRouter();

  useEffect(() => {
    if (packages) {
      const filteredPackages = packages.filter(
        (pkg) => pkg.package_name.toLowerCase() !== "free"
      );
      const featureList = filteredPackages.map((pkg) =>
        pkg.package_feature ? pkg.package_feature.split(",") : []
      );
      setFeatures(featureList); 
    }
  }, [packages]);

  if (error) {
    return <Alert message="Error loading packages!" type="error" showIcon />;
  }

  if (!packages) {
    return <RenewSkeleton />;
  }

  const handleCardClick = (packageId: string) => {
    try {
      setLoading(true);
      router.push(`/home/renew/register?package=${packageId}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Terjadi kesalahan saat memilih paket");
    }
  };

  return (
    <>
      <Image
        src="/logo.png"
        alt="Logo"
        width={150}
        height={150}
        style={{ marginTop: "1rem", marginLeft: "1rem" }}
      />
      <Flex align="center" vertical style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "25px", color: "#6B7CFF", fontWeight: "bold" }}>
          Pilihan Paket Untuk Anda
        </h1>
        <p
          style={{
            fontSize: "15px",
            textAlign: "center",
            width: "50%",
            marginBlock: "1rem",
          }}
        >
          Temukan paket sempurna untuk kebutuhan Anda dengan opsi harga yang
          terjangkau. Temukan harga bersaing dan dapatkan nilai luar biasa yang
          kami tawarkan pada layanan terbaik kami.
        </p>
        <Flex
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {packages
            .filter((pkg) => pkg.package_name.toLowerCase() !== "free")
            .map((pkg, index) => (
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
                    loading={loading}
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
      <FooterSection />
    </>
  );
};

export default RenewPage;
