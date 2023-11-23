import { useQuery } from "@apollo/client";
import { GET_DENIED } from "./queries";
import Empty from "./Empty";
import Response from "./Response";
import { useEffect, useState } from "react";

export default function Denied() {
    const [testDates, setTestDates] = useState([]);
    const { loading, error, data } = useQuery(GET_DENIED, {
        pollInterval: 1000,
    });
    useEffect(() => {
        for (let index = 0; index < testDates.length; index++) {
            if (
                document.getElementById(testDates[index] + "-container-denied")
            ) {
                document.getElementById(
                    testDates[index] + "-count-denied"
                ).innerHTML = document.getElementById(
                    testDates[index] + "-container-denied"
                ).childNodes.length;
            }
        }
    }, [testDates, data]);
    function handleLoadCount() {
        for (let index = 0; index < testDates.length; index++) {
            if (
                document.getElementById(testDates[index] + "-container-denied")
            ) {
                document.getElementById(
                    testDates[index] + "-count-denied"
                ).innerHTML = document.getElementById(
                    testDates[index] + "-container-denied"
                ).childNodes.length;
            }
        }
    }
    if (loading)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Denied</div>
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
                        <div className="cw-title-green">Denied</div>
                    </div>
                </div>
                <Empty text="Error." />
            </>
        );
    if (data) {
        data.responses.data.forEach((response) => {
            if (
                !testDates.includes(
                    response.attributes.createdAt.toString().split("T")[0]
                )
            ) {
                setTestDates([
                    response.attributes.createdAt.toString().split("T")[0],
                    ...testDates,
                ]);
            }
        });
    }
    if (testDates.length > 0) {
        return (
            <>
                <div className="col-12 mt-4 mb-4">
                    <div className="col-12">
                        <div
                            style={{ cursor: "pointer" }}
                            className="cw-title-green"
                            onClick={() => {
                                handleLoadCount();
                                var arrow =
                                    document.getElementById("arrow-denied");
                                var el =
                                    document.getElementById("denied-container");
                                arrow.classList.contains("down")
                                    ? arrow.classList.replace("down", "up")
                                    : arrow.classList.replace("up", "down");
                                el.classList.contains("fade-out")
                                    ? el.classList.replace(
                                          "fade-out",
                                          "fade-in"
                                      )
                                    : el.classList.replace(
                                          "fade-in",
                                          "fade-out"
                                      );
                                el.style.maxHeight === "0px"
                                    ? (el.style.maxHeight =
                                          el.scrollHeight + 1000 + "px")
                                    : (el.style.maxHeight = "0px");
                            }}>
                            Denied ({data.responses.data.length}){" "}
                            <span id="arrow-denied" className="arrow down" />
                        </div>
                    </div>
                </div>
                <hr className="cw-line" />
                <div
                    className="denied-container fade-out"
                    id="denied-container"
                    style={{ maxHeight: "0px" }}>
                    {testDates.map((date) => {
                        return (
                            <div key={date}>
                                <div
                                    className="cw-date"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        var el = document.getElementById(
                                            date + "-container-denied"
                                        );
                                        var containerEl =
                                            document.getElementById(
                                                "denied-container"
                                            );
                                        containerEl.style.maxHeight =
                                            el.scrollHeight +
                                            containerEl.scrollHeight +
                                            1000 +
                                            "px";
                                        el.classList.contains("fade-out")
                                            ? el.classList.replace(
                                                  "fade-out",
                                                  "fade-in"
                                              )
                                            : el.classList.replace(
                                                  "fade-in",
                                                  "fade-out"
                                              );
                                        el.style.maxHeight === "0px"
                                            ? (el.style.maxHeight =
                                                  el.scrollHeight + 1000 + "px")
                                            : (el.style.maxHeight = "0px");
                                    }}>
                                    {
                                        date
                                            .toString()
                                            .split("T")[0]
                                            .split("-")[2]
                                    }
                                    -
                                    {
                                        date
                                            .toString()
                                            .split("T")[0]
                                            .split("-")[1]
                                    }
                                    -
                                    {
                                        date
                                            .toString()
                                            .split("T")[0]
                                            .split("-")[0]
                                    }{" "}
                                    (
                                    <div
                                        id={date + "-count-denied"}
                                        style={{
                                            display: "inline-flex",
                                        }}></div>
                                    )
                                </div>
                                <div
                                    id={date + "-container-denied"}
                                    className="date-response-container"
                                    style={{ maxHeight: "0px" }}>
                                    {data.responses.data.map(
                                        (response, index) => {
                                            if (
                                                response.attributes.createdAt
                                                    .toString()
                                                    .split("T")[0] === date
                                            ) {
                                                return (
                                                    <div key={response.id}>
                                                        <Response
                                                            type="denied"
                                                            question={
                                                                response
                                                                    .attributes
                                                                    .question
                                                            }
                                                            response={
                                                                response
                                                                    .attributes
                                                                    .response
                                                            }
                                                            id={response.id}
                                                            user={
                                                                response
                                                                    .attributes
                                                                    .approvedBy
                                                            }
                                                            reason={
                                                                response
                                                                    .attributes
                                                                    .reason
                                                            }
                                                            createdAt={
                                                                response
                                                                    .attributes
                                                                    .createdAt
                                                            }
                                                            updatedAt={
                                                                response
                                                                    .attributes
                                                                    .updatedAt
                                                            }
                                                        />
                                                    </div>
                                                );
                                            }
                                            return "";
                                        }
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}
