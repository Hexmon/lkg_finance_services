import { BASE_URLS } from "@/config/endpoints";
import { RETAILER_ENDPOINTS } from "@/config/endpoints";

export async function uploadReceiptFile(file: File) {
  const url =
    BASE_URLS.RETAILER_BASE_URL +
    RETAILER_ENDPOINTS.FUND_REQUEST.RECEIPT_FILE_UPLOAD;

  const formData = new FormData();
  formData.append("file", file);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("bt_csrf="))
    ?.split("=")[1];

  console.log("CSRF Token:", token);

  if (!token) {
    throw new Error("Missing authentication token (bt_auth cookie not found)");
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      credentials: "include",
    });
    console.log("Upload response status:", res.status);

    if (res.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token");
    }
    if (res.status === 409) {
      throw new Error("Conflict: File may already exist");
    }

    const data = await res.json().catch(() => null);
    console.log("Upload response data:", data);
    if (!res.ok) throw new Error(data?.message || "File upload failed");
    return data;
  } catch (err) {
    console.error("Network or CORS error:", err);
    throw new Error(
      "Network error or CORS issue. Check endpoint and server status."
    );
  }
}
