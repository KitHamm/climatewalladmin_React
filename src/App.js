import "./App.css";
import Cookies from "universal-cookie";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Home from "./pages/Home";
import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export const url = "https://cms.plasticelephant.co.uk";

export const tokenContext = createContext();
export const cookies = new Cookies(null, { path: "/climatewalladmin" });

function App() {
    const [token, setToken] = useState(cookies.get("jwt"));
    const httpLink = createHttpLink({
        uri: url + "/graphql",
    });
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            },
        };
    });
    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
    return (
        <BrowserRouter>
            <ApolloProvider client={client}>
                <Routes>
                    <Route
                        path="/climatewalladmin"
                        element={
                            <tokenContext.Provider value={[token, setToken]}>
                                <Home />
                            </tokenContext.Provider>
                        }
                    />
                </Routes>
            </ApolloProvider>
        </BrowserRouter>
    );
}

export default App;
