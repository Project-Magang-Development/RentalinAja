"use client";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Divider, Flex } from "antd";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
// Import usePDF hook
import generatePDF, { Resolution, Margin } from "react-to-pdf";

// Definisikan tipe data untuk invoiceData
interface InvoiceData {
  id: string;
  status: string;
  external_id: string;
  customer: { given_names: string; email: string };
  items: { name: string }[];
  amount: number;
  currency: string;
  payment_method: string;
  payment_channel: string;
  created: string;
  expiry_date: string;
  merchant_profile_picture_url: string;
  merchant_name: string;
}

interface PaymentData {
  alamat: string;
}

//! GET DATA PAYMENT {ALAMAT} NAMUN TIDAK DISARANKAN, GUNAKAN di PAYLOAD INVOICE
function GetInvoiceComponent() {
  const targetRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ invoiceId: string }>();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    alamat: "",
  });
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    id: "",
    status: "",
    external_id: "",
    customer: { given_names: "", email: "" }, // Initialize customer as an empty object
    items: [],
    amount: 0,
    currency: "",
    payment_method: "-",
    payment_channel: "-",
    created: "",
    expiry_date: "",
    merchant_profile_picture_url: "",
    merchant_name: "",
  });

  useEffect(() => {
    setLoading(true);
    getInvoice();
  }, [params.invoiceId]);

  const getInvoice = async () => {
    try {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
      const basicAuthHeader = `Basic ${btoa(secretKey + ":")}`;
      const endpoint = `https://api.xendit.co/v2/invoices/?external_id=${params.invoiceId}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: basicAuthHeader,
          "Content-Type": "application/json",
        },
      });
      setInvoiceData(response.data[0]);
      console.log("invoice data", response.data[0]);
      setLoading(false);
    } catch (error) {
      console.log("error fetching data", error);
      setLoading(false);
    }
  };

  const options: any = {
    filename: "invoice.pdf",
    // default is `save   `
    method: "save",
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.HIGH,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.NONE,
      // default is 'A4'
      format: "A4",
      // default is 'portrait'
      orientation: "portrait",
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: "image/png",
      qualityRatio: 1,
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break,
    // so use with caution.
    overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
        compress: true,
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
        useCORS: true,
      },
    },
  };

  return (
    <Flex vertical gap={10} style={{ padding: "2rem" }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Link href="/dashboard/order">
            <Button
              size="large"
              shape="round"
              type="primary"
              style={{ width: "10%", marginInline: "1rem" }}
              icon={<ArrowLeftOutlined />}
            >
              Kembali
            </Button>
          </Link>
          <Divider style={{ margin: 0 }} />
          <div ref={targetRef}>
            <Flex vertical justify="center" style={{ paddingInline: "2rem" }}>
              <div
                className="top-line"
                style={{
                  backgroundColor: "#7469B6",
                  width: "600px",
                  height: "10px",
                  borderRadius: "0 0  10px 10px",
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: "auto", // center horizontally
                  marginRight: "auto", // center horizontally
                }}
              ></div>
              <Flex vertical>
                <p
                  style={{
                    fontSize: "2.6rem",
                    marginTop: "2rem",
                    marginBottom: 0,
                  }}
                >
                  INVOICE
                </p>
                <p
                  style={{
                    fontSize: "1.3rem",
                    marginBlock: 6,
                    color: "#4B4B4b",
                  }}
                >
                  Invoice ID : {invoiceData.id}
                </p>

                <p
                  style={{
                    fontSize: "1.3rem",
                    marginBlock: 6,
                    color: "#4B4B4b",
                  }}
                >
                  Invoice Date :{" "}
                  {new Date(invoiceData.created).toLocaleDateString()}
                </p>
              </Flex>

              <Divider style={{ border: "1px solid #8E8E8E" }} />
              <Flex justify="space-between">
                <Flex vertical flex={4}>
                  {" "}
                  <p
                    style={{
                      color: "#9E9E9E",
                      marginBottom: " 4px",
                      fontSize: "1.3rem",
                    }}
                  >
                    Nama Customer: {""}
                    <span style={{ fontSize: "1.5rem", color: "black" }}>
                      {invoiceData.customer.given_names}
                    </span>
                  </p>
                  <p
                    style={{
                      color: "#9E9E9E",
                      margin: "4px",
                      fontSize: "1.3rem",
                    }}
                  >
                    ID Invoice:{" "}
                    <span style={{ fontSize: "1.5rem", color: "black" }}>
                      {invoiceData.external_id}
                    </span>
                  </p>
                  <p
                    style={{
                      color: "#9E9E9E",
                      margin: "4px",
                      fontSize: "1.3rem",
                    }}
                  >
                    Pembayaran via:{" "}
                    <span style={{ fontSize: "1.5rem", color: "black" }}>
                      {invoiceData.payment_channel}
                    </span>
                  </p>
                  <p
                    style={{
                      color: "#9E9E9E",
                      margin: "4px",
                      fontSize: "1.3rem",
                    }}
                  >
                    Metode Pembayaran:{" "}
                    <span style={{ fontSize: "1.5rem", color: "black" }}>
                      {invoiceData.payment_method}
                    </span>
                  </p>
                </Flex>
                <Flex vertical flex={1} align="flex-end">
                  <img
                    style={{ width: "100px", marginBottom: " 20px" }}
                    src={invoiceData.merchant_profile_picture_url}
                    alt="our company"
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.7rem",
                      fontWeight: "bold",
                    }}
                  >
                    {invoiceData.merchant_name}
                  </p>
                  <h4 style={{ fontWeight: "normal ", color: "#4B4B4b" }}>
                    Status:{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        color: (() => {
                          switch (invoiceData.status) {
                            case "EXPIRED":
                              return "#6A6A6A"; // abu
                            case "PENDING":
                              return "yellow"; // kuning
                            case "PAID":
                            case "SETTLED":
                              return "#4BB261"; // hijau
                            default:
                              return "red"; // merah untuk status lainnya
                          }
                        })(),
                      }}
                    >
                      {invoiceData.status}
                    </span>
                  </h4>
                </Flex>
              </Flex>
              {/* ... inget tambahin data dlu disini ... */}
            </Flex>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              generatePDF(targetRef, options)
                .then(() => setLoading(false))
                .catch(() => setLoading(false));
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Download PDF"}
          </button>
        </>
      )}
    </Flex>
  );
}
export default GetInvoiceComponent;
