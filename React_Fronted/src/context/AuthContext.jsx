import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------------------- LOAD AUTH FROM STORAGE -------------------- */
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  /* -------------------- LOGIN -------------------- */
  const login = async ({ identifier, password }) => {
  try {
    const res = await api.post("/login", {
      email: identifier.trim().toLowerCase(),
      password,
    });

    // 🔥 SUPPORT BOTH AXIOS MODES
    const data = res?.data ?? res;

    if (!data || !data.jwtToken || !data.userId) {
      throw new Error("Invalid login response from server");
    }

    const authUser = {
      id: data.userId,
      name: data.userData?.name || null,
      email: data.userData?.email || null,
      mobile: data.userData?.mobile || null,
    };

    localStorage.setItem("authToken", data.jwtToken);
    localStorage.setItem("authUser", JSON.stringify(authUser));

    setToken(data.jwtToken);
    setUser(authUser);

    return authUser;
  } catch (err) {
    console.error("LOGIN ERROR:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || err.message || "Login failed");
  }
};


  /* -------------------- LOGOUT -------------------- */
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
  };

  /* -------------------- UPDATE USER -------------------- */
  const updateUser = (updated) => {
    const merged = { ...(user || {}), ...(updated || {}) };
    setUser(merged);
    localStorage.setItem("authUser", JSON.stringify(merged));
    return merged;
  };

  /* -------------------- CONTEXT VALUE -------------------- */
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateUser,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* -------------------- HOOK -------------------- */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
