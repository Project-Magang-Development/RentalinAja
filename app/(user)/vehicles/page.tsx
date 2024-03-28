"use client";

import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import { useRouter } from "next/navigation";

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
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("schedules");
    if (storedData) {
      const data = JSON.parse(storedData);
      setSchedules(data || []);
    }
  }, []);

  const handleCardClick = (vehicles_id: number) => {
    router.push(`/vehicles/${vehicles_id}`);
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
                    <img
                      alt={schedule.Vehicle.name}
                      src={schedule.Vehicle.imageUrl || "/default_image.jpg"}
                    />
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
