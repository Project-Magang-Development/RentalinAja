"use client";
import { Button, Flex } from "antd";
import React from "react";
import RadialBlur from "./radialBlur";
import Link from "next/link";

function FooterDaftar() {
  return (
    <Flex
      gap={15}
      vertical
      justify="center"
      align="center"
      style={{ zIndex: 2 }}
    >
      <p
        style={{
          fontSize: "25px",
          fontWeight: "bold",
          color: "#1D2130",
          textAlign: "center",
        }}
      >
        Apakah Anda siap mengembangkan bisnis Anda <br /> bersama kami?
      </p>
      <p style={{ textAlign: "center" }}>
        Bergabunglah bersama kami sekarang dan nikmati kemudahan manajemen{" "}
        <br />
        rental dengan RentalinAja! Klik di sini untuk mempelajari selengkapnya
      </p>
      <Link href={"/home/pricing"}>
        <Button
          size="large"
          style={{
            backgroundColor: "#0A142F",
            color: "white",
            width: "230px",
          }}
        >
          Daftar Sekarang!
        </Button>
      </Link>
    </Flex>
  );
}

export default FooterDaftar;
