import { Suspense } from 'react';
import ClientSideFormSection from '../components/ClientSideFormSection';
import ReferFriendSection from '../components/ReferFriendSection';
import ApplicationListItem from '../components/ApplicationListItem';
import styles from './page.module.css';

export const metadata = {
  title: 'Go to Greece with Grace',
  description: 'Apply for a chance to go to Greece with Grace!',
  other: {
    'fc:frame': JSON.stringify({
      version: "next",
      imageUrl: "https://cover-art.kasra.codes/greece-rectangle.png",
      button: {
        title: "Apply or Vote!",
        action: {
          type: "launch_frame",
          name: "Greece With Grace",
          url: process.env.NEXT_PUBLIC_SITE_URL,
          splashImageUrl: "https://cover-art.kasra.codes/greece-square.png",
          splashBackgroundColor: "#76ADC2"
        }
      }
    })
  }
};

// Function to check if application has short answers (all fields less than 5 words)
function hasShortAnswers(application) {
  const countWords = (text) => (text?.trim() ? text.trim().split(/\s+/).length : 0);
  
  const reasonsWordCount = countWords(application.reasons);
  const storiesWordCount = countWords(application.stories);
  const interestsWordCount = countWords(application.interests);
  const friendDescriptionWordCount = countWords(application.friend_description);
  
  // All fields have less than 5 words
  return reasonsWordCount < 5 && 
         storiesWordCount < 5 && 
         interestsWordCount < 5 && 
         friendDescriptionWordCount < 5;
}

// Function to fetch applications data - server-side
async function getApplications() {
  try {
    // Get base URL from environment
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    // Use absolute URL for fetch
    const res = await fetch(`${baseUrl}/api/applications`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    const applications = await res.json();
    
    // For each application, fetch its votes with absolute URL
    const applicationsWithVotes = await Promise.all(
      applications.map(async (app) => {
        const votesRes = await fetch(
          `${baseUrl}/api/votes?applicationId=${app.id}`,
          { cache: 'no-store' }
        );
        
        if (!votesRes.ok) {
          console.error(`Failed to fetch votes for application ${app.id}`);
          return { ...app, votes: [], voteCount: 0 };
        }
        
        const votes = await votesRes.json();
        return { 
          ...app, 
          votes, 
          voteCount: votes.length,
          hasShortAnswers: hasShortAnswers(app)
        };
      })
    );
    
    // Collect all unique FIDs from votes for batch fetching
    const allVoterFids = new Set();
    applicationsWithVotes.forEach(app => {
      app.votes.forEach(vote => {
        if (vote.fid) {
          allVoterFids.add(vote.fid);
        }
      });
    });
    
    // If we have voter FIDs, fetch their profiles in batches
    if (allVoterFids.size > 0) {
      const voterFidArray = Array.from(allVoterFids);
      
      // Process in batches of 50 (Neynar API limit)
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < voterFidArray.length; i += batchSize) {
        batches.push(voterFidArray.slice(i, i + batchSize));
      }
      
      // Fetch user profiles for each batch
      const voterProfiles = {};
      
      await Promise.all(
        batches.map(async (batchFids) => {
          try {
            const fidsBatchString = batchFids.join(',');
            const profilesRes = await fetch(
              `${baseUrl}/api/user-info/bulk?fids=${fidsBatchString}`,
              { cache: 'no-store' }
            );
            
            if (profilesRes.ok) {
              const batchProfiles = await profilesRes.json();
              Object.assign(voterProfiles, batchProfiles);
            }
          } catch (error) {
            console.error('Error fetching voter profiles batch:', error);
          }
        })
      );
      
      // Add profile data to each vote
      applicationsWithVotes.forEach(app => {
        app.votes = app.votes.map(vote => {
          const profile = voterProfiles[vote.fid];
          return profile ? { ...vote, profile } : vote;
        });
      });
    }
    
    return applicationsWithVotes;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export default async function Home() {
  const applications = await getApplications();
  
  // Split applications into quality and short answer applications
  const qualityApplications = applications.filter(app => !app.hasShortAnswers);
  const shortAnswerApplications = applications.filter(app => app.hasShortAnswers);
  
  return (
    <main className={styles.container}>
      <h1 className={styles.header}>GREECE WITH GRACE</h1>

      <section className={styles.leaderboardSection}>
        <h2>Leaderboard</h2>
        <Suspense fallback={<p>Loading leaderboard...</p>}>
          {qualityApplications.length === 0 ? (
            <p>No quality applications submitted yet.</p>
          ) : (
            <ol>
              {qualityApplications
                // Server-side sorting by vote count
                .sort((a, b) => b.voteCount - a.voteCount)
                .map(app => (
                  <ApplicationListItem key={app.id} app={app} />
                ))}
            </ol>
          )}
        </Suspense>
      </section>

      {shortAnswerApplications.length > 0 && (
        <section className={styles.shortApplicationsSection}>
          <details>
            <summary className={styles.shortAppsSummary}>
              <h3>Brief Applications ({shortAnswerApplications.length})</h3>
            </summary>
            
            <ol className={styles.shortApplicationsList}>
              {shortAnswerApplications
                .sort((a, b) => b.voteCount - a.voteCount)
                .map(app => (
                  <ApplicationListItem key={app.id} app={app} />
                ))}
            </ol>
          </details>
        </section>
      )}

      <ClientSideFormSection />
      <ReferFriendSection />
    </main>
  );
}
