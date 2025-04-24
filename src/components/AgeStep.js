'use client';

import React from 'react';
import styles from './AgeStep.module.css'; // Import CSS Module

export default function AgeStep({ formData, handleChange, errors }) { // Receive errors
  return (
    <div className={styles.stepContainer}> {/* Use CSS Module */}
      <h3 className={styles.stepTitle}>How old are you?</h3> {/* Use CSS Module */}
      <label htmlFor="age" className={styles.label}>Age:</label> {/* Use CSS Module */}
      <input
        type="number"
        id="age"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="e.g., 30"
        required
        min="18" // Let's assume a minimum age requirement
        className={`${styles.input} ${errors?.age ? styles.error : ''}`}
      />
      {errors?.age && <p className={styles.errorMessage}>{errors.age}</p>}
    </div>
  );
}