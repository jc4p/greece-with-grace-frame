'use client';

import { useState, useEffect } from 'react';
import MultiStepForm from './MultiStepForm';
import styles from './ClientSideFormSection.module.css';
import * as frame from '@farcaster/frame-sdk';

export default function ClientSideFormSection() {
  const [showForm, setShowForm] = useState(false);
  const [userFid, setUserFid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userDataError, setUserDataError] = useState(null);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);
  const [isCheckingApplication, setIsCheckingApplication] = useState(false);
  
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
  
  // Check if user has already applied
  useEffect(() => {
    async function checkExistingApplication() {
      if (!userFid) return;
      
      setIsCheckingApplication(true);
      
      try {
        // Get base URL from environment
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
        
        const response = await fetch(`${baseUrl}/api/applications/check?fid=${userFid}`);
        
        if (!response.ok) {
          console.error('Failed to check existing application');
          return;
        }
        
        const data = await response.json();
        setHasAlreadyApplied(data.exists);
      } catch (error) {
        console.error('Error checking application:', error);
      } finally {
        setIsCheckingApplication(false);
      }
    }
    
    checkExistingApplication();
  }, [userFid]);
  
  // Fetch user data when FID is available
  useEffect(() => {
    async function fetchUserData() {
      if (!userFid) return;
      
      setIsLoadingUserData(true);
      setUserDataError(null);
      
      try {
        // Get base URL from environment
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
        
        const response = await fetch(`${baseUrl}/api/user-info?fid=${userFid}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data);
        console.log('Farcaster user data loaded:', data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserDataError(error.message);
      } finally {
        setIsLoadingUserData(false);
      }
    }
    
    fetchUserData();
  }, [userFid]);
  
  const handleFormSubmit = async (data) => {
    console.log('Submitting Form Data:', data);
    try {
      // Get base URL from environment
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      
      // Use the FID and user data from Farcaster
      const response = await fetch(`${baseUrl}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          fid: userFid,
          username: userData?.username,
          profilePictureUrl: userData?.pfpUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      alert('Application Submitted! Check the leaderboard.');
      setShowForm(false); // Hide form after successful submission
      setHasAlreadyApplied(true); // Update state to reflect application
      // Force a page refresh to update the leaderboard
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Submission failed: ${error.message}`);
    }
  };

  // Don't render the application section if the user has already applied
  if (hasAlreadyApplied && userFid) {
    return (
      <section className={styles.formSection}>
        <h2>You've Already Applied!</h2>
        <p>Thank you for your application. You can check the leaderboard to see your status.</p>
        
        <div className={styles.shareContainer}>
          <button 
            onClick={handleShare} 
            className={styles.shareButton}
          >
            Share Your Application
          </button>
          <p>Get more votes by sharing with friends!</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.formSection}>
      <h2>Apply Here</h2>
      <p className={styles.applyText}>All information will be public and viewable by all users, so be nice and don't share anything you don't want to.</p>
      
      {userFid && (
        <div className={styles.fidIndicator}>
          {isLoadingUserData || isCheckingApplication ? (
            <span className={styles.loading}>Loading Farcaster profile...</span>
          ) : userData ? (
            <div className={styles.userProfile}>
              {userData.pfpUrl && (
                <img 
                  src={userData.pfpUrl} 
                  alt={userData.displayName || userData.username} 
                  className={styles.profilePicture} 
                />
              )}
              <div className={styles.userInfo}>
                <span className={styles.displayName}>{userData.displayName || userData.username}</span>
                {userData.username && <span className={styles.username}>@{userData.username}</span>}
              </div>
            </div>
          ) : (
            <span>Connected with FID: {userFid}</span>
          )}
          {userDataError && <p className={styles.error}>{userDataError}</p>}
        </div>
      )}
      
      {!showForm ? (
        <div className={styles.formButtonContainer}>
          <button 
            onClick={() => setShowForm(true)}
            className={styles.showFormButton}
            disabled={isLoadingUserData || isCheckingApplication}
          >
            Click to Apply
          </button>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <MultiStepForm onSubmit={handleFormSubmit} />
          <button 
            onClick={() => setShowForm(false)}
            className={styles.cancelButton}
          >
            Cancel Application
          </button>
        </div>
      )}
    </section>
  );
}

// Add the handleShare function
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