import axios from "axios";
export const refreshAccessToken = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/users/refresh-token`,
      {
        withCredentials: true, // To include the refreshToken cookie
      }
    );
    const { accessToken } = response.data;
    // Store new access token in local storage or state
    let temp = JSON.parse(localStorage.getItem("user"));
    temp["authToken"] = accessToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(temp));
    window.location.reload();
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh access token", error);
  }
};
