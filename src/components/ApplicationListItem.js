'use client';

import React from 'react';
import ProfileLink from './ProfileLink';
import ClientSideVoteButton from './ClientSideVoteButton';
import VotersList from './VotersList';
import styles from '../app/page.module.css';

export default function ApplicationListItem({ app }) {
  return (
    <li className={styles.leaderboardItem}>
      <div className={styles.applicationInfo}>
        <div className={styles.applicantDetails}>
          {app.profile_picture_url && (
            <img 
              src={app.profile_picture_url} 
              alt={app.username || app.name || 'Profile'} 
              className={styles.applicantAvatar} 
            />
          )}
          <div className={styles.nameAndVotes}>
            <ProfileLink 
              fid={app.fid} 
              username={app.username} 
              name={app.name} 
              className={styles.applicantName}
            />
            <span className={styles.voteCount}>Votes: {app.voteCount}</span>
          </div>
        </div>
        
        <div className={styles.voteButtonContainer}>
          <ClientSideVoteButton 
            appId={app.id} 
            applicationFid={app.fid} 
            application={app}
          />
        </div>
      </div>
      
      {app.votes.length > 0 && (
        <div className={styles.votersList}>
          <h4>Voted by:</h4>
          <VotersList votes={app.votes} />
        </div>
      )}
    </li>
  );
} 