import React, { FC, useEffect, useState } from "react";
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { orderBy } from "@progress/kendo-data-query";
import AddUser from "../AddUser";
import { observer } from "mobx-react-lite"
import { useStore } from "../../store/store";
import { toJS } from 'mobx'
import { addUser, getUsers } from "../../services/API";
import { userType } from "../../types";
import { useNavigate } from "react-router-dom";
import LoadingPanel from "../components/LoadingPanel";
import { Input } from "@progress/kendo-react-inputs";

const Dashboard: FC = observer(() => {
    const navigate = useNavigate()
    const { dataStore } = useStore();
    const [data, setData] = useState<Array<object>>(toJS(dataStore.data));
    const [filterData, setFilterData] = useState<Array<object>>(toJS(dataStore.data));
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [sort, setSort] = useState([
        {
            field: "userName",
            dir: "asc",
        },
    ]);
    const [allowUnsort] = useState(true);
    const [multiple] = useState(false);

    useEffect(() => {
        setTimeout(async () => {
            const resp = await getUsers();
            if (resp.status == 200) {
                dataStore.loadData(resp.data);
                setData(resp.data)
                setFilterData(resp.data)
            }
            setLoading(false);
        }, 3000)
    }, [])

    const sortChange = (event: { sort: any }) => {
        const fetchSort = orderUsers(event.sort);
        setFilterData(fetchSort)
        setSort(event.sort);
    };

    const orderUsers = (sort: any) => {
        return orderBy(data, sort);
    };
    const closeModal = () => {
        setShowModal(false)
    }
    const handleSearch = (event: { value: string }) => {
        if (!event.value) {
            setFilterData(data);
            return
        }
        const value = event.value.toLowerCase();
        let result = [];
        result = data.filter((item: any) => {
            return item.userName.toLowerCase().includes(value)
        });
        setFilterData(result);
    }
    const cellWithBackGround = (props: any) => {
        const examplePrice = props.dataItem.enabled == 'No';

        const style = {
            backgroundColor: examplePrice
                ? "red"
                : "",
        };
        const field = props.field || "";
        return (
            <td style={style}>
                {props.dataItem[field]}
            </td>
        );
    };
    return (
        <div style={{ flex: 1 }}>
            {loading && <LoadingPanel />}
            <div>
                <Input onChange={handleSearch} />
            </div>
            <div>
                <button
                    title="Add new"
                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                    onClick={() => {
                        setShowModal(true);
                    }}
                >
                    New User
                </button>
            </div>
            <Grid
                sortable={{
                    allowUnsort: allowUnsort,
                    mode: multiple ? "multiple" : "single",
                }}
                pageable={true}
                sort={sort as never}
                onSortChange={sortChange}
                onRowClick={(data) => navigate('/detail', { state: data.dataItem.userName })}
                data={filterData}>
                <GridColumn field="userName" title="User Name" />
                <GridColumn field="fullName" title="Full Name" />
                <GridColumn field="lastLogin" title="Last Login" />
                <GridColumn cell={cellWithBackGround} field="enabled" title="Enabled" />
            </Grid>
            {showModal && <AddUser
                cancelEdit={closeModal}
                addUser={(user: userType) => {
                    setLoading(true)
                    setShowModal(false)
                    setTimeout(async () => {
                        const resp = await addUser(user);
                        if (resp.status == 200) {
                            dataStore.loadData(resp.data);
                            setData(resp.data);
                            setFilterData(resp.data)
                            alert("User Added");
                        }
                        setLoading(false);
                    }, 3000)
                }}
            />}
        </div>
    )
}
)
export default Dashboard;
