"use client";

import React, { useState } from "react";
import { Alert, Card, Col, Row, Select, Statistic } from "antd";
import moment from "moment";
import "moment/locale/id";
import {
  BookOutlined,
  CarOutlined,
  DollarCircleOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import Title from "antd/es/typography/Title";
import useSWR, { SWRConfig } from "swr";
import DashboardSkeleton from "@/app/components/dashboardSkeleton";
import Cookies from "js-cookie";

const { Option } = Select;

const fetcher = (url: any) =>
  fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${Cookies.get("token")}`,
      "Content-Type": "application/json",
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Fetching error:", error);
      throw error;
    });

export default function AdminDashboard() {
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const currentMonth = moment().format("MMMM");
  const currentYear = moment().year();
  const currentMonthYearSentence = ` ${currentMonth} - ${currentYear}`;

  const { data: totalVehicles, error: errorTotalVehicles } = useSWR(
    "/api/vehicle/total",
    fetcher
  );
  const { data: totalOrders, error: errorTotalOrders } = useSWR(
    "/api/order/totalOrder",
    fetcher
  );
  const { data: totalBookings, error: errorTotalBookings } = useSWR(
    "/api/payment/totalPayment",
    fetcher
  );
  const { data: totalPayments, error: errorTotalPayments } = useSWR(
    "/api/payment/totalAmount",
    fetcher
  );
  const { data: monthlyPayments, error: errorMonthlyPayments } = useSWR(
    `/api/payment/${selectedYear}`,
    fetcher
  );
  const { data: monthlyBookings, error: errorMonthlyBookings } = useSWR(
    `/api/booking/${selectedYear}`,
    fetcher
  );

  const errors = [
    errorTotalVehicles,
    errorTotalOrders,
    errorTotalBookings,
    errorMonthlyPayments,
    errorMonthlyBookings,
    errorTotalPayments,
  ].find((e) => e);

  if (errors) {
    return (
      <Alert
        message="Error"
        description="An error occurred while fetching data."
        type="error"
        showIcon
      />
    );
  }

  if (
    typeof totalVehicles === "undefined" ||
    typeof totalOrders === "undefined" ||
    typeof totalBookings === "undefined" ||
    typeof monthlyPayments === "undefined" ||
    typeof monthlyBookings === "undefined" ||
    typeof totalPayments === "undefined"
  ) {
    return <DashboardSkeleton />;
  }

  const totalRevenue =
    totalPayments._sum.amount !== null ? totalPayments._sum.amount : 0;

  const monthlyPaymentsData = monthlyPayments.map((item: any) => ({
    month: moment(item.month, "M").locale("id").format("MMMM"),
    "Total Pendapatan": item.amount,
    TotalPendapatanFormatted: `Rp ${item.amount.toLocaleString()}`,
  }));

  const monthlyBookingsData = monthlyBookings.map((item: any) => ({
    month: moment(item.month, "M").locale("id").format("MMMM"),
    "Jumlah Penyewaan": item.count,
  }));

  return (
    <SWRConfig value={{ fetcher }}>
      <div>
        <>
          <Title level={3}>{currentMonthYearSentence}</Title>
          <Row gutter={16} style={{ margin: "20px 0" }}>
            {[
              {
                title: "TOTAL KENDARAAN",
                value: totalVehicles,
                icon: <CarOutlined />,
              },
              {
                title: "TOTAL ORDER",
                value: totalOrders,
                icon: <OrderedListOutlined />,
              },
              {
                title: "TOTAL BOOKING",
                value: totalBookings,
                icon: <BookOutlined />,
              },
              {
                title: "TOTAL PENDAPATAN",
                value: "Rp " + totalRevenue.toLocaleString(),
                icon: <DollarCircleOutlined />,
              },
            ].map((item, index) => (
              <Col span={6} key={index}>
                <Card
                  bordered={false}
                  bodyStyle={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3
                      style={{ margin: 0, fontWeight: "bold", color: "gray" }}
                    >
                      {item.title}
                    </h3>
                    {React.cloneElement(item.icon, {
                      style: { fontSize: "24px", color: "#8260FE" },
                    })}
                  </div>
                  <div
                    style={{
                      alignSelf: "flex-start",
                      margin: "10px 0 0",
                      width: "100%",
                    }}
                  >
                    <Statistic
                      value={item.value}
                      valueStyle={{
                        color: "black",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    />
                  </div>
                </Card>
              </Col>
            ))}
            <Col span={24} style={{ marginTop: 40 }}>
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
              <Row gutter={16} style={{ marginTop: 40 }}>
                <Col span={12}>
                  <Card
                    title={`Data Sewa Per Bulan Tahun ${selectedYear}`}
                    bordered={true}
                    style={{
                      marginBottom: 20,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      borderRadius: "10px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={monthlyBookingsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                          allowDecimals={false}
                          domain={["dataMin - 1", "dataMax + 1"]}
                          label={{
                            value: "Jumlah",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Jumlah Penyewaan"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          animationBegin={500}
                          animationDuration={2000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title={`Data Pendapatan Per Bulan Tahun ${selectedYear}`}
                    bordered={true}
                    style={{
                      marginBottom: 20,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      borderRadius: "10px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={monthlyPaymentsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                          tickFormatter={(value) =>
                            `${(value / 1000000).toFixed(1)} Jt`
                          }
                          domain={["dataMin", "dataMax"]}
                          label={{
                            value: "Total (Jt)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(value: any, name: any, props: any) => [
                            props.payload.TotalPendapatanFormatted,
                            "Total Pendapatan",
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Total Pendapatan"
                          stroke="#82ca9d"
                          name="Total Pendapatan"
                          activeDot={{ r: 8 }}
                          animationBegin={500}
                          animationDuration={2000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      </div>
    </SWRConfig>
  );
}
