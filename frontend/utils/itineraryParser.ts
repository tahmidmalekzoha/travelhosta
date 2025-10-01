import { ItineraryStep } from '../types';

/**
 * Parses itinerary text into structured format
 * Supports two formats:
 * 
 * 1. Timeline syntax:
 * :::timeline
 * ## Dhaka to Sylhet
 * - Train: 395 Taka
 * 
 * ## Sylhet to Mazar
 * - CNG Auto: 25 Taka per person
 * - Breakfast: 100 Taka per person
 * :::
 * 
 * 2. Plain text (legacy):
 * "Dhaka to Sylhet – Train fare 395 Taka
 * Sylhet Railway Station to Shahjalal Mazar – CNG 25 Taka"
 */
export function parseItinerary(text: string): ItineraryStep[] {
    if (!text || !text.trim()) return [];

    // Check if using timeline syntax
    if (text.includes(':::timeline')) {
        return parseTimelineSyntax(text);
    }

    // Use legacy plain text parsing
    return parsePlainText(text);
}

/**
 * Parses the new :::timeline syntax
 */
function parseTimelineSyntax(text: string): ItineraryStep[] {
    // Extract content between :::timeline and :::
    const timelineMatch = text.match(/:::timeline\s*([\s\S]*?)\s*:::/);
    if (!timelineMatch) return [];

    const content = timelineMatch[1].trim();
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    const steps: ItineraryStep[] = [];
    let currentStep: ItineraryStep | null = null;

    for (const line of lines) {
        // Check for step header (## Title)
        if (line.startsWith('## ')) {
            // Save previous step if exists
            if (currentStep) {
                steps.push(currentStep);
            }

            // Create new step
            const title = line.substring(3).trim();
            currentStep = {
                id: `step-${steps.length + 1}`,
                title,
                details: []
            };
        }
        // Check for detail item (- Detail)
        else if (line.startsWith('- ') && currentStep) {
            const detail = line.substring(2).trim();
            currentStep.details.push(detail);
        }
        // Handle non-markdown lines as additional details
        else if (line && currentStep && !line.startsWith('#')) {
            currentStep.details.push(line);
        }
    }

    // Add the last step
    if (currentStep) {
        steps.push(currentStep);
    }

    return steps;
}

/**
 * Parses legacy plain text format
 */
function parsePlainText(text: string): ItineraryStep[] {
    const lines = text.split('\n').filter(line => line.trim());
    const steps: ItineraryStep[] = [];
    let currentStep: ItineraryStep | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Check if this line contains a main route (has " to " or " → " or " – ")
        const isMainRoute = /\s+to\s+|\s*→\s*|\s*–\s*/.test(trimmedLine) && 
                           !trimmedLine.toLowerCase().startsWith('you can also') &&
                           !trimmedLine.toLowerCase().startsWith('breakfast') &&
                           !trimmedLine.toLowerCase().startsWith('lunch') &&
                           !trimmedLine.toLowerCase().startsWith('dinner');

        if (isMainRoute) {
            // Save previous step if exists
            if (currentStep) {
                steps.push(currentStep);
            }

            // Extract main title (everything before the first dash or price info)
            const titleMatch = trimmedLine.match(/^([^–\-]+?)(?:\s*[–\-]\s*(.+))?$/);
            const title = titleMatch?.[1]?.trim() || trimmedLine;
            const detail = titleMatch?.[2]?.trim();

            currentStep = {
                id: `step-${steps.length + 1}`,
                title,
                details: detail ? [detail] : []
            };
        } else {
            // This is additional detail for the current step
            if (currentStep) {
                currentStep.details.push(trimmedLine);
            } else {
                // No current step, create one with this line as title
                currentStep = {
                    id: `step-${steps.length + 1}`,
                    title: trimmedLine,
                    details: []
                };
            }
        }
    }

    // Add the last step
    if (currentStep) {
        steps.push(currentStep);
    }

    return steps;
}

/**
 * Converts structured itinerary back to timeline syntax for editing
 */
export function itineraryToText(steps: ItineraryStep[], useTimelineSyntax: boolean = true): string {
    if (useTimelineSyntax) {
        return itineraryToTimelineSyntax(steps);
    }
    return itineraryToPlainText(steps);
}

/**
 * Converts to timeline syntax format
 */
function itineraryToTimelineSyntax(steps: ItineraryStep[]): string {
    if (steps.length === 0) return '';

    const lines = [':::timeline'];
    
    steps.forEach(step => {
        lines.push(`## ${step.title}`);
        step.details.forEach(detail => {
            lines.push(`- ${detail}`);
        });
        lines.push(''); // Empty line between steps
    });

    // Remove last empty line and add closing
    if (lines[lines.length - 1] === '') {
        lines.pop();
    }
    lines.push(':::');

    return lines.join('\n');
}

/**
 * Converts to plain text format (legacy)
 */
function itineraryToPlainText(steps: ItineraryStep[]): string {
    return steps.map(step => {
        const lines = [step.title];
        step.details.forEach(detail => {
            lines.push(detail);
        });
        return lines.join('\n');
    }).join('\n\n');
}

/**
 * Validates if the parsed itinerary makes sense
 */
export function validateItinerary(steps: ItineraryStep[]): string[] {
    const errors: string[] = [];

    if (steps.length === 0) {
        errors.push('No itinerary steps found');
        return errors;
    }

    steps.forEach((step, index) => {
        if (!step.title.trim()) {
            errors.push(`Step ${index + 1}: Title is required`);
        }
    });

    return errors;
}
