'use client';

import { useState } from 'react';
import ProfileLink from './ProfileLink';
import styles from './VotersList.module.css';

export default function VotersList({ votes }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get the first few voters to show in collapsed view
  const previewVoters = votes.slice(0, 3);
  const remainingCount = votes.length - previewVoters.length;
  
  return (
    <div className={styles.votersContainer}>
      {/* Collapsed view - just shows count and a few avatars */}
      {!isExpanded && (
        <div 
          className={styles.collapsedView} 
          onClick={() => setIsExpanded(true)}
        >
          <div className={styles.avatarStack}>
            {previewVoters.map((vote, index) => (
              <div 
                key={vote.id} 
                className={styles.stackedAvatar}
                style={{ zIndex: previewVoters.length - index, marginLeft: index > 0 ? '-10px' : '0' }}
              >
                {vote.profile?.pfpUrl ? (
                  <img 
                    src={vote.profile.pfpUrl} 
                    alt={vote.profile.username || `FID ${vote.fid}`} 
                    className={styles.voterAvatar} 
                  />
                ) : (
                  <div className={styles.defaultAvatar}>{vote.profile?.username?.[0] || '?'}</div>
                )}
              </div>
            ))}
            
            {remainingCount > 0 && (
              <div className={styles.remainingCount}>+{remainingCount}</div>
            )}
          </div>
          
          <span className={styles.showMoreText}>
            {votes.length === 1 
              ? "1 vote" 
              : `${votes.length} votes`} · Click to see all
          </span>
        </div>
      )}
      
      {/* Expanded view - shows full list of voters */}
      {isExpanded && (
        <>
          <div className={styles.expandedHeader}>
            <span>{votes.length} {votes.length === 1 ? "vote" : "votes"}</span>
            <button 
              onClick={() => setIsExpanded(false)} 
              className={styles.collapseButton}
            >
              Collapse
            </button>
          </div>
          
          <ul className={styles.votersList}>
            {votes.map(vote => (
              <li key={vote.id} className={styles.voterItem}>
                {vote.profile ? (
                  <div className={styles.voterProfile}>
                    {vote.profile.pfpUrl && (
                      <img 
                        src={vote.profile.pfpUrl} 
                        alt={vote.profile.username || `FID ${vote.fid}`} 
                        className={styles.voterAvatar} 
                      />
                    )}
                    <ProfileLink 
                      fid={vote.fid} 
                      username={vote.profile.username} 
                      className={styles.voterName}
                    />
                  </div>
                ) : (
                  `FID: ${vote.fid}`
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
} 