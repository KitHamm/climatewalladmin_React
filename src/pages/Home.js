import { useEffect, useState, createContext } from "react";
import { cookies } from "../App";
import Login from "../components/Login";
import Awaiting from "../components/Awaiting";
import Approved from "../components/Approved";
import Denied from "../components/Denied";
import Questions from "../components/Questions";
export const loggedInContext = createContext();
export const superUserContext = createContext();

export default function Home() {
    const [view, setView] = useState(0);
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
                </div>
            </div>
            {view === 0 ? (
                <>
                    <Awaiting />
                    <Approved />
                    <Denied />
                </>
            ) : (
                <Questions setView={setView} />
            )}
        </div>
    );
}
