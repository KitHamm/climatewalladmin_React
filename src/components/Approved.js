import { useQuery } from "@apollo/client";
import { GET_APPROVED } from "./queries";
import Empty from "./Empty";
import Response from "./Response";
import { useEffect, useState } from "react";

export default function Approved() {
    const [testDates, setTestDates] = useState([]);
    const { loading, error, data } = useQuery(GET_APPROVED, {
        pollInterval: 1000,
    });
    useEffect(() => {
        for (let index = 0; index < testDates.length; index++) {
            if (document.getElementById(testDates[index] + "-container")) {
                document.getElementById(testDates[index] + "-count").innerHTML =
                    document.getElementById(
                        testDates[index] + "-container"
                    ).childNodes.length;
            }
        }
    }, [testDates]);
    if (loading)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Approved</div>
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
                        <div className="cw-title-green">Approved</div>
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
                    ...testDates,
                    response.attributes.createdAt.toString().split("T")[0],
                ]);
            }
        });
    }
    if (testDates.length > 0) {
        return (
            <>
                <div className="col-12 mt-5 mb-4">
                    <div className="col-12">
                        <div
                            style={{ cursor: "pointer" }}
                            className="cw-title-green"
                            onClick={() => {
                                var arrow =
                                    document.getElementById("arrow-approved");
                                var el =
                                    document.getElementById(
                                        "approved-container"
                                    );
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
                            Approved ({data.responses.data.length})
                            <span id="arrow-approved" className="arrow down" />
                        </div>
                    </div>
                </div>
                <hr className="cw-line" />
                <div
                    className="approved-container fade-out"
                    id="approved-container"
                    style={{ maxHeight: "0px" }}>
                    {testDates.reverse().map((date) => {
                        return (
                            <div key={date}>
                                <div
                                    className="cw-date"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        var el = document.getElementById(
                                            date + "-container"
                                        );
                                        var containerEl =
                                            document.getElementById(
                                                "approved-container"
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
                                        id={date + "-count"}
                                        style={{
                                            display: "inline-flex",
                                        }}></div>
                                    )
                                </div>
                                <div
                                    id={date + "-container"}
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
                                                            type="approved"
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
