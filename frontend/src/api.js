import axios from "axios";

export const api = axios.create({
  baseURL: "http://44.197.117.163:3000/api"
});
