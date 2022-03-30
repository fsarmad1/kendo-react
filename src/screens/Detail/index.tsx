import React, { useEffect, useState } from "react";
import {
    DropDownList,
} from "@progress/kendo-react-dropdowns";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@progress/kendo-react-inputs";
import { getSingleUser, updateUser } from "../../services/API";
import LoadingPanel from "../components/LoadingPanel";
import { userType } from "../../types";

const item = {
    userName: "",
    firstName: "",
    lastName: "",
    fullName: "",
    lastLogin: "",
    enabled: ''
}
const Detail = () => {
    const navigate = useNavigate()
    const [userItem, setUserItem] = useState<userType>(item);
    const [userItemOriginal, setUserItemOriginal] = useState<userType>(item);

    const [loading, setLoading] = useState(true);

    const { state } = useLocation();

    useEffect(() => {
        setTimeout(async () => {
            const resp = await getSingleUser(state as never);
            if (resp.status == 200) {
                setUserItem(resp.data as never);
                setUserItemOriginal(resp.data as never);
            } else {
                alert(resp.message)
            }
            setLoading(false);
        }, 3000)
    }, [])
    const handleChange = (name: string, value: string) => {
        setUserItem({ ...userItem, [name]: value });
    };

    const handleSubmit = (event: any) => {
        if (JSON.stringify(userItemOriginal) == JSON.stringify(userItem)) {
            return
        }
        setLoading(true);
        event.preventDefault();
        const newUser = userItem;
        const fullName = newUser.firstName.trim() + newUser.lastName.trim();
        if (fullName.length > 40) {
            alert('Full name must be less than 40 character')
            setLoading(false)
            return;
        } else {
            newUser.fullName = newUser.firstName.trim() + " " + newUser.lastName.trim();
        }
        setTimeout(() => {
            updateUser(newUser);
            setLoading(false)

            navigate('/')

        }, 3000)
    }



    return (
        <div style={{ width: 650, flex: 1 }}>
            {loading && <LoadingPanel />}
            <button
                className="k-button k-primary"
                onClick={() => navigate('/')}
                style={{ marginBottom: 20 }}
            >
                Go Back
            </button>


            <div>
                First name :

                <Input
                    pattern={"[A-Za-z0-9_ ]+"}
                    minLength={2}
                    maxLength={25}
                    required={true}
                    value={userItem.firstName}
                    onChange={(e) => {
                        handleChange('firstName', e.value)
                    }} />
            </div>
            <div>
                Last name :
                <Input
                    pattern={"[A-Za-z0-9_ ]+"}
                    minLength={2}
                    maxLength={25}
                    required={true}
                    value={userItem.lastName}
                    onChange={(e) => {
                        handleChange('lastName', e.value)
                    }} />

            </div>
            <div className="col-xs-12 col-sm-7 example-col">
                <p>Enabled</p>
                <DropDownList
                    style={{
                        width: "300px",
                    }}
                    data={['Yes', 'No']}
                    defaultValue={userItem.enabled}
                    onChange={(e) => {
                        handleChange('enabled', e.value)
                    }}
                />
            </div>
            <div className="k-form-buttons">
                <button
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                    onClick={handleSubmit}
                >
                    Update
                </button>
            </div>
        </div>
    )
}

export default Detail;
