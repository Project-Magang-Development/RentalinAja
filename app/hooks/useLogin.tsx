import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getApiKey, getCompanyName, getName } from "../services/authService";

const useAuthToken = () => {
  const token = Cookies.get("token");
  const adminToken = Cookies.get("adminToken");
  return { token, adminToken };
};

const useRedirectBasedOnToken = () => {
  const router = useRouter();
  const { token, adminToken } = useAuthToken();

  useEffect(() => {
    if (!token && !adminToken) {
      router.push("/dashboard/login");
    } else if (!adminToken) {
      router.push("/dashboard-admin/login");
    }
  }, [router, token, adminToken]);
};

export const useCompanyName = () => {
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();
  const { token, adminToken } = useAuthToken();

  useRedirectBasedOnToken();

  useEffect(() => {
    if (token) {
      setCompanyName(getCompanyName(token));
    }
  }, [token]);

  return companyName;
};

export const useMerchantName = () => {
  const [merchantName, setMerchantName] = useState("");
  const router = useRouter();
  const { token, adminToken } = useAuthToken();

  useRedirectBasedOnToken();

  useEffect(() => {
    if (token) {
      setMerchantName(getName(token));
    }
  }, [token]);

  return merchantName;
};

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState("");
  const router = useRouter();
  const { token, adminToken } = useAuthToken();

  useRedirectBasedOnToken();

  useEffect(() => {
    if (token) {
      setApiKey(getApiKey(token));
    }
  }, [token]);

  return apiKey;
};
