import { useQuery } from "@apollo/client";
import { GET_AWAITING } from "./queries";
import Response from "./Response";
import Empty from "./Empty";

export default function Awaiting() {
    const { loading, error, data } = useQuery(GET_AWAITING, {
        pollInterval: 1000,
    });
    if (loading)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Awaiting Approval</div>
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
