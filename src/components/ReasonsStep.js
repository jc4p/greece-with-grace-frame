'use client';

import React from 'react';
import WordCountTextArea from './WordCountTextArea';
import styles from './ReasonsStep.module.css'; // Import CSS Module

export default function ReasonsStep({ formData, handleChange, errors }) { // Receive errors
  return (
    <div className={styles.stepContainer}> {/* Use CSS Module */}
      <h3 className={styles.stepTitle}>Why you?</h3> {/* Use CSS Module */}
      <label htmlFor="reasons" className={styles.label}> {/* Use CSS Module */}
        Give 3 reasons why you think you'd be a great wedding date:
      </label>
      
      <WordCountTextArea
        name="reasons"
        value={formData.reasons}
        onChange={handleChange}
        placeholder="1. Well... "
        rows={5}
        maxWords={200}
        hasError={!!errors?.reasons}
        errorMessage={errors?.reasons}
      />
      
      <div className={styles.helperText}>
        <p>✨ Pro tip: Quality applications with thoughtful responses get more votes!</p>
      </div>
    </div>
  );
}

// Remove inline styles object
// const styles = { ... }; 