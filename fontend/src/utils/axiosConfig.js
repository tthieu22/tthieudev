export const base_url = "http://localhost:5000/api/";

const getTokenFromLocalStorage = localStorage.getItem("token");

export const config = {
  headers: {
    ...(getTokenFromLocalStorage && {
      Authorization: `Bearer ${getTokenFromLocalStorage}`,
    }),
    Accept: "application/json",
  },
};
