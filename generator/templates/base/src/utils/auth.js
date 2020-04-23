import Lockr from "lockr";
import config from "@/config";


const tokenKey = config.tokenKey;

export function setToken(token) {
  Lockr.set(tokenKey, token);
}

export function getToken() {
  return Lockr.get(tokenKey) || '';
}

export function removeToken() {
  Lockr.rm(tokenKey);
}