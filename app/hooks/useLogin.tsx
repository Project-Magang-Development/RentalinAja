import { useEffect, useState } from "react";
import { getCompanyName, getName } from "../services/authService";
import { useRouter } from "next/navigation";

export const useCompanyName = () => {
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setCompanyName(getCompanyName(token));
    } else {
      // router.push("/dahboard/login");
    }
  }, []);
  return companyName;
};

export const useMerchantName = () => {
  const [merchantName, setMerchantName] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setMerchantName(getName(token));
    } else {
      // router.push("/dahboard/login");
    }
  }, []);
  return merchantName;
};
