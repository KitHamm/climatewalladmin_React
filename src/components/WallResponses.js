// Component to show all of the responses created from the interactive wall

// Apollo imports
import { useQuery } from "@apollo/client";
// React imports
import { useEffect, useState } from "react";
// gql query imports
import { GET_WALL_RESPONSES } from "./queries";
// component imports
import Empty from "./Empty";
import Response from "./Response";

export default function WallResponses() {
    // functionality testing dates
    const [testDates, setTestDates] = useState([]);
    // get all responses made on the interactive wall
    const { loading, error, data } = useQuery(GET_WALL_RESPONSES, {
        pollInterval: 1000,
    });
    useEffect(() => {
        for (let index = 0; index < testDates.length; index++) {
            if (document.getElementById(testDates[index] + "-container-wall")) {
                document.getElementById(
                    testDates[index] + "-count-wall"
                ).innerHTML = document.getElementById(
                    testDates[index] + "-container-wall"
                ).childNodes.length;
            }
        }
    }, [testDates, data]);
    // display how many approved responses there are
    // css class should be universal, although styling is same as denied. Consider renaming.
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
                        <div className="cw-title-green">Wall Responses</div>
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
                        <div className="cw-title-green">Wall Responses</div>
                    </div>
                </div>
                <Empty text="Error." />
            </>
        );
    if (data) {
        data.qRepsonses.data.forEach((response) => {
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
                <div className="col-12 mt-3 mb-4">
                    <div className="col-12">
                        {/* Expandable div to hide responses as there are a lot */}
                        <div
                            style={{ cursor: "pointer" }}
                            className="cw-title-green"
                            onClick={() => {
                                handleLoadCount();
                                var arrow =
                                    document.getElementById("arrow-wall");
                                var el =
                                    document.getElementById("wall-container");
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
                            Wall Responses ({data.qRepsonses.data.length})
                            <span id="arrow-wall" className="arrow down" />
                        </div>
                    </div>
                </div>
                <hr className="cw-line" />
                <div
                    className="wall-container fade-out"
                    id="wall-container"
                    style={{ maxHeight: "0px" }}>
                    {testDates.map((date) => {
                        return (
                            <div key={date}>
                                <div
                                    className="cw-date"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        var el = document.getElementById(
                                            date + "-container-wall"
                                        );
                                        var containerEl =
                                            document.getElementById(
                                                "wall-container"
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
                                        id={date + "-count-wall"}
                                        style={{
                                            display: "inline-flex",
                                        }}></div>
                                    )
                                </div>
                                {/* display the response with the response component */}
                                <div
                                    id={date + "-container-wall"}
                                    className="date-response-container"
                                    style={{ maxHeight: "0px" }}>
                                    {data.qRepsonses.data.map(
                                        (response, index) => {
                                            if (
                                                response.attributes.createdAt
                                                    .toString()
                                                    .split("T")[0] === date
                                            ) {
                                                return (
                                                    <div key={response.id}>
                                                        <Response
                                                            type="wall"
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
                                                            createdAt={
                                                                response
                                                                    .attributes
                                                                    .createdAt
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
