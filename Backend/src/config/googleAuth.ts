import axios from "axios";

export const googleUserResponse = async (token: string) => {
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
