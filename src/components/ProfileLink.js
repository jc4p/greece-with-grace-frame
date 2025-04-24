'use client';

import { useCallback } from 'react';
import * as frame from '@farcaster/frame-sdk';

export default function ProfileLink({ fid, username, name, className }) {
  const handleShowProfile = useCallback(async (event) => {
    event.preventDefault();
    
    if (!fid) return;
    
    try {
      await frame.sdk.actions.viewProfile({ fid: parseInt(fid) });
    } catch (error) {
      console.error('Error showing profile:', error);
    }
  }, [fid]);
  
  // Determine display text
  const displayText = username ? `@${username}` : (name || `FID ${fid}`);
  
  return (
    <span className={className} onClick={handleShowProfile} style={{ cursor: 'pointer' }}>
      {displayText}
    </span>
  );
} 