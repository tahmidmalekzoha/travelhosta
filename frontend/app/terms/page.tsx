import Link from 'next/link';
import PublicNavbar from '../../components/PublicNavbar';

export default function Terms() {
    return (
        <div className="min-h-screen bg-[#f2eee9]">
            <PublicNavbar />
            <div className="mx-auto max-w-4xl px-6 pb-16 pt-12">
                <div className="bg-[#1b3c44] rounded-[39px] p-12 shadow-xl">
                    <div className="mb-8">
                        <Link
                            href="/signup"
                            className="inline-flex items-center text-[#cd8453] transition-colors hover:text-[#b8754a]"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Sign Up
                        </Link>
                    </div>

                    <h1 className="text-4xl font-bold text-[#f2eee9] mb-8 font-['Schibsted_Grotesk']">
                        Terms and Conditions
                    </h1>

                    <div className="text-[#f2eee9] space-y-6 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-[#cd8453]">1. Welcome to TravelHosta</h2>
                            <p>
                                These terms and conditions outline the rules and regulations for the use of TravelHosta&apos;s website
                                and services. By accessing this website, we assume you accept these terms and conditions in full.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-[#cd8453]">2. Account Registration</h2>
                            <p>
                                When you create an account with us, you must provide information that is accurate, complete,
                                and current at all times. You are responsible for safeguarding the password and for all activities
                                that occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-[#cd8453]">3. Travel Information</h2>
                            <p>
                                The travel guides and information provided on TravelHosta are for general informational purposes only.
                                While we strive to keep the information up to date and correct, we make no representations or warranties
                                of any kind about the completeness, accuracy, or reliability of the information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-[#cd8453]">4. User Content</h2>
                            <p>
                                You retain ownership of any content you submit to TravelHosta. However, by submitting content,
                                you grant us a worldwide, royalty-free license to use, display, and distribute your content
                                in connection with our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-[#cd8453]">5. Privacy Policy</h2>
                            <p>
                                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect
                                your information when you use our services. By using TravelHosta, you agree to the collection
                                and use of information in accordance with our Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-[#cd8453]">6. Limitation of Liability</h2>
                            <p>
                                TravelHosta shall not be held liable for any indirect, incidental, special, consequential,
                                or punitive damages, including without limitation, loss of profits, data, use, goodwill,
                                or other intangible losses.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-[#cd8453]">7. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify or replace these terms at any time. If a revision is material,
                                we will provide at least 30 days notice prior to any new terms taking effect.
                            </p>
                        </section>

                    <section>
                            <h2 className="text-2xl font-semibold mb-4 text-[#cd8453]">8. Contact Information</h2>
                            <p>
                                If you have any questions about these Terms and Conditions, please contact us at:
                                <br />
                                Email: legal@travelhosta.com
                                <br />
                                Last updated: September 17, 2025
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-[#cd8453]/30">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center bg-[#cd8453] text-white px-8 py-4 rounded-full hover:bg-[#b8754a] transition-colors font-medium"
                        >
                            I Accept These Terms
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
