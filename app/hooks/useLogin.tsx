import { useEffect, useState } from "react";
import {
  getApiKey,
  getCompanyName,
  getEmail,
  getName,
} from "../services/authService";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useCompanyName = () => {
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setCompanyName(getCompanyName(token));
    } else {
      router.push("/dashboard/login");
    }
  }, []);
  return companyName;
};

export const useMerchantName = () => {
  const [merchantName, setMerchantName] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setMerchantName(getName(token));
    } else {
      router.push("/dashboard/login");
    }
  }, []);
  return merchantName;
};

export const useMerchantEmail = () => {
  const [merchantEmail, setMerchantEmail] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setMerchantEmail(getEmail(token));
    } else {
      router.push("/dashboard/login");
    }
  }, []);
  return merchantEmail;
};

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setApiKey(getApiKey(token));
    } else {
      router.push("/dashboard/login");
    }
  }, []);
  return apiKey;
};
