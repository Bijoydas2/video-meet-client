import HeroSection from '../Components/HeroSection';
import FeaturesSection from '../Components/FeaturesSection';
import CTASection from '../Components/CTASection';
import { Link } from 'react-router';

const Home = () => {
    return (
        <div>
            <HeroSection />

             <div style={{ padding: 20 }}>
      <h1>Welcome to VideoMeet</h1>
      <p>
        <Link to="/create">Create Meeting</Link> | <Link to="/my-meetings">My Meetings</Link>
      </p>
    </div>
            <FeaturesSection />
            <CTASection />
        </div>
    );
};

export default Home;