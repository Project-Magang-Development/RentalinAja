"use client";

import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Typography, Button, Steps } from "antd";
import {
  CarTwoTone,
  StopOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Footer } from "antd/es/layout/layout";

const { Content } = Layout;
const { Title } = Typography;
const { Step } = Steps;

interface VehicleImage {
  imageUrl: string;
  index: number;
}

interface Vehicle {
  vehicles_id: string;
  name: string;
  capacity: number;
  no_plat: string;
  model: string;
  year: string;
  VehicleImages: VehicleImage[];
}

interface Schedule {
  schedules_id: string;
  start_date: string;
  end_date: string;
  Vehicle: Vehicle;
  price: number;
}

const VehiclePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const apiKey = searchParams.get("apiKey");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const capacity = searchParams.get("capacity");
        const capacityNumber = parseInt(capacity || "0");

        const response = await fetch("/api/schedule/find", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            dateRange: [startDate, endDate],
            capacity: capacityNumber,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setSchedules(data || []);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    };

    fetchSchedules();
  }, [searchParams, startDate, endDate, apiKey]);

  const handleCardClick = (vehicles_id: string) => {
    router.push(
      `/vehicles/${vehicles_id}?startDate=${startDate}&endDate=${endDate}&apiKey=${apiKey}`
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "20px 50px" }}>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Steps
            current={1}
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <Step title="Select Date" />
            <Step title="Select Vehicle" />
            <Step title="Fill Personal Data & Payment" />
            <Step title="Done" />
          </Steps>
        </Row>
        {schedules.length > 0 ? (
          <Row gutter={[16, 24]} justify="center">
            {schedules.map((schedule, index) => (
              <Col
                key={index}
                xs={24}
                sm={12}
                md={8}
                lg={8}
                xl={6}
                style={{ marginBottom: 20 }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ padding: "16px 16px" }}>
                    <Title level={2} style={{ fontWeight: "bold", margin: 0 }}>
                      {schedule.Vehicle.name}
                    </Title>
                    <Title
                      level={4}
                      style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}
                    >
                      {schedule.Vehicle.model} {schedule.Vehicle.year}
                    </Title>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "150px",
                    }}
                  >
                    {Array.isArray(schedule.Vehicle.VehicleImages) &&
                    schedule.Vehicle.VehicleImages.length > 0 ? (
                      <Image
                        src={
                          schedule.Vehicle.VehicleImages.find(
                            (image) => image.index === 0
                          )?.imageUrl || "/default-image.jpg" 
                        }
                        alt="Vehicle Image"
                        width={500}
                        height={300}
                        objectFit="cover"
                        unoptimized={true}
                        style={{ borderRadius: "20px" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "300px",
                          backgroundColor: "#f0f0f0",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ padding: "" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "34px",
                        marginTop: "55px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CarTwoTone
                          style={{
                            fontSize: "20px",
                            marginRight: "10px",
                            color: "#6B7CFF",
                          }}
                        />
                        <Title
                          level={5}
                          style={{
                            marginLeft: "8px",
                            color: "rgba(0, 0, 0, 0.65)",
                            margin: 0,
                          }}
                        >
                          {schedule.Vehicle.no_plat}
                        </Title>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <UsergroupAddOutlined
                          style={{
                            fontSize: "20px",
                            marginRight: "10px",
                            color: "#6B7CFF",
                          }}
                        />
                        <Title
                          level={5}
                          style={{
                            marginLeft: "8px",
                            color: "rgba(0, 0, 0, 0.65)",
                            margin: 0,
                          }}
                        >
                          {schedule.Vehicle.capacity} People
                        </Title>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Row
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Title
                          level={3}
                          style={{
                            margin: 0,
                            fontWeight: "bold",
                            fontSize: 18,
                            display: "flex",
                          }}
                        >
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(schedule.price)}
                        </Title>
                        <Title
                          level={5}
                          style={{
                            color: "grey",
                            margin: 0,
                            marginLeft: 5,
                            display: "flex",
                          }}
                        >
                          /day
                        </Title>
                      </Row>
                      <Button
                        onClick={() =>
                          handleCardClick(schedule.Vehicle.vehicles_id)
                        }
                        type="primary"
                        style={{
                          backgroundColor: "#6B7CFF",
                          borderColor: "#6B7CFF",
                          borderRadius: "5px",
                          width: "100px",
                          height: "40px",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              width: "100%",
            }}
          >
            <Row align="middle" justify="center">
              <Col>
                <div style={{ textAlign: "center" }}>
                  <StopOutlined
                    style={{ fontSize: "80px", color: "#6B7CFF" }}
                  />
                </div>
                <Title
                  level={3}
                  style={{
                    color: "#6B7CFF",
                    margin: 0,
                    marginTop: 30,
                    textAlign: "center",
                  }}
                >
                  No Vehicle Found
                </Title>
                <Title
                  level={4}
                  style={{
                    color: "#6B7CFF",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  Please select another date to find a suitable vehicle
                </Title>
              </Col>
            </Row>
          </div>
        )}
      </Content>
      <Footer>
        <h1
          style={{
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.5)",
            fontWeight: "normal",
            fontSize: "1rem",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Powered By
          <Image
            src="/logo.png"
            alt="Vercel Logo"
            width={120}
            height={30}
            style={{ marginLeft: "8px" }}
          />
        </h1>
      </Footer>
    </Layout>
  );
};

export default VehiclePage;
