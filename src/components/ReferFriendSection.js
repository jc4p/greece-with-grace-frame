'use client';

import { useState } from 'react';
import styles from './ReferFriendSection.module.css';
import * as frame from '@farcaster/frame-sdk';

export default function ReferFriendSection() {
  const [isSharing, setIsSharing] = useState(false);

  const handleReferFriend = async () => {
    try {
      setIsSharing(true);
      
      const targetText = "Hey [INSERT_USERNAME], I think you should apply to go to Greece with Grace!";
      const targetURL = process.env.NEXT_PUBLIC_SITE_URL;
      
      const finalUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(targetText)}&embeds[]=${encodeURIComponent(targetURL)}`;
      
      try {
        await frame.sdk.actions.openUrl(finalUrl);
      } catch (error) {
        await frame.sdk.actions.openUrl({ url: finalUrl });
      }
    } catch (error) {
      console.error('Error sharing referral:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <section className={styles.referSection}>
      <h2>Refer a Friend</h2>
      <p>Know someone who might be a good fit for this trip? Ask them to apply!</p>
      
      <button 
        onClick={handleReferFriend}
        className={styles.referButton}
        disabled={isSharing}
      >
        {isSharing ? 'Opening Warpcast...' : 'Share with a Friend'}
      </button>
    </section>
  );
} 