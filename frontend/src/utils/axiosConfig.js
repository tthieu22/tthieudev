export const base_url = "http://13.211.19.159/api/";

const getTokenFromLocalStorage = localStorage.getItem("token");

export const config = {
  headers: {
    ...(getTokenFromLocalStorage && {
      Authorization: `Bearer ${getTokenFromLocalStorage}`,
    }),
    Accept: "application/json",
  },
};
