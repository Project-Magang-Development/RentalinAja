"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Tooltip as Detail,
  Row,
  Select,
  Statistic,
  Modal,
  Form,
  Input,
  message,
  Divider,
  InputNumber,
} from "antd";
import moment from "moment";
import "moment/locale/id";
import {
  ArrowRightOutlined,
  BookOutlined,
  CarOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  OrderedListOutlined,
  UserOutlined,
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
import useSWR from "swr";
import DashboardSkeleton from "@/app/components/dashboardSkeleton";
import Cookies from "js-cookie";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useMerchantName } from "@/app/hooks/useLogin";
import { useMerchantEmail } from "@/app/hooks/useLogin";
import { text } from "stream/consumers";

const { Option } = Select;

// ? Payout Bank options
const bankOptions = [
  { code: "ID_ALADIN", name: "Bank Aladin Syariah" },
  { code: "ID_ALLO", name: "Allo Bank Indonesia" },
  { code: "ID_AMAR", name: "Bank Amar Indonesia" },
  { code: "ID_ANZ", name: "Bank ANZ Indonesia" },
  { code: "ID_ARTHA", name: "Bank Artha Graha International" },
  { code: "ID_BALI", name: "Bank Pembangunan Daerah Bali" },
  { code: "ID_BAML", name: "Bank of America Merill-Lynch" },
  { code: "ID_BANTEN", name: "Bank Pembangunan Daerah Banten" },
  { code: "ID_BCA", name: "Bank Central Asia (BCA)" },
  { code: "ID_BCA_DIGITAL", name: "Bank Central Asia Digital" },
  { code: "ID_BCA_SYR", name: "Bank Central Asia (BCA) Syariah" },
  { code: "ID_BENGKULU", name: "Bank Pembangunan Daerah Bengkulu" },
  { code: "ID_BISNIS_INTERNASIONAL", name: "Bank Bisnis Internasional" },
  { code: "ID_BJB", name: "Bank BJB" },
  { code: "ID_BJB_SYR", name: "Bank BJB Syariah" },
  { code: "ID_BNC", name: "Bank Neo Commerce" },
  { code: "ID_BNI", name: "Bank Negara Indonesia (BNI)" },
  { code: "ID_BNP_PARIBAS", name: "Bank BNP Paribas" },
  { code: "ID_BOC", name: "Bank of China (BOC)" },
  { code: "ID_BRI", name: "Bank Rakyat Indonesia (BRI)" },
  { code: "ID_BSI", name: "Bank Syariah Indonesia (BSI)" },
  { code: "ID_BTN", name: "Bank Tabungan Negara (BTN)" },
];

// ? Data Type for the value
interface FormValue {
  banks: string;
  rekening: string;
  amount: number;
}
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
  // Modal for Pencairan Dana
  const [form] = useForm<FormValue>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const merchantName = useMerchantName();
  const merchantEmail = useMerchantEmail();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [balance, setBalance] = useState(0);
  const [incomeByMonth, setIncomeByMonth] = useState<Record<number, number>>(
    {}
  );
  const [expenseByMonth, setExpenseByMonth] = useState<Record<number, number>>(
    {}
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Current month by default
  useEffect(() => {
    const fetchBalance = async (month: any, year: any) => {
      const token = Cookies.get("token");
      const response = await fetch(
        `/api/merchant_balance?month=${month}&year=${year}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        setIncomeByMonth(data.incomeByMonth);
        setExpenseByMonth(data.expenseByMonth);
        setBalance(data.balance || 0); // Ensure consistency with property name
      } else {
        console.error("Failed to fetch balance");
      }
    };

    fetchBalance(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleMonthChange = (value: any) => {
    setSelectedMonth(value);
  };
  const handleYearChange = (year: any) => {
    setSelectedYear(year);
  };
  const selectedMonthIncome = incomeByMonth[selectedMonth] || 0;
  const selectedMonthExpense = expenseByMonth[selectedMonth] || 0;
  const selectedMonthDifference = selectedMonthIncome - selectedMonthExpense;

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

  // xendit payout function
  const performPayout = async (formValue: FormValue) => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    if (!secretKey) {
      throw Error("Tidak ada API Key Xendit");
    }

    const endpoint = "https://api.xendit.co/v2/payouts";
    const basicAuthHeader = `Basic ${Buffer.from(secretKey + ":").toString(
      "base64"
    )}`;

    const generateId = () => {
      return Math.random().toString(36).substring(2, 9);
    };

    try {
      // Get available_balance from your server
      const token = Cookies.get("token");
      const merchantResponse = await fetch("/api/merchant_balance", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!merchantResponse.ok) {
        throw new Error("Failed to fetch merchant data");
      }

      const merchantData = await merchantResponse.json();
      const availableBalance = merchantData.available_balance;

      // Check if available_balance is less than payout amount
      const payoutAmount = Number(formValue.amount);
      if (availableBalance < payoutAmount) {
        message.error("Saldo anda tidak cukup");
        return; // Stop the function execution if balance is insufficient
      }

      const payoutData = {
        reference_id: generateId(),
        channel_code: formValue.banks,
        channel_properties: {
          account_number: formValue.rekening,
          account_holder_name: merchantName,
        },
        amount: payoutAmount, // Use available_balance as the payout amount
        description: "Pencairan Dana",
        currency: "IDR",
        receipt_notification: {
          // TODO: sesuaikan email nya
          email_to: [merchantEmail],
        },
      };

      const response = await axios.post(endpoint, payoutData, {
        headers: {
          Authorization: basicAuthHeader,
          "Content-Type": "application/json",
          "Idempotency-Key": generateId(), // Ensure unique idempotency key
        },
      });
      message.success({ content: "Pencairan Dana Berhasil", duration: 6 });

      console.log("Payout successful:", response.data);

      // Update available_balance on your server
      const updateResponse = await fetch("/api/payment/withdraw", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: payoutAmount }),
      });

      if (!updateResponse.ok) {
        message.error("Gagal melakukan update balance");
        throw new Error("Failed to update balance");
      }
      setIsModalVisible(false);
      setConfirmLoading(false);
    } catch (error) {
      console.error("Failed to perform payout:", error);
      throw new Error("Failed to perform payout");
    }
  };
  const handleOk = async () => {
    try {
      const formValue = form.getFieldsValue();
      console.log("Form Value:", formValue);

      setConfirmLoading(true);
      await performPayout(formValue);
      setIsModalVisible(false);
      setConfirmLoading(false);
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const minimumWithdrawalAmount = 10000; //minimal penarikan dalam Rp
  return (
    <div>
      <>
        <Modal
          title="Laporan Keuangan"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={confirmLoading}
          okButtonProps={{ disabled: isButtonDisabled }}
        >
          <Divider
            orientation="left"
            orientationMargin={0}
            style={{
              marginBlock: "1rem",
              color: "gray",
              fontWeight: "normal",
              fontSize: "0.9rem",
            }}
          >
            Saldo
          </Divider>

          <Flex
            gap={15}
            justify="start"
            align="center"
            style={{ marginBottom: "0.5rem" }}
          >
            <DollarCircleOutlined style={{ fontSize: "1.3rem" }} />
            <p style={{ fontWeight: "bold", fontSize: "1rem" }}>
              Rp {balance.toLocaleString("id-ID")}
            </p>
          </Flex>
          <Divider
            orientation="left"
            orientationMargin={0}
            style={{
              marginBlock: "1rem",
              color: "gray",
              fontWeight: "normal",
              fontSize: "0.9rem",
            }}
          >
            Riwayat
          </Divider>

          <Flex gap={10} style={{ marginBottom: "0.5rem" }}>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: 120 }}
            >
              {monthNames.map((month, index) => (
                <Option value={index} key={index}>
                  {month}
                </Option>
              ))}
            </Select>
            <Select value={selectedYear} onChange={handleYearChange}>
              {Array.from({ length: 10 }, (_, i) => moment().year() - i).map(
                (year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                )
              )}
            </Select>
          </Flex>
          {/* <p>{currentMonthYearSentence}</p> */}

          <Flex
            vertical
            gap={10}
            style={{
              border: "1px solid #E6E6E6",
              borderRadius: "10px",
              padding: "0.5rem",
            }}
          >
            <Flex justify="space-around" align="center">
              <Flex gap={20} align="center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    height: "3rem",
                    width: "3rem",
                    borderRadius: "50%",
                    marginBottom: "0.5rem",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%" // Mengatur lebar SVG menjadi 100% dari lebar div
                    height="100%" // Mengatur tinggi SVG menjadi 100% dari tinggi div
                    viewBox="0 0 24 24"
                    fill="#45e64d"
                  >
                    <g>
                      <path d="M12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z" />
                      <polygon points="13 13.586 13 8 11 8 11 13.586 8.707 11.293 7.293 12.707 12 17.414 16.707 12.707 15.293 11.293 13 13.586" />
                    </g>
                  </svg>
                </div>
                <Flex vertical>
                  <p style={{ color: "gray" }}>Pemasukan</p>
                  <ul>
                    <li>Rp {selectedMonthIncome.toLocaleString("id-ID")}</li>
                  </ul>
                </Flex>
              </Flex>
              <Flex gap={20} align="center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    height: "3rem",
                    width: "3rem",
                    borderRadius: "50%",
                    marginBottom: "0.5rem",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%" // Mengatur lebar SVG menjadi 100% dari lebar div
                    height="100%" // Mengatur tinggi SVG menjadi 100% dari tinggi div
                    viewBox="0 0 24 24"
                    fill="red"
                    style={{ transform: "rotate(180deg)" }}
                  >
                    <g>
                      <path d="M12,2A10,10,0,1,0,22,12,10.011,10.011,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,12,20Z" />
                      <polygon points="13 13.586 13 8 11 8 11 13.586 8.707 11.293 7.293 12.707 12 17.414 16.707 12.707 15.293 11.293 13 13.586" />
                    </g>
                  </svg>
                </div>
                <Flex vertical>
                  <p style={{ color: "gray" }}>Pengeluaran</p>
                  <ul>
                    <li>Rp {selectedMonthExpense.toLocaleString("id-ID")}</li>
                  </ul>
                </Flex>
              </Flex>
            </Flex>
            <Flex vertical justify="center" align="center">
              <p style={{ color: "gray" }}>Selisih</p>
              <p>Rp {selectedMonthDifference.toLocaleString("id-ID")}</p>
            </Flex>
          </Flex>
          <Divider
            orientation="left"
            orientationMargin={0}
            style={{
              marginBlock: "0.5rem",
              color: "black",
              fontWeight: "normal",
              fontSize: "0.9rem",
            }}
          >
            Pencairan Dana
          </Divider>
          <Flex vertical>
            <p style={{ color: "#B4B4B4", marginBottom: "0.5rem" }}>
              Cairkan dana hasil pendapatan yang telah diterima ke rekening
              bank.
            </p>
            <Form form={form}>
              <Form.Item name="banks" rules={[{ message: "Please input!" }]}>
                <Select placeholder="Pilih bank">
                  {bankOptions.map((bank) => (
                    <Select.Option key={bank.code} value={bank.code}>
                      {bank.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="rekening"
                rules={[{ required: true, message: "Please input your Name!" }]}
              >
                <Input
                  prefix={<CreditCardOutlined />}
                  placeholder="Masukan No Rekening"
                />
              </Form.Item>
              <Form.Item
                name="amount"
                style={{ width: "100%" }}
                rules={[
                  { required: true, message: "Minimal penarikan Rp 10,000" },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (Number(value) > balance) {
                        setIsButtonDisabled(true);
                        return Promise.reject("Saldo anda tidak cukup");
                      }

                      setIsButtonDisabled(false);
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber<number>
                  style={{ width: "100%" }}
                  prefix="Rp "
                  placeholder="Masukan Jumlah Uang"
                  min={minimumWithdrawalAmount}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                  }
                  onChange={(value) => {
                    const amountValue = Number(value);
                    if (amountValue > balance) {
                      form.setFields([
                        {
                          name: "amount",
                          errors: ["Tidak Boleh melebihi total pendapatan"],
                        },
                      ]);
                    }
                    // Check if button should be disabled
                    const hasErrors = form
                      .getFieldsError()
                      .some(({ errors }) => errors.length > 0);
                    setIsButtonDisabled(hasErrors || !amountValue);
                  }}
                />
              </Form.Item>
            </Form>
          </Flex>
        </Modal>
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
              hasButton: true,
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
                  <h3 style={{ margin: 0, fontWeight: "bold", color: "gray" }}>
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
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",

                    alignItems: "center",
                  }}
                >
                  <Statistic
                    value={item.value}
                    valueStyle={{
                      color: "black",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  />

                  {/* //?Button Pencairan Dana */}
                  {item.hasButton && (
                    <Detail title="Laporan Keuangan">
                      <Button
                        size="small"
                        icon={<ArrowRightOutlined />}
                        style={{ backgroundColor: "white" }}
                        onClick={showModal}
                      />
                    </Detail>
                  )}
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
  );
}
