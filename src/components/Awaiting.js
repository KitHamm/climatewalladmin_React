// Component to show all of the responses awaiting approval.
// Has options to approve or to deny and give reason for denial.

// Apollo imports
import { useQuery } from "@apollo/client";
// React imports
import { useState, useEffect } from "react";
// gql query imports
import { GET_AWAITING } from "./queries";
// cookies import for login
import { cookies } from "../App";
// component imports
import Response from "./Response";
import Empty from "./Empty";
import Notification from "../audio/notification.wav";

export default function Awaiting() {
    // state for if notification sound should be played or not
    const [notifications, setNotifications] = useState(false);
    const [count, setCount] = useState(0);
    const { loading, error, data } = useQuery(GET_AWAITING, {
        pollInterval: 1000,
    });
    useEffect(() => {
        if (cookies.get("notifications")) {
            setNotifications(cookies.get("notifications"));
        }
    }, []);
    // if notifications turned on, play sound when new response is available
    useEffect(() => {
        if (data) {
            if (data.responses.data.length !== count) {
                if (data.responses.data.length > count) {
                    if (notifications) {
                        new Audio(Notification).play().catch((e) => {
                            console.log(e);
                        });
                    }
                    setCount(data.responses.data.length);
                } else {
                    setCount(data.responses.data.length);
                }
            }
        }
    }, [data, notifications, count]);

    if (loading)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Awaiting Approval</div>
                    </div>
                    <div className="col-12 mt-3">
                        <button className="btn btn-climate">
                            Notifications
                        </button>
                    </div>
                </div>
                <Empty text="Loading..." />
            </>
        );
    if (error)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Awaiting Approval</div>
                    </div>
                </div>
                <Empty text="Error." />
            </>
        );
    if (data) {
        {
            /* Display the responses with the awaiting state */
        }
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">
                            Awaiting Approval ({data.responses.data.length})
                        </div>
                    </div>
                    <div className="col-12 mt-3">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                cookies.set("notifications", !notifications);
                                setNotifications(!notifications);
                            }}
                            className="btn btn-climate">
                            {notifications
                                ? "Turn notifications off"
                                : "Turn notifications on"}
                        </button>
                    </div>
                </div>
                <hr className="cw-line" />

                {data.responses.data.length > 0 ? (
                    data.responses.data.map((response, index) => {
                        return (
                            <Response
                                type="awaiting"
                                index={index}
                                question={response.attributes.question}
                                response={response.attributes.response}
                                key={response.id}
                                id={response.id}
                                createdAt={response.attributes.createdAt}
                                updatedAt={response.attributes.updatedAt}
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
