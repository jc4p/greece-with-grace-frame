'use client';

import React, { useState, useEffect } from 'react';
import styles from './WordCountTextArea.module.css';

export default function WordCountTextArea({ 
  name, 
  value, 
  onChange, 
  placeholder, 
  rows = 5, 
  maxWords = 200,
  hasError,
  errorMessage
}) {
  const [wordCount, setWordCount] = useState(0);
  const [isOverLimit, setIsOverLimit] = useState(false);
  
  // Calculate word count whenever value changes
  useEffect(() => {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setIsOverLimit(words > maxWords);
  }, [value, maxWords]);
  
  // Handle text input with word limit
  const handleTextChange = (e) => {
    const newText = e.target.value;
    const words = newText.trim() ? newText.trim().split(/\s+/).length : 0;
    
    // Allow input if under the limit or if user is deleting text
    if (words <= maxWords || newText.length < value.length) {
      onChange(e);
    }
  };
  
  return (
    <div className={styles.wordCountContainer}>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={handleTextChange}
        placeholder={placeholder}
        required
        rows={rows}
        className={`${styles.textarea} ${hasError ? styles.error : ''} ${isOverLimit ? styles.overLimit : ''}`}
      />
      
      <div className={styles.wordCountDisplay}>
        <span className={isOverLimit ? styles.overLimitCount : ''}>
          {wordCount} / {maxWords} words
        </span>
        {wordCount < 5 && (
          <span className={styles.minWordsWarning}>
            Please write at least 5 words
          </span>
        )}
      </div>
      
      {hasError && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
} 