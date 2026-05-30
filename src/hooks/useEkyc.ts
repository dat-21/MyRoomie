import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getEkycStatus } from "../services/ekyc.service";
import type { EkycStatus } from "../types";

interface UseEkycReturn {
  ekycStatus: EkycStatus;
  isLoading: boolean;
  isVerified: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook để kiểm tra trạng thái eKYC của user hiện tại.
 * Tự động fetch từ backend khi user đăng nhập.
 */
export function useEkyc(): UseEkycReturn {
  const { user, isAuthenticated } = useAuth();
  const [ekycStatus, setEkycStatus] = useState<EkycStatus>(
    user?.ekycStatus ?? "none"
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const result = await getEkycStatus();
      setEkycStatus(result.status);
    } catch {
      // Nếu lỗi (ví dụ không có internet hoặc API chưa có), mặc định "none"
      setEkycStatus("none");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    ekycStatus,
    isLoading,
    isVerified: ekycStatus === "verified",
    refetch: fetchStatus,
  };
}
