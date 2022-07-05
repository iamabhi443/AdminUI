import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Pagination from "./components/Pagination/Pagination";
import UsersList from "./components/UsersTable/UsersTable";
import config from "./constants";
import { getUsers } from "./Services";
import { getRecordIndex } from "./functionalities/PagingFunctionality";
import { searchUsers } from "./functionalities/SearchFunctionality";

function App() {
    const [users, setUsers] = useState([]);
    const [update, setUpdate] = useState(false);
    const [page, setPage] = useState(1);
    const selectAllRef = useRef(null);
    useEffect(() => {
        getUsers(setUsers);
    }, []);

    const handleSearchUsers = (e) => {
        setPage(1);
        setUsers(searchUsers(e.target.value, users));
    };

    const handleDeleteUser = (id) => {
        let tempUsers = users.filter((user) => user.id !== id);
        setUsers(tempUsers);
        setUpdate((prevState) => !prevState);
    };

    const handleEditUser = (id) => {
        let tempUsers = users;
        const index = tempUsers.findIndex((user) => user.id === id);
        tempUsers[index].edit = true;
        setUsers(tempUsers);
        setUpdate((prevState) => !prevState);
    };

    const handleSaveUser = (id, nameRef, emailRef, roleRef) => {
        let tempUsers = users;
        const index = tempUsers.findIndex((user) => user.id === id);
        tempUsers[index].name = nameRef.current.value;
        tempUsers[index].email = emailRef.current.value;
        tempUsers[index].role = roleRef.current.value;
        tempUsers[index].edit = false;
        setUsers(tempUsers);
        setUpdate((prevState) => !prevState);
    };

    const handleSelectOne = (id) => {
        let tempUsers = users;
        const index = tempUsers.findIndex((user) => user.id === id);
        tempUsers[index].selected = !tempUsers[index].selected;
        setUsers(tempUsers);
        setUpdate((prevState) => !prevState);
    };

    const handleSelectAll = (e) => {
        const listedUserIds = users
            .filter((user) => user.show)
            .slice(index, index + config.PAGE_SIZE)
            .map((user) => user.id);

        let tempUsers = users.map((user) => {
            if (listedUserIds.includes(user.id)) {
                user.selected = e.target.checked;
                return user;
            }
            return user;
        });

        setUsers(tempUsers);
        setUpdate(!update);
    };

    const handleDeleteSelected = () => {
        if (window.confirm("Selected users will be deleted")) {
            setUsers((prevState) => prevState.filter((user) => !user.selected));
            selectAllRef.current.checked = false;
        }
    };

    const index = getRecordIndex(page);
    return (
        <div className="App">
            <input
                className="search"
                type="text"
                placeholder="Search by name, email or role"
                onChange={handleSearchUsers}
            ></input>
            <UsersList
                page={page}
                setPage={setPage}
                selectAll={handleSelectAll}
                selectAllRef={selectAllRef}
                selectOne={handleSelectOne}
                saveUser={handleSaveUser}
                editUser={handleEditUser}
                deleteUser={handleDeleteUser}
                users={users
                    .filter((user) => user.show)
                    .slice(index, index + config.PAGE_SIZE)}
            ></UsersList>
            <Pagination
                usersLength={users.filter((user) => user.show).length}
                page={page}
                setPage={setPage}
                deleteSelected={handleDeleteSelected}
            ></Pagination>
        </div>
    );
}

export default App;

