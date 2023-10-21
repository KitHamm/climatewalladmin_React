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
    if (loading)
        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        <h4>Awaiting Approval</h4>
                    </div>
                </div>
                <Empty text="Loading..." />
            </>
        );
    if (error)
        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        <h4>Awaiting Approval</h4>
                    </div>
                </div>
                <Empty text="Error." />
            </>
        );
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
                                question={response.attributes.question}
                                response={response.attributes.response}
                                key={response.attributes.response}
                                id={response.id}
                            />
                        );
                    })
                ) : (
                    <Empty text="Nothing to show." />
                )}
            </>
        );
    }
}

function Approved() {
    const { loading, error, data } = useQuery(GET_APPROVED, {
        pollInterval: 1000,
    });
    if (loading)
        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        <h4>Approved</h4>
                    </div>
                </div>
                <Empty text="Loading..." />
            </>
        );
    if (error)
        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        <h4>Approved</h4>
                    </div>
                </div>
                <Empty text="Error." />
            </>
        );
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
                                question={response.attributes.question}
                                response={response.attributes.response}
                                key={response.attributes.response}
                                id={response.id}
                            />
                        );
                    })
                ) : (
                    <Empty text="Nothing to show." />
                )}
            </>
        );
    }
}

function Denied() {
    const { loading, error, data } = useQuery(GET_DENIED, {
        pollInterval: 1000,
    });
    if (loading)
        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        <h4>Denied</h4>
                    </div>
                </div>
                <Empty text="Loading..." />
            </>
        );
    if (error)
        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        <h4>Denied</h4>
                    </div>
                </div>
                <Empty text="Error." />
            </>
        );
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
                                question={response.attributes.question}
                                response={response.attributes.response}
                                key={response.attributes.response}
                                id={response.id}
                            />
                        );
                    })
                ) : (
                    <Empty text="Nothing to show." />
                )}
            </>
        );
    }
}

function Response(props) {
    /* eslint-disable no-unused-vars */
    const [formState, setFormState] = useState({
        reason: "",
    });
    const [
        approveResponse,
        { data: dataApprove, loading: loadingApprove, error: errorApprove },
    ] = useMutation(APPROVE);
    const [
        denyResponse,
        { data: dataDeny, loading: loadingDeny, error: errorDeny },
    ] = useMutation(DENY);
    const [
        deleteResponse,
        { data: dataDelete, loading: loadingDelete, error: errorDelete },
    ] = useMutation(DELETE);
    /* eslint-enable no-unused-vars */
    function handleClick(e, type) {
        e.preventDefault();
        switch (type) {
            case "approve":
                approveResponse({
                    variables: {
                        id: props.id,
                        reason: "Your response has been approved and should appear on the wall shortly.",
                    },
                });
                break;
            case "deny":
                //denyResponse({ variables: { id: props.id } });
                document.getElementById("deny-modal").showModal();
                document.body.style.overflow = "hidden";
                break;
            case "delete":
                deleteResponse({ variables: { id: props.id } });
                break;
            default:
                break;
        }
    }
    function modalClick(e, type) {
        e.preventDefault();
        switch (type) {
            case 1:
                denyResponse({
                    variables: {
                        id: props.id,
                        reason: "Your response has not been approved due to the use of inappropriate language.",
                    },
                });
                break;
            case 2:
                denyResponse({
                    variables: {
                        id: props.id,
                        reason: "Your response has not been approved due to the extremest nature of the content.",
                    },
                });
                break;
            case 3:
                denyResponse({
                    variables: {
                        id: props.id,
                        reason: "Your response has not been approved as it is not appropriate or suitable for this work.",
                    },
                });
                break;
            case 4:
                denyResponse({
                    variables: {
                        id: props.id,
                        reason: formState.reason,
                    },
                });
                break;
            default:
                break;
        }
    }
    return (
        <>
            <div
                className={
                    loadingDelete ||
                    dataDelete ||
                    loadingDeny ||
                    dataDeny ||
                    loadingApprove ||
                    dataApprove
                        ? "row fade-out mb-2 response-card"
                        : "row fade-in mb-2 response-card"
                }>
                <div className="col-12">
                    <strong>Question: </strong>
                    {props.question}
                </div>
                <div className="col-12">
                    <strong>Response: </strong>
                    {props.response}
                </div>
                <div className="col-12">
                    {props.type !== "awaiting" && props.type !== "approved" ? (
                        <div className="ms-2" style={{ float: "inline-end" }}>
                            <button
                                onClick={(e) => {
                                    handleClick(e, "delete");
                                }}
                                className="btn btn-climate">
                                Delete
                            </button>
                        </div>
                    ) : (
                        ""
                    )}

                    {props.type === "awaiting" ? (
                        <div className="ms-2" style={{ float: "inline-end" }}>
                            <button
                                onClick={(e) => {
                                    handleClick(e, "deny");
                                }}
                                className="btn btn-climate">
                                Deny
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                    {props.type === "awaiting" ? (
                        <div className="ms-2" style={{ float: "inline-end" }}>
                            <button
                                onClick={(e) => {
                                    handleClick(e, "approve");
                                }}
                                className="btn btn-climate">
                                Approve
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            <dialog className="fade-in" id="deny-modal">
                {loadingDeny || dataDeny ? (
                    <div className="fade-in row">
                        <div className="col-12">
                            <span className="loader m-5"></span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <h4>Please choose a reason</h4>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={(e) => {
                                    modalClick(e, 1);
                                }}
                                className="btn btn-climate">
                                Inappropriate Language
                            </button>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={(e) => {
                                    modalClick(e, 2);
                                }}
                                className="btn btn-climate">
                                Extremest nature of the content
                            </button>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={(e) => {
                                    modalClick(e, 3);
                                }}
                                className="btn btn-climate">
                                Not appropriate or suitable for this work
                            </button>
                        </div>
                        <div className="mt-3">
                            <label>Custom Response</label>
                            <input
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        reason: e.target.value,
                                    })
                                }
                                value={formState.reason}
                                type="text"
                            />
                        </div>
                        <div className="col mt-3 text-start">
                            {formState.reason !== "" ? (
                                <button
                                    onClick={(e) => {
                                        modalClick(e, 4);
                                    }}
                                    className="btn fade-in btn-climate">
                                    Submit
                                </button>
                            ) : (
                                ""
                            )}
                            <button
                                style={{ float: "inline-end" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById("deny-modal")
                                        .close();
                                    document.body.style.overflow = "auto";
                                }}
                                className="btn btn-climate">
                                Close
                            </button>
                        </div>
                    </>
                )}
            </dialog>
        </>
    );
}

function Empty(props) {
    return (
        <div className="row fade-in response-card">
            <div className="col-12 mb-3">{props.text}</div>
        </div>
    );
}
