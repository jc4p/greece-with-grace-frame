'use client';

import React from 'react';
import styles from './ReasonsStep.module.css'; // Import CSS Module

export default function ReasonsStep({ formData, handleChange, errors }) { // Receive errors
  return (
    <div className={styles.stepContainer}> {/* Use CSS Module */}
      <h3 className={styles.stepTitle}>Why you?</h3> {/* Use CSS Module */}
      <label htmlFor="reasons" className={styles.label}> {/* Use CSS Module */}
        Give 3 reasons why you think you'd be a great wedding date:
      </label>
      <textarea
        id="reasons"
        name="reasons"
        value={formData.reasons}
        onChange={handleChange}
        placeholder="1. Well... "
        required
        rows={5}
        className={`${styles.textarea} ${errors?.reasons ? styles.error : ''}`} // Apply error class
      />
      {errors?.reasons && <p className={styles.errorMessage}>{errors.reasons}</p>} {/* Display error */}
    </div>
  );
}

// Remove inline styles object
// const styles = { ... }; 