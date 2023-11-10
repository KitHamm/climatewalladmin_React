import { useQuery } from "@apollo/client";
import { GET_DENIED } from "./queries";
import Empty from "./Empty";
import Response from "./Response";

export default function Denied() {
    const { loading, error, data } = useQuery(GET_DENIED, {
        pollInterval: 1000,
    });
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
        return (
            <>
                <div className="col-12 mt-4 mb-4">
                    <div className="col-12">
                        <div
                            style={{ cursor: "pointer" }}
                            className="cw-title-green"
                            onClick={() => {
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
                    className="denied-container fade-out mb-5"
                    id="denied-container"
                    style={{ maxHeight: "0px" }}>
                    {data.responses.data.length > 0 ? (
                        data.responses.data.map((response, index) => {
                            return (
                                <Response
                                    type="denied"
                                    question={response.attributes.question}
                                    response={response.attributes.response}
                                    key={response.id}
                                    id={response.id}
                                    reason={response.attributes.reason}
                                    user={response.attributes.approvedBy}
                                />
                            );
                        })
                    ) : (
                        <Empty text="Nothing to show." />
                    )}
                </div>
            </>
        );
    }
}
