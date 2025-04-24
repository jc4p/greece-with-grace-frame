'use client';

import React from 'react';
import styles from './NameStep.module.css'; // Import CSS Module

export default function NameStep({ formData, handleChange, errors }) { // Receive errors prop
  return (
    <div className={styles.stepContainer}> {/* Use CSS Module class */}
      <h3 className={styles.stepTitle}>What's your name?</h3> {/* Use CSS Module class */}
      <label htmlFor="name" className={styles.label}>Name:</label> {/* Use CSS Module class */}
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Max Power"
        required
        className={`${styles.input} ${errors?.name ? styles.error : ''}`} // Apply error class conditionally
      />
      {errors?.name && <p className={styles.errorMessage}>{errors.name}</p>} {/* Display error message */}
    </div>
  );
}

// Remove inline styles object
// const styles = { ... }; 