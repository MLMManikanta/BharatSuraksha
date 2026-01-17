import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

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

	const login = async ({ identifier, password }) => {
		const data = await api.post("/api/auth/login", { identifier, password });
		const authUser = { id: data.userId, role: data.role, email: data.email };

		localStorage.setItem("authToken", data.jwtToken);
		localStorage.setItem("authUser", JSON.stringify(authUser));
		setToken(data.jwtToken);
		setUser(authUser);
		return authUser;
	};

	const logout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("authUser");
		setToken(null);
		setUser(null);
	};

	const value = useMemo(
		() => ({
			user,
			token,
			loading,
			isAuthenticated: Boolean(token),
			login,
			logout,
		}),
		[user, token, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
