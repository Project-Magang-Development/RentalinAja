"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Layout,
  Select,
  Typography,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CarOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import FooterSection from "@/app/components/footer";

const { Content } = Layout;
const { Title } = Typography;

interface FormData {
  given_name: string;
  surname: string;
  whatsapp: string;
  company: string;
  jenis_rental: string;
  city: string;
  street_line1: string;
  email: string;
  password: string;
}

const RegisterDashboard: React.FC = () => {
  const searchParams = useSearchParams();
  const packageDataId = searchParams.get("package");
  const [packageData, setPackageData] = useState<any>("");
  const [packageName, setPackageName] = useState<string>("");
  const [pendingId, setPendingId] = useState("");
  const [form] = useForm<FormData>();
  const [packageId, setPackageId] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);

  useEffect(() => {
    //sesuaikan dengan url package yang dipilih
    const package_id = searchParams.get("package");
    setPackageId(package_id);
  }, [searchParams]);

  // Fungsi untuk mengambil data pembayaran saat komponen dimuat
  useEffect(() => {
    if (packageDataId) {
      axios
        .get(`/api/showDetailPackage?package_id=${packageDataId}`)
        .then((response) => {
          setPackageData(response.data);
          const featureList =
            response.data.features ||
            (response.data.package_feature
              ? response.data.package_feature.split(", ")
              : []);
          setFeatures(featureList);

          // Simpan package_name dalam state
          setPackageName(response.data.package_name);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [packageDataId]);

  // function create invoice xendit yang diisi dari input form
  const createInvoice = async (
    formData: FormData,
    external_id: string
  ): Promise<any> => {
    try {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

      if (!secretKey) {
        throw Error("tidak ada API Key xendit");
      }
      const endpoint = "https://api.xendit.co/v2/invoices";
      const basicAuthHeader = `Basic ${btoa(secretKey + ":")}`;
      const payload = {
        //TODO: Rubah external id
        external_id: external_id,
        amount: packageData.package_price,
        description: packageData.package_description,
        currency: "IDR",
        customer: {
          given_names: formData.given_name,
          surname: formData.surname,
          email: formData.email,
          mobile_number: formData.whatsapp,
          addresses: [
            {
              city: formData.city,
              country: "Indonesia",
              street_line1: formData.street_line1,
            },
          ],
        },
        customer_notification_preference: {
          invoice_paid: ["email", "whatsapp"],
        },
        // redirect ke tempat register yang sama tapi sesuai package yang dipilih
        success_redirect_url: `http://localhost:3000/home/register?package=${packageId}`,
        failure_redirect_url: `http://localhost:3000/home/register?package=${packageId}`,
        items: [
          {
            name: packageData.package_name,
            quantity: 1,
            price: packageData.package_price,
          },
        ],
      };

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: basicAuthHeader,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const { invoice_url, id } = response.data;
        console.log(response.data);

        return { id_invoice: id, invoice_url };
      } else {
        console.error("Gagal membuat invoice");
        console.log(response.data);
        return { id_invoice: null };
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      return { id_invoice: null };
    }
  };

  useEffect(() => {
    if (pendingId && packageData.package_price === 0) {
      createMerchant(pendingId);
    }
  }, [pendingId, packageData.package_price]);

  const createPaymentInvoice = async (
    formData: any,
    external_id: string,
    package_name: string
  ): Promise<any> => {
    try {
      let status = "Pending"; // Default status
      if (packageData.package_price === 0) {
        status = "PAID"; // Update status to PAID if package price is 0
      }

      const payloadPayment = {
        amount: packageData.package_price,
        invoice_id: external_id,
        package_name,
        package_id: packageId,
        merchant_name: formData.given_name + " " + formData.surname,
        merchant_email: formData.email,
        merchant_whatsapp: formData.whatsapp,
        rental_name: formData.company,
        rental_type: formData.jenis_rental,
        merchant_city: formData.city,
        merchant_address: formData.street_line1,
        password: formData.password,
        status, // Set status here
      };

      const createPayment = await axios.post(
        "/api/payment/createPendingPayment",
        payloadPayment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (createPayment.status === 200) {
        console.log("Payment created successfully:", createPayment.data);
        // Mengambil pending_id dari respons createPayment

        // Mengatur pending_id ke dalam state
        setPendingId(createPayment.data.newPayment.pending_id);
        console.log(pendingId);

        return createPayment.data; // Pastikan respons mengandung pending_id
      } else {
        console.error("Failed to create payment:", createPayment.data);
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      console.error("Error during payment creation:", error);
      message.error("Terdapat Kesalahan dalam pembuatan pembayaran");
      throw error;
    }
  };
  // !Pindah create merchant pada logika update callback
  // function create merchant yang diisi dari input form
  const createMerchant = async (pending_id: string): Promise<any> => {
    try {
      const package_id = packageId;
      const payloadMerchant = {
        pending_id: pending_id,
        plan: package_id,
      };

      console.log("Payload Merchant:", payloadMerchant);

      const registerMerchant = await axios.post(
        "/api/register_admin",
        payloadMerchant,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (registerMerchant.status === 200 && registerMerchant.data) {
        console.log("Merchant registered successfully:", registerMerchant.data);
        return registerMerchant.data;
      } else {
        console.error("Failed to register merchant:", registerMerchant.data);
        throw new Error("Failed to register merchant");
      }
    } catch (error: Error | any) {
      console.error(
        "Error during merchant registration:",
        error.response?.data || error
      );
      message.error("Terdapat Kesalahan dalam pendaftaran merchant");
      throw error;
    }
  };

  //TODO: buatkan function submit yang mengirim payload invoice serta payload merchant ke form yang diteruskan ke db merchanPayment
  const onFinish = async () => {
    const external_id = "INV-" + Math.random().toString(36).substring(2, 9);
    setLoading(true);
    try {
      const formData = form.getFieldsValue();
      console.log("FormData:", formData);

      let invoiceResult = { id_invoice: null, invoice_url: null };

      if (packageData.package_price > 0) {
        invoiceResult = await createInvoice(formData, external_id);
        console.log("Invoice Result:", invoiceResult);

        if (!invoiceResult.id_invoice) {
          throw new Error("Failed to create invoice");
        }
      }

      const paymentResult = await createPaymentInvoice(
        formData,
        external_id,
        packageName
      );
      console.log("Payment Result:", paymentResult);

      if (!paymentResult) {
        throw new Error("Failed to create payment invoice");
      }

      if (packageData.package_price === 0) {
        // const merchantResult = await createMerchant(
        //   paymentResult.newPayment.pending_id
        // );
        console.log("Merchant Dibuat");
      }

      message.success("Registration successful!");
      if (invoiceResult.invoice_url) {
        window.location.href = invoiceResult.invoice_url;
      } else {
        if (packageData.package_price > 0) {
          console.log("Terjadi Kesalahan");
          message.error("Terjadi Kesalahan");
        } else {
          console.log("Tidak ada invoice yang perlu dibuat");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Registration failed:", error);
      message.error("Registration failed.");
      setLoading(false);
    }
  };

  // mengatur style form border
  const formBig = {
    height: "3rem",
    borderRadius: "15px",
  };

  return (
    <>
      <Navbar />
      <Layout
        className="layout"
        style={{
          zIndex: 1,
          minHeight: "100vh",
          backgroundColor: "transparent",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/*//Container untuk Layout Form  */}
        <img
          src="/waves/wave6.svg"
          style={{
            overflow: "hidden",
            objectFit: "fill",
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "auto",
            zIndex: 0,
            top: "-200px",
            marginBottom: "10px",
          }}
        />

        <Content
          style={{
            backgroundColor: "transparent",
            justifyItems: " center",
            zIndex: 1,
            padding: "50px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          <Flex align="center" vertical gap={25} style={{ zIndex: 1 }}>
            <Flex
              vertical
              style={{
                backgroundColor: "white",
                height: "auto",
                width: "300px",
                padding: "2rem",
                boxShadow:
                  "0 2px 4px 0 rgba(0,0,0,0.2), 0 4px 5px -1px rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)",
                borderRadius: "20px",
              }}
              justify="start"
            >
              <p style={{ fontSize: "19px", fontWeight: "bold" }}>
                {packageData.package_name}
              </p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                Rp.
                {packageData?.package_price
                  ? packageData.package_price.toLocaleString()
                  : "0"}
              </p>
              <p
                style={{
                  color: "#A5A5A5",
                  fontSize: "17px",
                  fontWeight: "normal",
                }}
              >
                /bulan
              </p>
              {/* //TODO: tambahkan field package_description */}
              {/* //TODO: tambahkan field package_feature */}
              <p style={{ marginTop: "1rem" }}>
                {packageData.package_description}
              </p>
              <ul>
                {features.length > 0 ? (
                  features.map((feature, index) => (
                    <li
                      key={index}
                      style={{ display: "flex", marginTop: "1rem" }}
                    >
                      <CheckOutlined
                        style={{ marginRight: "5px", color: "#6B7CFF" }}
                      />

                      {feature}
                    </li>
                  ))
                ) : (
                  <li>Tidak ada fitur yang tersedia</li>
                )}
              </ul>
            </Flex>
            <Flex
              gap={15}
              vertical
              style={{
                backgroundColor: "white",
                borderRadius: " 20px",
                height: "auto",
                padding: "1rem",
              }}
            >
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                Metode Pembayaran
              </p>
              <img
                style={{ width: "100%" }}
                src="/image/metode.png"
                alt="metode"
              />
            </Flex>
          </Flex>
          <Flex
            style={{
              padding: "50px",
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              boxShadow:
                "0 2px 4px 0 rgba(0,0,0,0.2), 0 4px 5px -1px rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)",
            }}
          >
            {/* form mengirim value ke function createInvoice dan createMerchant */}
            <Form
              form={form}
              name="register"
              className="register-form"
              onFinish={onFinish}
              style={{ maxWidth: "900px" }}
              size="large"
            >
              <Title
                level={2}
                style={{
                  textAlign: "center",
                  marginBottom: "24px",
                  fontWeight: "bolder",
                }}
              >
                Pendaftaran Rental
              </Title>
              <p
                style={{
                  fontSize: "19px",
                  fontWeight: "bold",
                  marginBottom: 0,
                }}
              >
                Register Penanggung Jawab Rental
              </p>
              <Divider style={{ border: "1px solid #6B7CFF", marginTop: 5 }} />
              <Flex gap={10}>
                <Form.Item
                  name="given_name"
                  rules={[
                    { required: true, message: "Please input your Name!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Nama Depan"
                    style={formBig}
                  />
                </Form.Item>
                <Form.Item
                  name="surname"
                  rules={[
                    { required: true, message: "Please input your Name!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Nama Belakang"
                    style={formBig}
                  />
                </Form.Item>
              </Flex>
              <Form.Item
                name="whatsapp"
                rules={[
                  {
                    required: true,
                    message: "Please input your whatsapp number!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                  placeholder="No Whatsapp"
                  style={formBig}
                />
              </Form.Item>
              {/*//Form  Data rental  */}

              <p
                style={{
                  fontSize: "19px",
                  fontWeight: "bold",
                  marginBottom: 0,
                }}
              >
                Data Rental
              </p>
              <Divider style={{ border: "1px solid #6B7CFF", marginTop: 5 }} />
              <Flex gap={10} style={{ width: "100%" }}>
                <Form.Item
                  name="company"
                  rules={[
                    {
                      required: true,
                      message: "Masukan Nama Rental!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Nama Rental"
                    style={formBig}
                  />
                </Form.Item>
                <Form.Item
                  style={{
                    width: "50%",
                  }}
                  name="jenis_rental"
                  rules={[
                    {
                      required: true,
                      message: "Masukan Nama Rental!",
                    },
                  ]}
                >
                  <Select
                    className="custom-select"
                    placeholder="Jenis Rental"
                    style={{
                      height: "3rem",
                      borderColor: "black",
                      borderRadius: "20px",
                    }}
                  >
                    <Select.Option value="motor">Motor</Select.Option>
                    <Select.Option value="mobil">Mobil</Select.Option>
                    <Select.Option value="mobilMotor">
                      Motor & Mobil
                    </Select.Option>
                    {/* //TODO: tambahkan option lain */}
                  </Select>
                </Form.Item>
              </Flex>
              <Form.Item
                name="city"
                rules={[
                  {
                    required: true,
                    message: "Masukan Kota",
                  },
                ]}
              >
                <Input
                  prefix={
                    <EnvironmentOutlined className="site-form-item-icon" />
                  }
                  placeholder="Kota"
                  style={formBig}
                />
              </Form.Item>
              <Form.Item
                name="street_line1"
                rules={[
                  {
                    required: true,
                    message: "Masukan alamat",
                  },
                ]}
              >
                <Input
                  prefix={
                    <EnvironmentOutlined className="site-form-item-icon" />
                  }
                  placeholder="Jalan"
                  style={formBig}
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email!",
                    type: "email",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                  style={formBig}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  style={formBig}
                />
              </Form.Item>
              <Form.Item>
                <Flex justify="center">
                  <Button
                    style={{
                      color: " white",
                      width: "50%",
                      marginTop: "24px",
                      backgroundColor: " #6B7CFF",
                    }}
                    htmlType="submit"
                    className="register-form-button"
                    block
                    loading={loading}
                  >
                    Kirim Permintaan
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
          </Flex>
        </Content>
        <FooterSection />
      </Layout>
    </>
  );
};

export default RegisterDashboard;
