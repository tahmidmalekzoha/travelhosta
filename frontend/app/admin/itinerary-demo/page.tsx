"use client";

import { FunctionComponent, useState, useEffect } from 'react';
import { parseItinerary, itineraryToText } from '../../../utils/itineraryParser';
import Timeline from '../../../components/Timeline';
import { AlertCircle, Copy, Check } from 'lucide-react';

/**
 * Demo page to test the itinerary parsing and timeline system
 */
const ItineraryDemoPage: FunctionComponent = () => {
    const [inputText, setInputText] = useState(`:::timeline
## Dhaka to Sylhet
- Train: 395 Taka

## Sylhet Railway Station to Shahjalal Mazar
- CNG Auto: 25 Taka per person
- Reserve CNG: 125 Taka
- Breakfast: 100 Taka per person

## Shahjalal Mazar to Ratargul Swamp Forest
- Reserve car: 2500 Taka
- Entry fee: 50 Taka per person
- Boat ride: 200 Taka per boat
:::`);

    const [copied, setCopied] = useState(false);
    const [isTimelineSyntax, setIsTimelineSyntax] = useState(true);

    // Detect format automatically
    useEffect(() => {
        setIsTimelineSyntax(inputText.includes(':::timeline'));
    }, [inputText]);

    const parsedSteps = parseItinerary(inputText);
    const structuredJson = JSON.stringify(parsedSteps, null, 2);

    const handleCopyJson = async () => {
        try {
            await navigator.clipboard.writeText(structuredJson);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const sampleTexts = [
        {
            name: "Timeline Syntax - Sylhet Adventure",
            text: `:::timeline
## Dhaka to Sylhet
- Train: 395 Taka

## Sylhet Railway Station to Shahjalal Mazar
- CNG Auto: 25 Taka per person
- Reserve CNG: 125 Taka
- Breakfast: 100 Taka per person

## Shahjalal Mazar to Ratargul Swamp Forest
- Reserve car: 2500 Taka
- Entry fee: 50 Taka per person
- Boat ride: 200 Taka per boat
:::`
        },
        {
            name: "Timeline Syntax - Cox's Bazar",
            text: `:::timeline
## Dhaka to Cox's Bazar
- Flight: 6,000 Taka per person
- Bus (AC): 800 Taka per person

## Cox's Bazar Beach Activities
- Beach entry: Free
- Parasailing: 1,500 Taka per person
- Jet ski: 2,000 Taka (30 minutes)

## Cox's Bazar to Inani Beach
- Hired car: 1,200 Taka (round trip)
- Local CNG: 200 Taka (one way)
:::`
        },
        {
            name: "Plain Text - Dhaka City Tour",
            text: `Start from Dhaka University
Take CNG or Uber to Lalbagh Fort - 50 Taka

Visit Lalbagh Fort
Entry fee - 20 Taka per person
Guided tour available - 100 Taka

Lalbagh Fort to Ahsan Manzil
Rickshaw ride - 30 Taka
Walk through old Dhaka streets

Ahsan Manzil to Star Mosque
Bus or rickshaw - 25 Taka
Lunch at Old Dhaka - 150 Taka per person`
        }
    ];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1b3c44] mb-2">Itinerary System Demo</h1>
                    <p className="text-gray-600">Test the plain text to structured timeline conversion</p>
                </div>

                {/* Sample Templates */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-[#1b3c44] mb-4">Sample Templates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sampleTexts.map((sample, index) => (
                            <button
                                key={index}
                                onClick={() => setInputText(sample.text)}
                                className="p-4 border border-gray-200 rounded-lg hover:border-[#cd8453] hover:bg-[#cd8453]/5 transition-colors text-left"
                            >
                                <div className="font-medium text-[#1b3c44] mb-2">{sample.name}</div>
                                <div className="text-sm text-gray-600 line-clamp-3">{sample.text}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-[#1b3c44]">Plain Text Input</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Format:</span>
                                <span className={`text-sm px-2 py-1 rounded-full ${
                                    isTimelineSyntax 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-orange-100 text-orange-800'
                                }`}>
                                    {isTimelineSyntax ? 'Timeline Syntax' : 'Plain Text'}
                                </span>
                            </div>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            rows={15}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent font-mono text-sm"
                            placeholder="Enter your itinerary in plain text..."
                        />
                        
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                                <AlertCircle size={16} />
                                Supported Formats:
                            </div>
                            <div className="text-sm text-blue-700 space-y-2">
                                <div>
                                    <p className="font-medium">Timeline Syntax (Recommended):</p>
                                    <ul className="ml-4 space-y-1">
                                        <li>• Start with <code>:::timeline</code></li>
                                        <li>• Use <code>## Step Title</code> for main routes</li>
                                        <li>• Use <code>- Detail</code> for costs and info</li>
                                        <li>• End with <code>:::</code></li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-medium">Plain Text (Legacy):</p>
                                    <ul className="ml-4 space-y-1">
                                        <li>• Routes containing "to" (e.g., "Dhaka to Sylhet")</li>
                                        <li>• Details after dash (e.g., "- Train fare 395 Taka")</li>
                                        <li>• Blank lines between route changes</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Preview */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-[#1b3c44] mb-4">Timeline Preview</h2>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                            {parsedSteps.length > 0 ? (
                                <Timeline steps={parsedSteps} />
                            ) : (
                                <div className="text-gray-500 text-center py-8">
                                    No valid itinerary steps found. Check your input format.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Structured Data Output */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-[#1b3c44]">Structured JSON Output</h2>
                        <button
                            onClick={handleCopyJson}
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy JSON'}
                        </button>
                    </div>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto border">
                        <code className="text-gray-800">{structuredJson}</code>
                    </pre>
                </div>

                {/* How it Works */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-[#1b3c44] mb-4">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#cd8453] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                                1
                            </div>
                            <h3 className="font-semibold text-[#1b3c44] mb-2">Admin Input</h3>
                            <p className="text-sm text-gray-600">
                                Admin types travel steps in plain text format using natural language
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#cd8453] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                                2
                            </div>
                            <h3 className="font-semibold text-[#1b3c44] mb-2">Parse & Structure</h3>
                            <p className="text-sm text-gray-600">
                                System automatically parses text and converts it to structured JSON
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#cd8453] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                                3
                            </div>
                            <h3 className="font-semibold text-[#1b3c44] mb-2">Display Timeline</h3>
                            <p className="text-sm text-gray-600">
                                Frontend renders beautiful timeline with orange markers and styled cards
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryDemoPage;
