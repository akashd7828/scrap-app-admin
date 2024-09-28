import axios from "axios";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // dipanggil ketika user mencoba untuk login
  login: async ({ username, password }) => {
    console.log(username, password);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/admin/login`,
        {
          username,
          password,
        }
      );

      console.log(response);

      // Assuming the API returns a success message and a token
      if (response?.data?.user) {
        localStorage.setItem("username", username); // Store username in localStorage
        localStorage.setItem("role", "admin"); // Set static role as 'admin'
        localStorage.setItem("accessToken", response?.data?.accessToken); // Store the token
        localStorage.setItem("refreshToken", response?.data?.refreshToken); // Store the token

        return Promise.resolve(); // Successful login
      }

      return Promise.reject(new Error("Invalid username or password."));
    } catch (error) {
      return Promise.reject(
        new Error(
          error.response?.data?.message || "Invalid username or password."
        )
      );
    }
  },

  // dipanggil ketika user menekan tomboll logout
  logout: () => {
    localStorage.removeItem("username");
    return Promise.resolve();
  },
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("username");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // dipanggil ketika user bernavigasi ke tempat baru, cek authentikasi lagi
  checkAuth: () => {
    return localStorage.getItem("username")
      ? Promise.resolve()
      : Promise.reject();
  },
  // dipanggil ketika user bernavigasi ke tempat baru, cek permission/role lagi
  getPermissions: () => Promise.resolve(),
};
