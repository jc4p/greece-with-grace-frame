'use client';

import React from 'react';
import styles from './PassportStep.module.css'; // Import CSS Module

export default function PassportStep({ formData, handleRadioChange, errors }) { // Receive errors
  return (
    <div className={styles.stepContainer}> {/* Use CSS Module */}
      <h3 className={styles.stepTitle}>Do you have a valid passport?</h3> {/* Use CSS Module */}
      <div className={`${styles.radioGroup} ${errors?.hasPassport ? styles.error : ''}`}>
        <label className={styles.radioLabel}> {/* Use CSS Module */}
          <input
            type="radio"
            name="hasPassport"
            value="true" // Value is string 'true'
            checked={formData.hasPassport === true}
            onChange={handleRadioChange}
            required
            className={styles.radioInput} /* Use CSS Module */
          />
          Yes
        </label>
        <label className={styles.radioLabel}> {/* Use CSS Module */}
          <input
            type="radio"
            name="hasPassport"
            value="false" // Value is string 'false'
            checked={formData.hasPassport === false}
            onChange={handleRadioChange}
            required
            className={styles.radioInput} /* Use CSS Module */
          />
          No
        </label>
      </div>
      {errors?.hasPassport && <p className={styles.errorMessage}>{errors.hasPassport}</p>} {/* Display error */}
      {formData.hasPassport === false && (
        <p className={styles.warningText}> {/* Use CSS Module */}
          Please note: A valid passport is required for international travel to Greece.
        </p>
      )}
    </div>
  );
}