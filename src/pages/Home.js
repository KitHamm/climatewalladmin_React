import { useEffect, useState, createContext } from "react";
import { cookies } from "../App";
import {
    GET_APPROVED,
    GET_AWAITING,
    GET_DENIED,
    APPROVE,
    DENY,
    DELETE,
} from "../components/queries";
import Login from "../components/Login";
import { useQuery, useMutation } from "@apollo/client";
export const loggedInContext = createContext();

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (cookies.get("jwt")) {
            setLoggedIn(true);
            cookies.set("jwt", cookies.get("jwt"), {
                maxAge: 21600,
                path: "/climatewalladmin",
            });
        }
    }, []);
    if (!loggedIn) {
        return (
            <loggedInContext.Provider value={[loggedIn, setLoggedIn]}>
                <Login />
            </loggedInContext.Provider>
        );
    }
    return (
        <div className="container">
            <div className="row text-center mt-5">
                <div className="col-12">
                    <h1>Responses</h1>
                </div>
            </div>

            <Awaiting />

            <Approved />

            <Denied />
        </div>
    );
}

function Awaiting() {
    const { loading, error, data } = useQuery(GET_AWAITING, {
        pollInterval: 1000,
    });
    if (loading) return <div>Loading</div>;
    if (error) return <div>Error</div>;
    if (data) {
        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        <h4>Awaiting Approval</h4>
                    </div>
                </div>
                {data.responses.data.length > 0 ? (
                    data.responses.data.map((response, index) => {
                        return (
                            <Response
                                type="awaiting"
                                response={response.attributes.response}
                                key={response.attributes.response}
                                id={response.id}
                            />
                        );
                    })
                ) : (
                    <Empty />
                )}
            </>
        );
    }
}

function Approved() {
    const { loading, error, data } = useQuery(GET_APPROVED, {
        pollInterval: 1000,
    });
    if (loading) return <div>Loading</div>;
    if (error) return <div>Error</div>;
    if (data) {
        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        <h4>Approved</h4>
                    </div>
                </div>
                {data.responses.data.length > 0 ? (
                    data.responses.data.map((response, index) => {
                        return (
                            <Response
                                type="approved"
                                response={response.attributes.response}
                                key={response.attributes.response}
                                id={response.id}
                            />
                        );
                    })
                ) : (
                    <Empty />
                )}
            </>
        );
    }
}

function Denied() {
    const { loading, error, data } = useQuery(GET_DENIED, {
        pollInterval: 1000,
    });
    if (loading) return <div>Loading</div>;
    if (error) return <div>Error</div>;
    if (data) {
        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        <h4>Denied</h4>
                    </div>
                </div>
                {data.responses.data.length > 0 ? (
                    data.responses.data.map((response, index) => {
                        return (
                            <Response
                                type="denied"
                                response={response.attributes.response}
                                key={response.attributes.response}
                                id={response.id}
                            />
                        );
                    })
                ) : (
                    <Empty />
                )}
            </>
        );
    }
}

function Response(props) {
    /* eslint-disable no-unused-vars */
    const [approveResponse, { data: dataApprove }] = useMutation(APPROVE);
    const [denyResponse, { data: dataDeny }] = useMutation(DENY);
    const [deleteResponse, { data: dataDelete }] = useMutation(DELETE);
    /* eslint-enable no-unused-vars */
    function handleClick(e, type) {
        e.preventDefault();
        switch (type) {
            case "approve":
                approveResponse({ variables: { id: props.id } });
                break;
            case "deny":
                denyResponse({ variables: { id: props.id } });
                break;
            case "delete":
                deleteResponse({ variables: { id: props.id } });
                break;
            default:
                break;
        }
    }
    return (
        <div className="row response-card">
            <div className="col-12 mb-3">{props.response}</div>
            {props.type === "awaiting" || props.type === "denied" ? (
                <div className="col-4">
                    <button
                        onClick={(e) => {
                            handleClick(e, "approve");
                        }}
                        className="btn btn-success w-100">
                        Approve
                    </button>
                </div>
            ) : (
                <div className="col-4"></div>
            )}
            {props.type === "awaiting" || props.type === "approved" ? (
                <div className="col-4">
                    <button
                        onClick={(e) => {
                            handleClick(e, "deny");
                        }}
                        className="btn btn-warning w-100">
                        Deny
                    </button>
                </div>
            ) : (
                <div className="col-4"></div>
            )}
            <div className="col-4">
                <button
                    onClick={(e) => {
                        handleClick(e, "delete");
                    }}
                    className="btn btn-danger w-100">
                    Delete
                </button>
            </div>
        </div>
    );
}

function Empty() {
    return (
        <div className="row response-card">
            <div className="col-12 mb-3">Nothing to show</div>
        </div>
    );
}
