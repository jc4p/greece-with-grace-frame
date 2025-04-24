'use client';

import React from 'react';
import styles from './LocationStep.module.css'; // Import CSS Module

export default function LocationStep({ formData, handleChange, errors }) { // Receive errors
  return (
    <div className={styles.stepContainer}> {/* Use CSS Module */}
      <h3 className={styles.stepTitle}>Where are you located?</h3> {/* Use CSS Module */}
      <label htmlFor="location" className={styles.label}>City or Country:</label> {/* Use CSS Module */}
      <input
        type="text"
        id="location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="e.g., New York"
        required
        className={`${styles.input} ${errors?.location ? styles.error : ''}`} // Apply error class
      />
      {errors?.location && <p className={styles.errorMessage}>{errors.location}</p>} {/* Display error */}
    </div>
  );
}

// Remove inline styles object
// const styles = { ... }; 