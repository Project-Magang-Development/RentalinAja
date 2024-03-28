import { useEffect, useState } from "react";
import { getCompanyName } from "../services/authService";
import { useRouter } from "next/navigation";

export const useLogin = () => {
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
