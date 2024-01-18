// Login screen for the moderator area

// APollo imports
import { useMutation, useQuery } from "@apollo/client";
// React imports
import { useEffect, useState, useContext } from "react";
// gql query imports
import { LOGIN, FULL_NAME } from "./queries";
// context/cookies import
import { cookies } from "../App";
import { loggedInContext } from "../pages/Home";
import { tokenContext } from "../App";

export default function Login() {
    /* eslint-disable no-unused-vars */
    // States
    const [loggedIn, setLoggedIn] = useContext(loggedInContext);
    const [token, setToken] = useContext(tokenContext);
    const [errorText, setErrorText] = useState("");
    /* eslint-enable no-unused-vars */
    const [formState, setFormState] = useState({
        username: "",
        password: "",
    });
    // Login mutation
    const [login, { data }] = useMutation(LOGIN, {
        variables: {
            username: formState.username.replace(" ", "").toLowerCase(),
            password: formState.password.toLowerCase(),
        },
    });
    // fill with user ID when available. This will then be used to track who has approved and denied which responses.
    // Wrongly approving a response can result libel.
    const userId = data?.login?.user?.id;
    // when user id is available query for full name to use
    const { data: fullNameData } = useQuery(FULL_NAME, {
        skip: !userId,
        variables: { id: userId },
    });
    // login submit handler with catch for wrong credentials
    function handleSubmit() {
        login().catch((e) => {
            setErrorText("Incorrect username or password.");
            setFormState({ username: "", password: "" });
        });
    }
    useEffect(() => {
        // set cookies representative to login details and if use is super user
        // super user has access to modify and delete questions in the question pool for the projection
        if (fullNameData !== undefined) {
            if (
                fullNameData.usersPermissionsUser.data.attributes.role.data
                    .attributes.name === "climatewall"
            ) {
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
                if (formState.username === "themediaworkshop") {
                    cookies.set("superuser", true, {
                        maxAge: 21600,
                        path: "/climatewalladmin",
                    });
                }
                setToken(data.login.jwt);
                setLoggedIn(true);
            } else {
                setErrorText("Incorrect username or password.");
                setFormState({ username: "", password: "" });
            }
        }
    }, [data, setToken, setLoggedIn, formState.username, fullNameData]);

    // Login form
    return (
        <>
            <div className="container">
                <div className="row vh-100">
                    <div className="col-10 offset-1 login offset-3 m-auto text-center">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}>
                            <div className="cw-title-green">Welcome To</div>
                            <div className="cw-title mb-5">#ClimateWall</div>
                            <label className="cw-response-info">Username</label>
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
                            <label className="cw-response-info">Password</label>
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
                            <button className="btn btn-climate mt-3">
                                Submit
                            </button>
                        </form>
                        <div className="mt-5 cw-response-info-text">
                            {errorText}
                        </div>
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
