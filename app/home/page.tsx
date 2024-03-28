"use client";

import React from "react";
import { Card, Col, Row } from "antd";
import { useRouter } from "next/navigation"; // Update this line if necessary

const Home: React.FC = () => {
  const router = useRouter(); // Ensure correct import based on your Next.js version

  const plans = [
    { duration: "3 Months", price: 250000 },
    { duration: "6 Months", price: 400000 },
    { duration: "12 Months", price: 800000 },
  ];

  const handleCardClick = (selectedPlanDuration: any) => {
    // Store only the duration of the selected plan
    localStorage.setItem("planDuration", JSON.stringify(selectedPlanDuration));
    router.push("/home/register"); // Ensure the route is correct
  };

  return (
    <div>
      <Row gutter={16}>
        {plans.map((plan, index) => (
          <Col key={index} span={8}>
            <Card
              title={`Plan for ${plan.duration}`}
              bordered={false}
              onClick={() => handleCardClick(plan.duration)} // Pass only the duration of the clicked plan
            >
              <p>Price: Rp {plan.price.toLocaleString()}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
