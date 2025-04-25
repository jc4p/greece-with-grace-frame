'use client';

import React from 'react';
import WordCountTextArea from './WordCountTextArea';
import styles from './InterestsStep.module.css';

export default function InterestsStep({ formData, handleChange, errors }) {
  return (
    <div className={styles.stepContainer}>
      <h3 className={styles.stepTitle}>What are your interests?</h3>
      <label htmlFor="interests" className={styles.label}>
        List some of your hobbies and interests (e.g., hiking, coding, ancient history, cooking):
      </label>
      
      <WordCountTextArea
        name="interests"
        value={formData.interests}
        onChange={handleChange}
        placeholder="Your interests go here..."
        rows={5}
        maxWords={200}
        hasError={!!errors?.interests}
        errorMessage={errors?.interests}
      />
    </div>
  );
} 