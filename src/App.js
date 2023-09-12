import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export const url = "https://cms.plasticelephant.co.uk";
const api = new ApolloClient({
    uri: url + "/graphql",
    cache: new InMemoryCache(),
});

function App() {
    return (
        <BrowserRouter>
            <ApolloProvider client={api}>
                <Routes>
                    <Route path="/climatewalladmin" element={<Home />} />
                </Routes>
            </ApolloProvider>
        </BrowserRouter>
    );
}

export default App;
