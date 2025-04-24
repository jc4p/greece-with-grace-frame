'use client';

import React from 'react';
import styles from './InterestsStep.module.css';

export default function InterestsStep({ formData, handleChange, errors }) {
  return (
    <div className={styles.stepContainer}>
      <h3 className={styles.stepTitle}>What are your interests?</h3>
      <label htmlFor="interests" className={styles.label}>
        List some of your hobbies and interests (e.g., hiking, coding, ancient history, cooking):
      </label>
      <textarea
        id="interests"
        name="interests"
        value={formData.interests}
        onChange={handleChange}
        placeholder="Your interests go here..."
        required
        rows={5}
        className={`${styles.textarea} ${errors?.interests ? styles.error : ''}`}
      />
      {errors?.interests && <p className={styles.errorMessage}>{errors.interests}</p>}
    </div>
  );
} 