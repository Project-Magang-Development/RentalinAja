"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Form, message } from "antd";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CheckOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

interface MerchantData {
  merchant_name: string;
  merchant_whatsapp: string;
  rental_name: string;
  rental_type: string;
  merchant_city: string;
  merchant_address: string;
}

const RegisterRenew = () => {
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const packageDataId = searchParams.get("package");
  const [packageData, setPackageData] = useState<any>("");
  const [packageName, setPackageName] = useState<string>("");
  const [features, setFeatures] = useState<string[]>([]);
  const [form] = useForm();
  const [pendingId, setPendingId] = useState("");

  const createMerchant = async (pending_id: string): Promise<any> => {
    try {
      const package_id = packageDataId;
      const payloadMerchant = {
        pending_id,
        plan: package_id,
        email,
      };

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
    } catch (error: any) {
      console.error(
        "Error during merchant registration:",
        error.response?.data || error
      );
      message.error("Terdapat Kesalahan dalam pendaftaran merchant");
      throw error;
    }
  };

  const createInvoice = async (
    formData: any,
    external_id: string
  ): Promise<any> => {
    try {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

      if (!secretKey) {
        throw new Error("tidak ada API Key xendit");
      }

      const endpoint = "https://api.xendit.co/v2/invoices";
      const basicAuthHeader = `Basic ${btoa(secretKey + ":")}`;
      const payload = {
        external_id,
        amount: packageData.package_price,
        description: packageData.package_description,
        currency: "IDR",
        customer: {
          given_names: formData.merchant_name,
          surname: formData.merchant_name,
          email: formData.email,
          mobile_number: formData.merchant_whatsapp,
          addresses: [
            {
              city: formData.merchant_city,
              country: "Indonesia",
              street_line1: formData.merchant_address,
            },
          ],
        },
        customer_notification_preference: {
          invoice_paid: ["email", "whatsapp"],
        },
        success_redirect_url: `http://localhost:3000/home/register/success`,
        failure_redirect_url: `http://localhost:3000/home/register?package=${packageDataId}`,
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
        return { id_invoice: id, invoice_url };
      } else {
        console.error("Gagal membuat invoice", response.data);
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
          setPackageName(response.data.package_name);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [packageDataId]);

  const handleEmailCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch merchant data. Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data?.status === 200) {
        setMerchantData(data?.data);
        form.setFieldsValue(data.data); // Set form values here
      } else {
        message.error("Merchant not found. Please enter details manually.");
        setMerchantData(null);
        form.resetFields(); // Reset form fields if merchant data is not found
      }
    } catch (error) {
      message.error("Failed to fetch merchant data");
      setMerchantData(null);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

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
        package_id: packageDataId,
        merchant_name: formData.merchant_name,
        merchant_email: email,
        merchant_whatsapp: formData.merchant_whatsapp,
        rental_name: formData.rental_name,
        rental_type: formData.rental_type,
        merchant_city: formData.merchant_city,
        merchant_address: formData.merchant_address,
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
        setPendingId(createPayment.data.newPayment.pending_id);
        return createPayment.data;
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

  const handleSubmit = async () => {
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

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      message.success("Renewal initiated successfully");
    } catch (error) {
      message.error("Failed to initiate renewal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
    >
      <div style={{ display: "flex", gap: "25px" }}>
        <div
          style={{
            backgroundColor: "white",
            height: "auto",
            width: "300px",
            padding: "2rem",
            boxShadow:
              "0 2px 4px 0 rgba(0,0,0,0.2), 0 4px 5px -1px rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)",
            borderRadius: "20px",
          }}
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
          <p style={{ marginTop: "1rem" }}>{packageData.package_description}</p>
          <ul>
            {features.length > 0 ? (
              features.map((feature, index) => (
                <li key={index} style={{ display: "flex", marginTop: "1rem" }}>
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
        </div>

        <div
          style={{
            backgroundColor: "white",
            height: "auto",
            width: "300px",
            padding: "2rem",
            boxShadow:
              "0 2px 4px 0 rgba(0,0,0,0.2), 0 4px 5px -1px rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)",
            borderRadius: "20px",
          }}
        >
          <h1>Renew Package</h1>
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={merchantData || {}}
            layout="vertical"
          >
            <Form.Item label="Merchant Email" required>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailCheck}
              />
            </Form.Item>

            {merchantData && (
              <>
                <Form.Item
                  name="merchant_name"
                  label="Merchant Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="merchant_whatsapp"
                  label="Merchant Whatsapp"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="rental_name"
                  label="Rental Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="rental_type"
                  label="Rental Type"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="merchant_city"
                  label="Merchant City"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="merchant_address"
                  label="Merchant Address"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    onClick={handleSubmit}
                  >
                    Renew Now
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterRenew;
