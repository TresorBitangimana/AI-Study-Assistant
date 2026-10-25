import Icon from "./Icon";

export default function Dashboard({ greeting, onNewSession }) {
    return (
        <>
            <div className="welcome-row">
                <div>
                    <h1>
                        Good{" "}
                        {new Date().getHours() < 12
                            ? "morning"
                            : new Date().getHours() < 18
                              ? "afternoon"
                              : "evening"}
                        , {greeting}
                    </h1>
                </div>
                <button className="primary-button" onClick={onNewSession}>
                    <Icon name="Plus" /> New study session
                </button>
            </div>
            <div className="dashboard-grid">
                <section className="hero-card glass-surface">
                    <div className="hero-copy">
                        <h2>Create a personalized study session</h2>
                        <button className="hero-button" onClick={onNewSession}>
                            Create a study session
                        </button>
                    </div>
                    <div className="hero-art" aria-hidden="true">
                        <div className="orbit orbit-one" />
                        <div className="orbit orbit-two" />
                        <div className="orb-core">
                            <Icon name="Spark" />
                        </div>
                        <div className="float-note note-one">
                            Personalized learning
                        </div>
                        <div className="float-note note-two">
                            Built from your materials
                        </div>
                        <div className="float-note note-three">Aa</div>
                    </div>
                    <div className="hero-footer">
                        {/* <span>hero-footer content to be added</span> */}
                    </div>
                </section>
            </div>
            <footer className="page-footer">
                {/* <span>footer content to be added later</span> */}
            </footer>
        </>
    );
}
