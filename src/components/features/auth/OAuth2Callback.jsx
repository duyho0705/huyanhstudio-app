import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../api/AuthContext";

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  // const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get("accessToken");
        const error = searchParams.get("error");

        if (error) {
          // ... error handling
          return;
        }

        if (token) {
          // 1. Popup Mode: Send token to main window
          if (window.opener) {
            window.opener.postMessage(
              { type: "OAUTH2_LOGIN_SUCCESS", accessToken: token },
              window.location.origin
            );
            window.close();
            return;
          }

          // 2. Fallback: Full page redirect mode
          const userData = await login({ accessToken: token });
          
          const roles = Array.isArray(userData?.roles) ? userData.roles : [];
          if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_STAFF")) {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      } catch {
        // Silent fail or redirect
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  const handleCancel = () => {
    navigate("/", { replace: true });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "48px",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
        }}
      >
        {status === "processing" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                border: "4px solid rgba(255, 255, 255, 0.3)",
                borderTop: "4px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 24px",
              }}
            />
            <h2 style={{ marginBottom: "12px", fontSize: "24px" }}>
              Đang xử lý...
            </h2>
            <p style={{ opacity: 0.9, fontSize: "16px" }}>
              Vui lòng đợi trong giây lát
            </p>
          </>
        )}

        {status === "logging_in" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                border: "4px solid rgba(255, 255, 255, 0.3)",
                borderTop: "4px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 24px",
              }}
            />
            <h2 style={{ marginBottom: "12px", fontSize: "24px" }}>
              Đang đăng nhập...
            </h2>
            <p style={{ opacity: 0.9, fontSize: "16px" }}>
              Xác thực thông tin của bạn
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(16, 185, 129, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "32px",
              }}
            >
              ✓
            </div>
            <h2 style={{ marginBottom: "12px", fontSize: "24px" }}>
              Đăng nhập thành công!
            </h2>
            <p style={{ opacity: 0.9, fontSize: "16px" }}>
              Đang chuyển hướng...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(239, 68, 68, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "32px",
              }}
            >
              ✕
            </div>
            <h2 style={{ marginBottom: "12px", fontSize: "24px" }}>
              Đăng nhập thất bại
            </h2>
            <p style={{ opacity: 0.9, fontSize: "16px", marginBottom: "24px" }}>
              Có lỗi xảy ra. Đang quay lại...
            </p>
          </>
        )}

        <button
          onClick={handleCancel}
          style={{
            marginTop: "24px",
            padding: "12px 32px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "2px solid white",
            borderRadius: "8px",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "white";
            e.target.style.color = "#667eea";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.2)";
            e.target.style.color = "white";
          }}
        >
          Hủy
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default OAuth2Callback;
