"use client";

import React, { useEffect, useState } from "react";
import {
  BankOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Breadcrumb,
  Divider,
  Dropdown,
  Layout,
  Menu,
  message,
  Modal,
  theme,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRedirectBasedOnToken } from "@/app/hooks/useRedirectBasedOnToken";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const dashboardIconDefault = <img src="/icons/dashboard.svg" alt="Dashboard" />;
const dashboardIconActive = (
  <img src="/icons/dashboard-active.svg" alt="Dashboard" />
);
const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeItem, setActiveItem] = useState("");
  const siderWidthCollapsed = 80;
  const siderWidthExpanded = 200;
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const disableSidebar = [
    "/dashboard-admin/login",
    "/dashboard-admin/register",
  ];
  const shouldHideSidebar = disableSidebar.includes(pathname);

  const disableCompanyName = [
    "/dashboard-admin/merchant",
    "/dashboard-admin/package",
  ];
  const shouldHideCompanyName = disableCompanyName.some((route) =>
    pathname.includes(route)
  );

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  if (shouldHideSidebar) {
    return <>{children}</>;
  }

  const handleClick = (key: any) => {
    setActiveItem(key);
  };

  const items: MenuItem[] = [
    {
      key: "/dashboard-admin",
      icon:
        activeItem === "/dashboard"
          ? dashboardIconActive
          : dashboardIconDefault,
      label: (
        <Link
          href="/dashboard-admin"
          onClick={() => handleClick("/dashboard-admin")}
        >
          Dashboard
        </Link>
      ),
    },
    {
      key: "/dashboard-admin/merchant",
      icon: <UserOutlined />,
      label: <Link href="/dashboard-admin/merchant">Pelanggan</Link>,
    },
    {
      key: "/dashboard-admin/package",
      icon: <DatabaseOutlined />,
      label: <Link href="/dashboard-admin/package">Paket</Link>,
    },
  ];

  const determineSelectedKeys = (pathname: any, items: any) => {
    return items
      .filter((item: any) => {
        const routeParts = pathname.split("/").filter((part: any) => part);
        const itemKeyParts = item.key.split("/").filter((part: any) => part);
        return (
          routeParts.length === itemKeyParts.length &&
          routeParts.every(
            (part: any, index: any) => part === itemKeyParts[index]
          )
        );
      })
      .map((item: any) => item.key);
  };

  const selectedKeys = determineSelectedKeys(pathname, items);
  const initialItems = items.map((item: any) => ({
    ...item,
    style: { color: selectedKeys.includes(item.key) ? "#6B7CFF" : "black" },
  }));

  const showModalLogout = () => {
    Modal.confirm({
      title: "Konfirmasi Keluar",
      content: "Apakah Anda yakin ingin keluar?",
      okText: "Ya",
      cancelText: "Tidak",
      onOk: () => {
        Cookies.remove("tokenAdmin");
        message.success("Anda telah berhasil keluar.");
        window.location.href = "/dashboard-admin/login";
      },
    });
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "logout",
          label: "Keluar",
          icon: <LogoutOutlined />,
          onClick: showModalLogout,
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
          backgroundColor: "white",
          boxShadow: "8px 0 10px -5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          className="logo"
          style={{ margin: "35px 10px", textAlign: "center" }}
        >
          {collapsed ? (
            <span>
              <img src="/logo-rental.svg" alt="" />
            </span>
          ) : (
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={200}
              height={200}
            />
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          items={initialItems}
          selectedKeys={selectedKeys}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? siderWidthCollapsed : siderWidthExpanded,
          transition: "margin 0.2s",
          backgroundColor: "#F1F5F9",
        }}
      >
        <Content
          style={{
            margin: "100px 32px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBlock: "1rem",
              paddingInline: "3rem",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 998,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                listStyleType: "none",
                padding: 0,
                margin: 0,
                gap: 20,
              }}
            ></div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Dropdown overlay={userMenu}>
                <a
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 20,
                      gap: 20,
                    }}
                  >
                    <Avatar icon={<UserOutlined />} />
                    <div style={{ color: "black", textAlign: "right" }}>
                      <div style={{ fontSize: "smaller" }}>Admin</div>
                    </div>
                  </div>
                </a>
              </Dropdown>
            </div>
          </div>
          {!shouldHideCompanyName && (
            <>
              <Breadcrumb style={{ fontSize: "25px", fontWeight: "bold" }}>
                <Breadcrumb.Item>Selamat Datang Super Admin</Breadcrumb.Item>
              </Breadcrumb>
              <Divider />
            </>
          )}
          <div
            style={{
              padding: 24,
              backgroundColor: shouldHideCompanyName ? "#FFF" : "transparent",
              borderRadius: "10px",
              boxShadow: shouldHideCompanyName
                ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                : "none",
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "#FFF",
            boxShadow: "0px -5px 10px rgba(0, 0, 0, 0.1)",
            height: "45px",
            marginTop: "50px",
          }}
        >
          RentalinAja ©{new Date().getFullYear()} Powered by RentalinAja
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
