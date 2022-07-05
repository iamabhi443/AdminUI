import axios from "axios";
import { usersResponse } from "./functionalities/UsersFunctionality";

const API_URL =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const getUsers = (setUsers) => {
    axios
        .get(API_URL)
        .then((res) => {
            setUsers(usersResponse(res.data));
        })
        .catch((err) => getLocalUsers(setUsers));
};

const getLocalUsers = (setUsers) => {
    axios
        .get("./members.json")
        .then((res) => {
            setUsers(usersResponse(res.data));
        })
        .catch((error) => console.error(error));
};
export { getUsers };
