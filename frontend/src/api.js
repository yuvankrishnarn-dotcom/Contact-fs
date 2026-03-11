import axios from "axios";

export const api = axios.create({
  baseURL: "http://54.209.22.85:3000/api"
});
