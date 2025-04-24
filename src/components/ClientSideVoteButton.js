'use client';

import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';
import ApplicationDetails from './ApplicationDetails';
import * as frame from '@farcaster/frame-sdk';

export default function ClientSideVoteButton({ appId, applicationFid, application }) {
  const [isVoting, setIsVoting] = useState(false);
  const [userFid, setUserFid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [isSelfVote, setIsSelfVote] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hasViewedApplication, setHasViewedApplication] = useState(false);
  const [hasVotedForThisApp, setHasVotedForThisApp] = useState(false);
  const [isCheckingVote, setIsCheckingVote] = useState(false);
  
  // Store viewed status in localStorage to persist between sessions
  useEffect(() => {
    if (userFid && appId) {
      const viewedKey = `viewed_app_${appId}_${userFid}`;
      const hasViewed = localStorage.getItem(viewedKey) === 'true';
      setHasViewedApplication(hasViewed);
    }
  }, [userFid, appId]);
  
  // Save viewed status to localStorage
  const markAsViewed = () => {
    if (userFid && appId) {
      const viewedKey = `viewed_app_${appId}_${userFid}`;
      localStorage.setItem(viewedKey, 'true');
      setHasViewedApplication(true);
    }
  };
  
  // Listen for window.userFid to be set by the Frame SDK
  useEffect(() => {
    // Check if already set
    if (window.userFid) {
      setUserFid(window.userFid);
    }
    
    // Set up listener for future changes
    const checkForFid = setInterval(() => {
      if (window.userFid && window.userFid !== userFid) {
        setUserFid(window.userFid);
        clearInterval(checkForFid);
      }
    }, 1000);
    
    return () => clearInterval(checkForFid);
  }, [userFid]);
  
  // Check if this is the user's own application
  useEffect(() => {
    if (userFid && applicationFid) {
      setIsSelfVote(parseInt(userFid) === parseInt(applicationFid));
    }
  }, [userFid, applicationFid]);
  
  // Check if user has already voted for this specific application
  useEffect(() => {
    async function checkIfVotedForThisApp() {
      if (!userFid || !appId) return;
      
      setIsCheckingVote(true);
      
      try {
        // Get base URL from environment
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
        
        const response = await fetch(`${baseUrl}/api/votes/check?applicationId=${appId}&fid=${userFid}`);
        
        if (response.ok) {
          const data = await response.json();
          setHasVotedForThisApp(data.hasVoted);
        }
      } catch (error) {
        console.error('Error checking vote status:', error);
      } finally {
        setIsCheckingVote(false);
      }
    }
    
    checkIfVotedForThisApp();
  }, [userFid, appId]);
  
  // Fetch user data when FID is available
  useEffect(() => {
    async function fetchUserData() {
      if (!userFid) return;
      
      setIsLoadingUserData(true);
      
      try {
        // Get base URL from environment
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
        
        const response = await fetch(`${baseUrl}/api/user-info?fid=${userFid}`);
        
        if (!response.ok) {
          console.error('Failed to fetch user data');
          return;
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    }
    
    fetchUserData();
  }, [userFid]);

  const handleVote = async () => {
    // If not viewed yet, show details
    if (!hasViewedApplication && !isSelfVote) {
      setShowDetails(true);
      return;
    }
    
    setIsVoting(true);
    
    try {
      // Use the FID from the Frame SDK
      if (!userFid) {
        alert("You need to connect with a Farcaster account to vote.");
        return;
      }
      
      // Prevent voting for your own application
      if (isSelfVote) {
        // For own application, share instead of voting
        handleShare();
        return;
      }
      
      // Get base URL from environment
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      
      const response = await fetch(`${baseUrl}/api/votes`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: appId,
          fid: userFid
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record vote');
      }
      
      // Update local state to show voted for this app
      setHasVotedForThisApp(true);
      
      // Force a refresh of the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error voting:", error);
      alert(`Voting failed: ${error.message}`);
    } finally {
      setIsVoting(false);
    }
  };
  
  const handleViewApplication = () => {
    setShowDetails(true);
  };
  
  const handleShare = async () => {
    try {
      const targetText = `Vote for me to go to Greece with Grace!`;
      const targetURL = process.env.NEXT_PUBLIC_SITE_URL;
      
      const finalUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(targetText)}&embeds[]=${encodeURIComponent(targetURL)}`;
      
      try {
        await frame.sdk.actions.openUrl(finalUrl);
      } catch (error) {
        await frame.sdk.actions.openUrl({ url: finalUrl });
      }
    } catch (error) {
      console.error('Error sharing application:', error);
    }
  };

  return (
    <>
      <div className={styles.actionButtons}>
        <button 
          onClick={handleViewApplication}
          className={styles.viewButton}
          disabled={isLoadingUserData || !userFid}
        >
          View
        </button>
        
        {/* Only show vote button if this isn't self-vote and user hasn't voted for this application */}
        {!isSelfVote && !hasVotedForThisApp && (
          <button 
            onClick={handleVote}
            className={styles.voteButton} 
            disabled={isVoting || !userFid || isLoadingUserData || (hasViewedApplication === false)}
            title={!userFid ? "Connect with Farcaster to vote" : 
                   !hasViewedApplication ? "View application details first" : ""}
          >
            {isVoting ? 'Voting...' : 
             isLoadingUserData ? 'Loading...' : 
             'Vote'}
          </button>
        )}
        
        {/* Show share button for own application */}
        {isSelfVote && (
          <button 
            onClick={handleShare}
            className={styles.shareButton}
          >
            Share
          </button>
        )}
        
        {/* Show 'Voted' indicator if user already voted for this application */}
        {!isSelfVote && hasVotedForThisApp && (
          <span className={styles.votedIndicator}>
            Voted ✓
          </span>
        )}
      </div>
      
      {showDetails && (
        <ApplicationDetails 
          application={application}
          onClose={() => setShowDetails(false)}
          onViewed={markAsViewed}
        />
      )}
    </>
  );
} 