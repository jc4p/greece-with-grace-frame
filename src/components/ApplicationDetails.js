'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ApplicationDetails.module.css';
import * as frame from '@farcaster/frame-sdk';

export default function ApplicationDetails({ application, onClose, onViewed }) {
  const [hasViewed, setHasViewed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Update the handleScroll function to properly detect when a user has viewed the content
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    // Mark as viewed when user has scrolled at least 70% through the content
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    if (scrollPercentage > 0.7 && !hasViewed) {
      setHasViewed(true);
      if (onViewed) onViewed();
    }
  };
  
  const showProfile = async (fid) => {
    try {
      await frame.sdk.actions.viewProfile({ fid: parseInt(fid) });
    } catch (error) {
      console.error('Error showing profile:', error);
    }
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
  
  // The modal content
  const modalContent = (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalContent} onScroll={handleScroll}>
          <div className={styles.applicantHeader}>
            {application.profile_picture_url && (
              <img 
                src={application.profile_picture_url} 
                alt={application.username || application.name} 
                className={styles.applicantAvatar} 
              />
            )}
            
            <div className={styles.nameContainer}>
              <h2 className={styles.applicantName}>
                <button 
                  onClick={() => application.fid && showProfile(application.fid)}
                  className={styles.profileLink}
                >
                  {application.username ? `@${application.username}` : application.name}
                </button>
              </h2>
              <div className={styles.applicantDetails}>
                <span>{application.age} years old</span>
                <span>•</span>
                <span>{application.location}</span>
                <span>•</span>
                <span>{application.has_passport ? "Has passport" : "No passport"}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.applicationSection}>
            <h3>Why You?</h3>
            <p>{application.reasons}</p>
          </div>
          
          <div className={styles.applicationSection}>
            <h3>What stories would you tell?</h3>
            <p>{application.stories}</p>
          </div>
          
          <div className={styles.applicationSection}>
            <h3>What are your interests?</h3>
            <p>{application.interests}</p>
          </div>
          
          <div className={styles.applicationSection}>
            <h3>How would your friends describe you?</h3>
            <p>{application.friend_description}</p>
          </div>
          
          {parseInt(application.fid) === parseInt(window.userFid || 0) && (
            <div className={styles.shareContainer}>
              <button onClick={handleShare} className={styles.shareButton}>
                Share Your Application
              </button>
              <p>Get more votes by sharing with friends!</p>
            </div>
          )}
        </div>
        
        <div className={styles.modalFooter}>
          <div className={styles.viewStatus}>
            {hasViewed ? "✓ Application viewed" : "Scroll to read full application"}
          </div>
          <button onClick={onClose} className={styles.doneButton}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
  
  // Use a portal to render the modal outside the normal DOM hierarchy
  return mounted ? createPortal(modalContent, document.body) : null;
} 