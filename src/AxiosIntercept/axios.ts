import axios from "axios";
const BaseUrl =  process.env.NODE_ENV === "development"?window.location.origin.replace(":3000",":4500"):window.location.origin;

const axiosInstanceJwt = axios.create({
    baseURL: BaseUrl + `/api/`,
    headers: { 'Content-Type': 'application/json' },

});

const axiosCredsInstance = axios.create({
    baseURL: BaseUrl + `/auth/`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export {  axiosInstanceJwt, axiosCredsInstance };