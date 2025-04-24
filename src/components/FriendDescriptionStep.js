'use client';

import React from 'react';
import styles from './FriendDescriptionStep.module.css'; // Import CSS Module

export default function FriendDescriptionStep({ formData, handleChange, errors }) { // Receive errors
  return (
    <div className={styles.stepContainer}> {/* Use CSS Module */}
      <h3 className={styles.stepTitle}>How would your friends describe you?</h3> {/* Use CSS Module */}
      <label htmlFor="friendDescription" className={styles.label}> {/* Use CSS Module */}
        Briefly summarize how your closest friends might describe your personality:
      </label>
      <textarea
        id="friendDescription"
        name="friendDescription"
        value={formData.friendDescription}
        onChange={handleChange}
        placeholder="e.g., Loyal, adventurous, good listener..."
        required
        rows={5}
        className={`${styles.textarea} ${errors?.friendDescription ? styles.error : ''}`} // Apply error class
      />
      {errors?.friendDescription && <p className={styles.errorMessage}>{errors.friendDescription}</p>} {/* Display error */}
    </div>
  );
}

// Remove inline styles object
// const styles = { ... }; 