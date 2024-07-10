"use client";

import {
  Layout,
  Menu,
  Typography,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
} from "antd";
import { useState } from "react";
import Scheduler from "schedules-rentalinaja";
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">About</Menu.Item>
          <Menu.Item key="3">Contact</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content" style={{ margin: "16px 0" }}>
          <Title style={{ textAlign: "center", marginTop: "20px" }}>
            Welcome to Rental
          </Title>
          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col span={8}>
              <Card title="Vehicle Rental">
                <Text>
                  We offer a wide range of vehicles for rent at affordable
                  prices.
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Affordable Prices">
                <Text>
                  Our prices are competitive and tailored to meet your budget.
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Quality Service">
                <Text>
                  We ensure that you receive the best service and quality
                  vehicles.
                </Text>
              </Card>
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: "40px" }}>
            <Col span={12}>
              <Card title="Book Your Vehicle">
                <Scheduler apiKey="3318e7207af0cfa2351dc718364904446d5757b6296c9b4e97250dff2ec35ade" />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>RentalinAja ©2024</Footer>
    </Layout>
  );
}
