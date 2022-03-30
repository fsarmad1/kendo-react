import { userType } from "../types";
import users from './User.json';

let userData = [...users];
const requests = {
    get: function () {
        return {
            status: 200,
            data: userData
        };
    },
    getUser: function (name: string) {
        const user = userData.find(item => item.userName == name)
        if (user) {
            return {
                status: 200,
                data: user
            }
        } else {
            return {
                status: 401,
                message: "No User Found"
            }
        }
    },
    post: function (data: userType, header: object) {
        userData.push(data);
        return { status: 200, data: userData }
    },
    update: function (data: userType) {
        const dataUsers = userData.map((item) => {
            if (item.userName == data.userName) {
                item = data
            }
            return item
        })
        userData = dataUsers
        return dataUsers
    }
}
export default requests;