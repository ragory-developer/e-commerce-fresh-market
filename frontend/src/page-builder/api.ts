import { API_URL } from "@/lib/config";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getBuilderPublicPage(key: string) {
  try {
    const res = await fetch(`${API_URL}/api/builder/public/${key}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.version?.document || null;
  } catch (error) {
    console.error(`Failed to fetch builder public page for key ${key}:`, error);
    return null;
  }
}

export async function getBuilderAdminPage(key: string) {
  try {
    const res = await fetch(`${API_URL}/api/builder/pages/${key}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch builder admin page for key ${key}:`, error);
    return null;
  }
}

export async function getBuilderComponents() {
  try {
    const res = await fetch(`${API_URL}/api/builder/components`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch builder components:", error);
    return [];
  }
}
