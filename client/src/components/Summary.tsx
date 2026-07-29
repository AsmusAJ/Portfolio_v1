import Card from "./Card";
import "./Summary.css";

export default function Summary() {
    return (
        <section>
            <h1>At a Glance</h1>
            <div className="card-box">
                <Card />
                <Card />
            </div>
        </section>
    );
}
