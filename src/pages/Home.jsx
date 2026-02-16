import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="kn-hero">
      <h1>Stop Missing The Right Jobs.</h1>
      <p>
        Precision-matched job discovery delivered daily at 9AM.
      </p>
      <Link to="/settings" className="kn-btn kn-btn-primary kn-hero-cta">
        Start Tracking
      </Link>
    </section>
  );
}
