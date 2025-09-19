"use client";

import React from "react";
import styles from "./FAQSection.module.css";

export const FAQSection = () => {
    return (
        <div className={styles.faqContainer}>
            <div className={styles.background}>
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        <p className={styles.titleLine}>Find answers to</p>
                        <p className={styles.titleLine}>your questions</p>
                    </h2>

                    <div className={styles.faqMain}>
                        <div className={styles.questions}>
                            <div className={styles.questionItem}>
                                <div className={styles.questionText}>What is TravelHosta?</div>
                                <div className={styles.addCircle}>
                                    <svg className={styles.vector} viewBox="0 0 44 44" fill="none">
                                        <path d="M22 11V33M11 22H33" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.questionItem}>
                                <div className={styles.questionText}>What is TravelHosta?</div>
                                <div className={styles.addCircle}>
                                    <svg className={styles.vector} viewBox="0 0 44 44" fill="none">
                                        <path d="M22 11V33M11 22H33" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.questionItem}>
                                <div className={styles.questionText}>What is TravelHosta?</div>
                                <div className={styles.addCircle}>
                                    <svg className={styles.vector} viewBox="0 0 44 44" fill="none">
                                        <path d="M22 11V33M11 22H33" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.questionItem}>
                                <div className={styles.questionText}>What is TravelHosta?</div>
                                <div className={styles.addCircle}>
                                    <svg className={styles.vector} viewBox="0 0 44 44" fill="none">
                                        <path d="M22 11V33M11 22H33" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={styles.buttons}>
                            <div className={styles.buttonGroup}>
                                <div className={styles.generalButton}>
                                    <div className={styles.generalText}>General</div>
                                </div>
                            </div>

                            <div className={styles.subscriptionButton}>
                                <div className={styles.subscriptionText}>Subscription</div>
                            </div>

                            <div className={styles.privacyButton}>
                                <div className={styles.privacyText}>Privacy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
