"use client";

import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Typography } from "antd";
import Meta from "antd/lib/card/Meta";
import { useRouter, useSearchParams } from "next/navigation"; // Perbaikan import ini
import Image from "next/image";

const { Content } = Layout;
const { Title } = Typography;

interface Vehicle {
  vehicles_id: number;
  name: string;
  capacity: number;
  imageUrl: string;
}

interface Schedule {
  schedules_id: number;
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

  useEffect(() => {
    const fetchSchedules = async () => {
      
      try {
        const capacity = searchParams.get("capacity");
        const capacityNumber = parseInt(capacity || "0");
        const apiKey = searchParams.get("apiKey");

        const response = await fetch("/api/schedule/find", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            dateRange: [startDate, endDate],
            capacityNumber,
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
  }, [searchParams, startDate, endDate]);

  const handleCardClick = (vehicles_id: number) => {
    router.push(
      `/vehicles/${vehicles_id}?startDate=${startDate}&endDate=${endDate}`
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px" }}>
        {schedules.length > 0 ? (
          <Row gutter={16} justify="center">
            {schedules.map((schedule, index) => (
              <Col key={index} span={8} style={{ marginBottom: 20 }}>
                <Card
                  hoverable
                  onClick={() => handleCardClick(schedule.Vehicle.vehicles_id)}
                  cover={
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                      }}
                    >
                      <Image
                        src={schedule.Vehicle.imageUrl}
                        alt="vehicle"
                        layout="fill"
                        objectFit="cover"
                        unoptimized={true}
                      />
                    </div>
                  }
                >
                  <Meta
                    title={schedule.Vehicle.name}
                    description={`${new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(schedule.price)} / Hari`}
                    style={{ marginBottom: 5 }}
                  />
                  <p>Capacity: {schedule.Vehicle.capacity}</p>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Row justify="center">
            <Col>
              <Title level={4}>No schedule found</Title>
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default VehiclePage;
