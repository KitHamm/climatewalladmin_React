import { useEffect, useState, useContext } from "react";
import { cookies } from "../App";
import { LOGIN, FULL_NAME } from "./queries";
import { useMutation, useQuery } from "@apollo/client";
import { loggedInContext } from "../pages/Home";
import { tokenContext } from "../App";

export default function Login() {
    /* eslint-disable no-unused-vars */
    const [loggedIn, setLoggedIn] = useContext(loggedInContext);
    const [token, setToken] = useContext(tokenContext);
    /* eslint-enable no-unused-vars */
    const [formState, setFormState] = useState({
        username: "",
        password: "",
    });
    const [login, { data }] = useMutation(LOGIN, {
        variables: {
            username: formState.username.replace(" ", "").toLowerCase(),
            password: formState.password.toLowerCase(),
        },
    });
    const userId = data?.login?.user?.id;
    const { data: fullNameData } = useQuery(FULL_NAME, {
        skip: !userId,
        variables: { id: userId },
    });
    function handleSubmit() {
        login();
    }
    useEffect(() => {
        if (fullNameData !== undefined) {
            cookies.set("jwt", data.login.jwt, {
                maxAge: 21600,
                path: "/climatewalladmin",
            });
            cookies.set(
                "user",
                fullNameData.usersPermissionsUser.data.attributes.fullName,
                {
                    maxAge: 21600,
                    path: "/climatewalladmin",
                }
            );
            setToken(data.login.jwt);
            setLoggedIn(true);
        }
    }, [data, setToken, setLoggedIn, formState.username, fullNameData]);
    return (
        <>
            <div className="container">
                <div className="row vh-100">
                    <div className="col-6 login offset-3 m-auto text-center">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}>
                            <h3 className="mb-5">Login</h3>
                            <label>Username</label>
                            <input
                                required
                                value={formState.username}
                                onChange={(e) => {
                                    setFormState({
                                        ...formState,
                                        username: e.target.value,
                                    });
                                }}
                                type="text"
                                placeholder="Username"
                            />
                            <label>Password</label>
                            <input
                                required
                                value={formState.password}
                                onChange={(e) => {
                                    setFormState({
                                        ...formState,
                                        password: e.target.value,
                                    });
                                }}
                                type="password"
                                placeholder="Password"
                            />
                            <button className="btn btn-success mt-3">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
                <dialog id="forgot">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h4>Forgot Password</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center mb-2">
                            Please contact -
                        </div>
                        <div className="col-12 text-center mb-2">
                            <a href="mailto:kit@themediaworkshop.co.uk">
                                kit@themediaworkshop.co.uk
                            </a>
                        </div>
                        <div className="col-12 text-center mb-2">
                            to request or reset password.
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.reload();
                                }}
                                className="btn btn-danger">
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    );
}
