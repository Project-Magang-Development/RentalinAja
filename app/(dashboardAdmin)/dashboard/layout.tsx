"use client";

import React, { useEffect, useState } from "react";
import { LogoutOutlined, VerifiedOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Divider, Layout, Menu, message, theme } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLogin } from "../../hooks/useLogin";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

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
    label: <Link href="/dashboard/order">Order</Link>,
  },
  {
    key: "4",
    icon: <LogoutOutlined />,
    label: "Logout",
    onClick: () => {
      localStorage.removeItem("token");
      message.success("Logout successful!");
      window.location.href = "/dashboard/login";
    },
  },
];

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const siderWidthCollapsed = 80;
  const siderWidthExpanded = 200;
  const pathname = usePathname();
  const companyName = useLogin();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const disableSidebar = ["/dashboard/login", "/dasboard/register"];
  const shouldHideSidebar = disableSidebar.includes(pathname);

  if (shouldHideSidebar) {
    return <>{children}</>;
  }

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
        <Header style={{ padding: 0, background: "#fff" }} />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Breadcrumb
            style={{ margin: "16px 0", fontSize: "22px", fontWeight: "bold" }}
          >
            <Breadcrumb.Item>{companyName}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: "#fff" }}>{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ventech ©{new Date().getFullYear()} Powered by Ventech
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
