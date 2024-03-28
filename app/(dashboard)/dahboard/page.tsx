"use client";

import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Row, Select, Spin, Statistic } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import "moment/locale/id";
import {
  BookOutlined,
  CarOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;

interface TotalAmount {
  _sum: {
    amount: number;
  };
}

export default function AdminDashboard() {
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [monthlyTotalAmount, setMonthlyTotalAmount] =
    useState<TotalAmount | null>(null);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [totalPayments, setTotalPayments] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  moment.locale("id");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when starting to fetch data
      try {
        await fetchTotalVehicles();
        await fetchTotalBookings();
        await fetchMonthlyTotalAmount();
        await fetchMonthlyBookings(selectedYear);
        await fetchTotalPayments();
      } catch (error) {
        console.error("Fetching data failed:", error);
        setError("Failed to fetch data.");
      }
      setLoading(false); // Set loading to false when all data has been fetched
    };

    fetchData();
  }, [selectedYear]);

  const fetchTotalVehicles = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    try {
      const response = await fetch("/api/vehicle/total", {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Failed to fetch the total number of vehicles.");

      const data = await response.json();
      setTotalVehicles(data);
    } catch (error) {
      console.error("Error fetching the total number of vehicles:", error);
      setError("Failed to fetch the total number of vehicles.");
    }
  };

  const fetchTotalBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    try {
      const response = await fetch("/api/booking/totalBooking", {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Failed to fetch the total number of Bookings.");

      const data = await response.json();
      setTotalBookings(data);
    } catch (error) {
      console.error("Error fetching the total number of vehicles:", error);
      setError("Failed to fetch the total number of vehicles.");
    }
  };

  const fetchTotalPayments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    try {
      const response = await fetch("/api/payment/totalPayment", {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Failed to fetch the total number of Bookings.");

      const data = await response.json();
      setTotalPayments(data);
    } catch (error) {
      console.error("Error fetching the total number of vehicles:", error);
      setError("Failed to fetch the total number of vehicles.");
    }
  };

  const fetchMonthlyBookings = async (year: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    try {
      const response = await fetch(`/api/booking/${year}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch monthly bookings.");

      const data = await response.json();
      const transformData = (data: any) => {
        return data.map((item: any) => ({
          ...item,
          month: moment.months(item.month - 1),
          "Jumlah Penyewaan": item.count,
        }));
      };
      const transformedData = transformData(data);
      setMonthlyBookings(transformedData);
    } catch (error) {
      console.error("Error fetching monthly bookings:", error);
      setError("Failed to fetch monthly bookings.");
    }
  };

  const fetchMonthlyTotalAmount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    try {
      const response = await fetch("/api/payment/totalAmount", {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch the total amount.");

      const data = await response.json();
      setMonthlyTotalAmount(data);
    } catch (error) {
      console.error("Error fetching the total amount:", error);
      setError("Failed to fetch the total amount.");
    }
  };

  if (loading) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Row>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div>
      {loading ? (
        <Spin
          size="large"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        />
      ) : (
        <Row gutter={16} style={{ margin: "20px 0" }}>
          <Col span={6}>
            <Card
              title={
                <Statistic
                  title="Total Kendaraan"
                  value={totalVehicles}
                  prefix={<CarOutlined />}
                />
              }
              bordered={true}
            />
          </Col>
          <Col span={6}>
            <Card
              title={
                <Statistic
                  title="Total Booking"
                  value={totalBookings}
                  prefix={<BookOutlined />}
                />
              }
              bordered={true}
            />
          </Col>
          <Col span={6}>
            <Card
              title={
                <Statistic
                  title="Total Pembayaran"
                  value={totalPayments}
                  prefix={<BookOutlined />}
                />
              }
              bordered={true}
            />
          </Col>
          <Col span={6}>
            <Card
              title={
                <Statistic
                  title={`Total Pendapatan Bulanan`}
                  value={`Rp ${
                    monthlyTotalAmount?._sum?.amount?.toLocaleString() ?? "0"
                  }`}
                  prefix={<DollarCircleOutlined />}
                />
              }
              bordered={true}
            />
          </Col>
          <Col span={24} style={{ marginTop: 20 }}>
            <Col span={6}>
              <Select
                defaultValue={selectedYear}
                style={{ width: 120, marginBottom: 20 }}
                onChange={(value) => setSelectedYear(value)}
              >
                {Array.from(
                  new Array(20),
                  (val, index) => moment().year() - index
                ).map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Col>
            <Card
              title={`Data Sewa Per Bulan Tahun ${selectedYear}`}
              bordered={true}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={monthlyBookings}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Jumlah Penyewaan"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
