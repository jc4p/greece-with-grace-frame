'use client';

import React, { useState } from 'react';
import NameStep from './NameStep';
import AgeStep from './AgeStep';
import LocationStep from './LocationStep';
import PassportStep from './PassportStep';
import ReasonsStep from './ReasonsStep';
import StoriesStep from './StoriesStep';
import InterestsStep from './InterestsStep';
import FriendDescriptionStep from './FriendDescriptionStep';
import styles from './MultiStepForm.module.css'; // Import CSS module

const TOTAL_STEPS = 8;

export default function MultiStepForm({ onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    hasPassport: null,
    reasons: '',
    stories: '',
    interests: '',
    friendDescription: '',
  });
  const [errors, setErrors] = useState({}); // State for validation errors

  // Basic validation logic (can be expanded)
  const validateStep = () => {
    const newErrors = {};
    const countWords = (text) => (text?.trim() ? text.trim().split(/\s+/).length : 0);

    // Simple required validation for current step's fields
    switch (currentStep) {
      case 1: if (!formData.name.trim()) newErrors.name = 'Name is required'; break;
      case 2: if (!formData.age) newErrors.age = 'Age is required'; else if (parseInt(formData.age) < 18) newErrors.age = 'Must be 18 or older'; break;
      case 3: if (!formData.location.trim()) newErrors.location = 'Location is required'; break;
      case 4: if (formData.hasPassport === null) newErrors.hasPassport = 'Passport selection is required'; break;
      case 5: 
        if (!formData.reasons.trim()) {
          newErrors.reasons = 'Reasons are required';
        } else if (countWords(formData.reasons) < 5) {
          newErrors.reasons = 'Please write at least 5 words';
        }
        break;
      case 6: 
        if (!formData.interests.trim()) {
          newErrors.interests = 'Interests are required';
        } else if (countWords(formData.interests) < 5) {
          newErrors.interests = 'Please write at least 5 words';
        } 
        break;
      case 7: 
        if (!formData.stories.trim()) {
          newErrors.stories = 'Stories summary is required';
        } else if (countWords(formData.stories) < 5) {
          newErrors.stories = 'Please write at least 5 words';
        }
        break;
      case 8: 
        if (!formData.friendDescription.trim()) {
          newErrors.friendDescription = 'Friend description is required';
        } else if (countWords(formData.friendDescription) < 5) {
          newErrors.friendDescription = 'Please write at least 5 words';
        }
        break;
      default: break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if valid
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for the field being changed
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === 'true'
    }));
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    // No validation needed for going back
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateStep()) {
      onSubmit(formData);
      // Optional: Reset form state
      // setCurrentStep(1);
      // setFormData({ name: '', age: '', ... });
      // setErrors({});
    }
  };

  const renderStep = () => {
    const stepProps = { formData, handleChange, handleRadioChange, errors }; // Pass errors down
    switch (currentStep) {
      case 1: return <NameStep {...stepProps} />;
      case 2: return <AgeStep {...stepProps} />;
      case 3: return <LocationStep {...stepProps} />;
      case 4: return <PassportStep {...stepProps} />;
      case 5: return <ReasonsStep {...stepProps} />;
      case 6: return <InterestsStep {...stepProps} />;
      case 7: return <StoriesStep {...stepProps} />;
      case 8: return <FriendDescriptionStep {...stepProps} />;
      default: return <div>Unknown Step</div>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.stepIndicator}>
        Step {currentStep} of {TOTAL_STEPS}
      </div>

      <div className={styles.stepContent}>
        {renderStep()}
      </div>

      <div className={styles.navigationButtons}>
        <button
           type="button"
           onClick={prevStep}
           className={`${styles.button} ${styles.prevButton}`}
           disabled={currentStep === 1}
           style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }} // Hide instead of just disabling
           >
            Previous
        </button>

        {currentStep < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={nextStep}
            className={`${styles.button} ${styles.nextButton}`}
            >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
            >
            Submit Application
          </button>
        )}
      </div>
    </form>
  );
}