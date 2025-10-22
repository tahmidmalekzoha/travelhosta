/**
 * Timeline block parser
 */

import type { TimelineBlock, ItineraryStep, BlockParser, BlockStringifier, BlockValidator } from './types';

/**
 * Parses timeline steps from text buffer
 */
export function parseTimelineSteps(buffer: string[]): ItineraryStep[] {
    const steps: ItineraryStep[] = [];
    let currentStep: Partial<ItineraryStep> | null = null;
    let tipsBuffer: string[] = [];
    let notesBuffer: string[] = [];
    let inTips = false;
    let inNotes = false;
    let emptyLineCount = 0;

    const finalizeCurrentStep = () => {
        if (currentStep && currentStep.title) {
            // Add any pending tips/notes before finalizing
            if (tipsBuffer.length > 0) {
                currentStep.tips = (currentStep.tips || []).concat(tipsBuffer.filter(t => t.trim()));
                tipsBuffer = [];
            }
            if (notesBuffer.length > 0) {
                currentStep.notes = (currentStep.notes || []).concat(notesBuffer.filter(n => n.trim()));
                notesBuffer = [];
            }
            steps.push(currentStep as ItineraryStep);
            currentStep = null;
        } else if (tipsBuffer.length > 0 || notesBuffer.length > 0) {
            // If we have tips/notes but no step, clear the buffers
            tipsBuffer = [];
            notesBuffer = [];
        }
    };

    for (const line of buffer) {
        const trimmed = line.trim();
        
        // Track empty lines for step separation
        if (!trimmed) {
            emptyLineCount++;
            // Two or more consecutive empty lines signal a new step
            if (emptyLineCount >= 2 && !inTips && !inNotes) {
                finalizeCurrentStep();
                emptyLineCount = 0;
            }
            continue;
        } else {
            emptyLineCount = 0;
        }
        
        // Check for inline tips/notes sections
        if (trimmed === '[tips]') {
            // If not in a step yet, create one
            if (!currentStep) {
                currentStep = {
                    id: `step-${steps.length + 1}`,
                    title: '',
                    details: []
                };
            }
            inTips = true;
            inNotes = false;
            continue;
        } else if (trimmed === '[/tips]') {
            // Add collected tips to current step
            if (currentStep && tipsBuffer.length > 0) {
                currentStep.tips = (currentStep.tips || []).concat(tipsBuffer.filter(t => t.trim()));
                tipsBuffer = [];
            }
            inTips = false;
            continue;
        } else if (trimmed === '[notes]') {
            // If not in a step yet, create one
            if (!currentStep) {
                currentStep = {
                    id: `step-${steps.length + 1}`,
                    title: '',
                    details: []
                };
            }
            inNotes = true;
            inTips = false;
            continue;
        } else if (trimmed === '[/notes]') {
            // Add collected notes to current step
            if (currentStep && notesBuffer.length > 0) {
                currentStep.notes = (currentStep.notes || []).concat(notesBuffer.filter(n => n.trim()));
                notesBuffer = [];
            }
            inNotes = false;
            continue;
        }

        if (inTips) {
            if (trimmed.startsWith('- ') || trimmed.startsWith('-')) {
                const content = trimmed.startsWith('- ') ? trimmed.substring(2).trim() : trimmed.substring(1).trim();
                tipsBuffer.push(content);
            } else {
                // Non-list item in tips - add as continuation
                tipsBuffer.push(trimmed);
            }
        } else if (inNotes) {
            if (trimmed.startsWith('- ') || trimmed.startsWith('-')) {
                const content = trimmed.startsWith('- ') ? trimmed.substring(2).trim() : trimmed.substring(1).trim();
                notesBuffer.push(content);
            } else {
                // Non-list item in notes - add as continuation
                notesBuffer.push(trimmed);
            }
        } else if (trimmed && !trimmed.startsWith(':::')) {
            // Main timeline step content
            if (trimmed.startsWith('- ')) {
                // It's a detail line
                if (!currentStep) {
                    // If no current step, this line itself becomes the title
                    currentStep = {
                        id: `step-${steps.length + 1}`,
                        title: trimmed.substring(2).trim(),
                        details: []
                    };
                } else {
                    // If current step has no title, use first detail as title
                    if (!currentStep.title) {
                        currentStep.title = trimmed.substring(2).trim();
                    } else {
                        currentStep.details = currentStep.details || [];
                        currentStep.details.push(trimmed.substring(2).trim());
                    }
                }
            } else {
                // Non-list line
                if (!currentStep) {
                    // Start new step with this as title
                    currentStep = {
                        id: `step-${steps.length + 1}`,
                        title: trimmed,
                        details: []
                    };
                } else if (!currentStep.title) {
                    // Set as title if step has no title yet
                    currentStep.title = trimmed;
                } else {
                    // Add to details if we already have a title
                    currentStep.details = currentStep.details || [];
                    currentStep.details.push(trimmed);
                }
            }
        }
    }

    // Finalize the last step
    finalizeCurrentStep();

    return steps;
}

/**
 * Parses timeline block from buffer
 */
export const parseTimelineBlock: BlockParser<TimelineBlock> = (buffer, attrs, context) => {
    return {
        type: 'timeline',
        id: context.generateId('timeline'),
        title: attrs.title,
        steps: parseTimelineSteps(buffer)
    };
};

/**
 * Converts timeline block to string format
 */
export const stringifyTimelineBlock: BlockStringifier<TimelineBlock> = (block) => {
    const lines: string[] = [];
    
    if (block.title) {
        lines.push(`:::timeline [title="${block.title}"]`);
    } else {
        lines.push(`:::timeline`);
    }
    
    block.steps.forEach(step => {
        lines.push(step.title);
        step.details.forEach(detail => lines.push(`- ${detail}`));
        
        if (step.tips && step.tips.length > 0) {
            lines.push('');
            lines.push('[tips]');
            step.tips.forEach(tip => lines.push(`- ${tip}`));
            lines.push('[/tips]');
        }
        
        if (step.notes && step.notes.length > 0) {
            lines.push('');
            lines.push('[notes]');
            step.notes.forEach(note => lines.push(`- ${note}`));
            lines.push('[/notes]');
        }
    });
    
    lines.push(':::');
    return lines;
};

/**
 * Validates timeline block
 */
export const validateTimelineBlock: BlockValidator<TimelineBlock> = (block, index) => {
    const errors: string[] = [];
    
    if (!block.steps || block.steps.length === 0) {
        errors.push(`Block ${index + 1}: Timeline has no steps`);
    }
    
    block.steps?.forEach((step, stepIndex) => {
        if (!step.title?.trim()) {
            errors.push(`Block ${index + 1}, Step ${stepIndex + 1}: Missing title`);
        }
        if (!step.details || step.details.length === 0) {
            errors.push(`Block ${index + 1}, Step ${stepIndex + 1}: No details provided`);
        }
    });
    
    return errors;
};
