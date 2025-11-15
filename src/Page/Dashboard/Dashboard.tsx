import React, { useContext } from 'react';
import {  useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthProvider';


const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext); 
  const navigate = useNavigate();
  if (!authContext) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">Loading user data...</div>;
}
  const { user } = authContext;
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">Loading user data...</div>;
  }

  return (
    <div className="p-8 mt-30">
      <h1 className="text-4xl font-bold mb-6">Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">⚡New Instant Meeting</h2>
            <p>Start a video conference immediately.</p>
            <div className="card-actions justify-end mt-4">
              
              <button 
               onClick={() => navigate("/meeting")}
                className="btn btn-info"
              >
                Start Now
              </button>
             
            </div>
          </div>
        </div>

        {/* Card 2: Schedule Meeting */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-2xl">📅 Schedule Meeting</h2>
            <p>Plan a meeting for a later date and invite participants.</p>
            <div className="card-actions justify-end mt-4">
              <button 
                className="btn btn-success"
                onClick={() => navigate('/schedule')}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Previous Meetings */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-2xl">📚 Past Meetings</h2>
            <p>Access transcripts, AI summaries, and recordings of finished meetings.</p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-ghost">View History</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-4">Upcoming Meetings</h2>
        {/* Placeholder for list of scheduled meetings */}
        <div className="p-4 border border-dashed border-base-content rounded-lg text-center">
            No upcoming meetings found.
        </div>
      </div>
    </div>
  );
};
export default Dashboard;