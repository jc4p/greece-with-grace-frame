'use client';

import React from 'react';
import styles from './StoriesStep.module.css';

export default function StoriesStep({ formData, handleChange, errors }) {
  return (
    <div className={styles.stepContainer}>
      <h3 className={styles.stepTitle}>Tell us a story... briefly</h3>
      <label htmlFor="stories" className={styles.label}>
        Imagine you're going circle to circle at a party, what are some stories you would tell?
      </label>
      <textarea
        id="stories"
        name="stories"
        value={formData.stories}
        onChange={handleChange}
        placeholder="Summarize a few captivating stories here..."
        required
        rows={5}
        className={`${styles.textarea} ${errors?.stories ? styles.error : ''}`}
      />
      {errors?.stories && <p className={styles.errorMessage}>{errors.stories}</p>}
    </div>
  );
} 