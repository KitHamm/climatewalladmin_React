import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_AWAITING } from "./queries";
import { cookies } from "../App";
import Response from "./Response";
import Empty from "./Empty";
import Notification from "../audio/notification.wav";

export default function Awaiting() {
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
