"use client";

import React, { useEffect, useState } from "react";
import {
  LogoutOutlined,
  UserOutlined,
  VerifiedOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Divider,
  Dropdown,
  Flex,
  Layout,
  Menu,
  message,
  theme,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCompanyName, useMerchantName } from "../../hooks/useLogin";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const siderWidthCollapsed = 80;
  const siderWidthExpanded = 200;
  const router = useRouter();
  const pathname = usePathname();
  const companyName = useCompanyName();
  const merchantName = useMerchantName();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [newBookingsCount, setNewBookingsCount] = useState(0);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const disableSidebar = ["/dashboard/login"];
  const shouldHideSidebar = disableSidebar.includes(pathname);

const fetchDataWithLastChecked = async (
  endpoint: string,
  lastCheckedKey: string,
  setStateCallback: React.Dispatch<React.SetStateAction<number>>
) => {
  const token = localStorage.getItem("token");
  const lastChecked = localStorage.getItem(lastCheckedKey) || "";

  if (!token) {
    console.error("Authentication token not found.");
    return;
  }

  try {
    const query = lastChecked ? `?lastChecked=${lastChecked}` : "";
    const response = await fetch(`${endpoint}${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();
    setStateCallback(data.count);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

useEffect(() => {
  fetchDataWithLastChecked(
    "/api/order/count",
    "lastCheckedOrderTime",
    setNewOrdersCount
  );
  fetchDataWithLastChecked(
    "/api/booking/count",
    "lastCheckedBookingTime",
    setNewBookingsCount
  );

  const intervalId = setInterval(() => {
    fetchDataWithLastChecked(
      "/api/order/count",
      "lastCheckedOrderTime",
      setNewOrdersCount
    );
    fetchDataWithLastChecked(
      "/api/booking/count",
      "lastCheckedBookingTime",
      setNewBookingsCount
    );
  }, 30000); 

  return () => clearInterval(intervalId);
}, []);


  const handleOrderClick = () => {
    localStorage.setItem("lastCheckedOrderTime", Date.now().toString());
    setNewOrdersCount(0);
    router.push("/dashboard/order");
  };

  const handleBookingClick = () => {
    localStorage.setItem("lastCheckedBookingTime", Date.now().toString());
    setNewBookingsCount(0);
    router.push("/dashboard/booking");
  };

  if (shouldHideSidebar) {
    return <>{children}</>;
  }

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <VerifiedOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <VerifiedOutlined />,
      label: <Link href="/dashboard/vehicle">Kendaraan</Link>,
    },
    {
      key: "3",
      icon: <VerifiedOutlined />,
      label:
        newOrdersCount > 0 ? (
          <Badge count={newOrdersCount}>
            <a
              onClick={handleOrderClick}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Order
            </a>
          </Badge>
        ) : (
          <a
            onClick={handleOrderClick}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Order
          </a>
        ),
    },
    {
      key: "4",
      icon: <VerifiedOutlined />,
      label:
        newBookingsCount > 0 ? (
          <Badge count={newBookingsCount}>
            <a
              onClick={handleBookingClick}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Booking
            </a>
          </Badge>
        ) : (
          <a
            onClick={handleBookingClick}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Booking
          </a>
        ),
    },
  ];

  const userMenu = (
    <Menu
      items={[
        {
          key: "logout",
          label: "Keluar",
          icon: <LogoutOutlined />,
          onClick: () => {
            localStorage.removeItem("token");
            message.success("Logout successful!");
            window.location.href = "/dashboard/login";
          },
        },
      ]}
    />
  );

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={siderWidthExpanded}
        collapsedWidth={siderWidthCollapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          zIndex: 999,
        }}
      >
        <div
          className="logo"
          style={{ margin: "16px", textAlign: "center", color: "white" }}
        >
          {collapsed ? "Logo" : companyName}
        </div>
        <Divider style={{ margin: "12px 0", color: "white" }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? siderWidthCollapsed : siderWidthExpanded,
          transition: "margin 0.2s",
        }}
      >
        <Content style={{ margin: "100px 16px 0", overflow: "initial" }}>
          <Flex
            align="center"
            justify="space-between"
            style={{
              paddingBlock: "1rem",
              paddingInline: "3rem",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 998,
              backgroundColor: "#0A142F",
            }}
          >
            <Flex
              style={{
                display: "flex",
                listStyleType: "none",
                padding: 0,
                margin: 0,
                gap: 20,
              }}
              children={undefined}
            ></Flex>
            <Flex justify="center" align="center" gap={20}>
              <Dropdown overlay={userMenu}>
                <a
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <Flex
                    gap={20}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 20,
                    }}
                  >
                    <Avatar icon={<UserOutlined />} style={{}} />
                    <div style={{ color: "white", textAlign: "right" }}>
                      <div>{merchantName}</div>
                      <div style={{ fontSize: "smaller" }}>Admin</div>
                    </div>
                  </Flex>
                </a>
              </Dropdown>
            </Flex>
          </Flex>
          <Breadcrumb
            style={{ margin: "16px 0", fontSize: "22px", fontWeight: "bold" }}
          >
            <Breadcrumb.Item>{companyName}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: "#fff" }}>{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          RentalinAja ©{new Date().getFullYear()} Powered by RentalinAja
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
