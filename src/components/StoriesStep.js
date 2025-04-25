'use client';

import React from 'react';
import WordCountTextArea from './WordCountTextArea';
import styles from './StoriesStep.module.css';

export default function StoriesStep({ formData, handleChange, errors }) {
  return (
    <div className={styles.stepContainer}>
      <h3 className={styles.stepTitle}>Tell us a story... briefly</h3>
      <label htmlFor="stories" className={styles.label}>
        Imagine you're going circle to circle at a party, what are some stories you would tell?
      </label>
      
      <WordCountTextArea
        name="stories"
        value={formData.stories}
        onChange={handleChange}
        placeholder="Summarize a few captivating stories here..."
        rows={5}
        maxWords={200}
        hasError={!!errors?.stories}
        errorMessage={errors?.stories}
      />
      
      <div className={styles.helperText}>
        <p>✨ Pro tip: Interesting stories help your application stand out!</p>
      </div>
    </div>
  );
} 