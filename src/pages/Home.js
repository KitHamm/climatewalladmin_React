import { useEffect, useState, createContext } from "react";
import { useQuery } from "@apollo/client";
import {
    GET_WALL_RESPONSES,
    GET_APPROVED,
    GET_DENIED,
} from "../components/queries";
import { cookies } from "../App";
import Login from "../components/Login";
import Awaiting from "../components/Awaiting";
import Approved from "../components/Approved";
import Denied from "../components/Denied";
import WallResponses from "../components/WallResponses";
import Questions from "../components/Questions";
import { CSVLink } from "react-csv";
export const loggedInContext = createContext();
export const superUserContext = createContext();

export default function Home() {
    const [view, setView] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    const [csvWallData, setCSVWallData] = useState([]);
    const {
        data: dataWall,
        loading: loadingWall,
        error: errorWall,
    } = useQuery(GET_WALL_RESPONSES);
    const {
        data: dataApproved,
        loading: loadingApproved,
        error: errorApproved,
    } = useQuery(GET_APPROVED);
    const {
        data: dataDenied,
        loading: loadingDenied,
        error: errorDenied,
    } = useQuery(GET_DENIED);
    const headers = [
        { label: "Response", key: "response" },
        { label: "Question", key: "question" },
        { label: "From", key: "from" },
        { label: "Approved", key: "approved" },
        { label: "Date", key: "date" },
        { label: "Time", key: "time" },
    ];

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
                    <div className="cw-title">#ClimateWall</div>
                    <div className="cw-response-info-text mb-3">
                        Logged In as{" "}
                        <div
                            className="cw-response-info-green"
                            style={{ display: "inline-flex" }}>
                            {cookies.get("user")}
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                cookies.remove("jwt", {
                                    path: "/climatewalladmin",
                                });
                                cookies.remove("user", {
                                    path: "/climatewalladmin",
                                });
                                cookies.remove("superuser", {
                                    path: "/climatewalladmin",
                                });
                                setLoggedIn(false);
                                window.location.reload();
                            }}
                            className="btn btn-climate-red">
                            Log Out
                        </button>
                    </div>
                    {cookies.get("superuser") === true && view === 0 ? (
                        <div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setView(1);
                                }}
                                className="mt-3 btn btn-climate">
                                Questions
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                    {dataWall && dataApproved && dataDenied ? (
                        <div>
                            <CSVLink
                                className="mt-3 btn btn-climate"
                                headers={headers}
                                data={downloadCSV(
                                    dataWall.qRepsonses.data,
                                    dataApproved.responses.data,
                                    dataDenied.responses.data
                                )}>
                                Download
                            </CSVLink>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            {view === 0 ? (
                <>
                    <Awaiting />
                    <Approved />
                    <WallResponses />
                    <Denied />
                </>
            ) : (
                <Questions setView={setView} />
            )}
        </div>
    );
}

function downloadCSV(dataWall, dataApproved, dataDenied) {
    var csvData = [];
    dataWall.forEach((element) => {
        csvData.push({
            response: element.attributes.response,
            question: element.attributes.question,
            from: element.attributes.from,
            approved: "N/A",
            date: formatDate(element.attributes.createdAt),
            time: formatTime(element.attributes.createdAt),
        });
    });
    dataApproved.forEach((element) => {
        csvData.push({
            response: element.attributes.response,
            question: element.attributes.question,
            from: "App",
            approved: "Approved",
            date: formatDate(element.attributes.createdAt),
            time: formatTime(element.attributes.createdAt),
        });
    });
    dataDenied.forEach((element) => {
        csvData.push({
            response: element.attributes.response,
            question: element.attributes.question,
            from: "App",
            approved: "Denied",
            date: formatDate(element.attributes.createdAt),
            time: formatTime(element.attributes.createdAt),
        });
    });
    return csvData;
}

function formatDate(date) {
    var tempString;
    tempString = date.split("T")[0];
    tempString = tempString.split("-");
    //tempString[1] = tempString[1] - 1;
    tempString.reverse();
    tempString = tempString.join("-");
    return tempString;
}
function formatTime(date) {
    var tempString;
    tempString = date.split("T")[1].split(".")[0];
    return tempString;
}
