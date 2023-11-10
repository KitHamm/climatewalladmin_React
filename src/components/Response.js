import { useState } from "react";
import { useMutation } from "@apollo/client";
import { APPROVE, DENY, DELETE } from "./queries";
import { cookies } from "../App";

export default function Response(props) {
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
    function handleClick(e, type, id) {
        e.preventDefault();
        if (type !== "deny") {
            document.getElementById(id).classList.add("fade-out");
        }
        switch (type) {
            case "approve":
                approveResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
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
        document.body.style.overflow = "auto";
        switch (type) {
            case 1:
                denyResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
                        reason: "Your response has not been approved due to the use of inappropriate language.",
                    },
                });
                break;
            case 2:
                denyResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
                        reason: "Your response has not been approved due to the extremist nature of the content.",
                    },
                });
                break;
            case 3:
                denyResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
                        reason: "Your response has not been approved as it is not appropriate or suitable for this work.",
                    },
                });
                break;
            case 4:
                denyResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
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
            <div id={props.id} className="col-12 fade-in mb-2 response-card">
                <div className="col-12 cw-response-info-bold">
                    <strong>Question: </strong>
                </div>
                <div className="col-12 cw-response-text mb-2">
                    {props.question}
                </div>
                <div className="col-12 cw-response-info-bold">
                    <strong>Response: </strong>
                </div>
                <div className="col-12 cw-response-text mb-3">
                    {props.response}
                </div>
                {props.type === "denied" ? (
                    <>
                        <div className="col-12 cw-response-info-bold">
                            <strong>Reason: </strong>
                        </div>
                        <div className="col-12 cw-response-text mb-2">
                            {props.reason}
                        </div>
                        <div className="col-12 cw-response-info-bold">
                            <strong>Denied by: </strong>
                        </div>
                        <div className="col-12 cw-response-text mb-2">
                            {props.user}
                        </div>
                    </>
                ) : props.type === "approved" ? (
                    <>
                        <div className="col-12 cw-response-info-bold">
                            <strong>Approved by: </strong>
                        </div>
                        <div className="col-12 cw-response-text mb-2">
                            {props.user}
                        </div>
                    </>
                ) : (
                    ""
                )}
                <div className="col-12 text-end mb-3">
                    {props.type !== "awaiting" && props.type !== "approved" ? (
                        <div
                            className="ms-2"
                            style={{ display: "inline-block" }}>
                            <button
                                onClick={(e) => {
                                    handleClick(e, "delete", props.id);
                                }}
                                className="btn btn-climate-red">
                                Delete
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                    {props.type === "awaiting" ? (
                        <div
                            className="ms-2"
                            style={{ display: "inline-block" }}>
                            <button
                                disabled={props.index === 0 ? false : true}
                                onClick={(e) => {
                                    handleClick(e, "approve", props.id);
                                }}
                                className="btn btn-climate">
                                Approve
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                    {props.type === "awaiting" ? (
                        <div
                            className="ms-2"
                            style={{ display: "inline-block" }}>
                            <button
                                disabled={props.index === 0 ? false : true}
                                onClick={(e) => {
                                    handleClick(e, "deny", props.id);
                                }}
                                className="btn btn-climate-red">
                                Deny
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
                                Extremist nature of the content
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
