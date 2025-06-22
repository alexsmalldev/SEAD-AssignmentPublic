// Internal
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../../components/ui/accordion';
import Header from "../../../utilities/Header";
import { BookOpenIcon, HandRaisedIcon, DocumentMagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/solid';

const FrequentlyAskedQuestionsRegular = () => {

    const faqs = [
        {
            category: "General Questions",
            icon: BookOpenIcon,
            questions: [
                {
                    question: "What is FacilityCare?",
                    answer:
                        "FacilityCare is a facility management platform designed for employees to submit facility-related requests, such as maintenance or repairs, for their stores. Facility managers then review and address these requests to ensure smooth store operations.",
                },
                {
                    question: "Who can use FacilityCare?",
                    answer:
                        "FacilityCare is primarily used employees working within their assigned Buildings to submit requests. Facility managers at a company level act as system administrators, overseeing and resolving the requests.",
                },
                {
                    question: "Is FacilityCare available on mobile and desktop?",
                    answer:
                        "Yes, you can use FacilityCare on both iOS and Android devices, as well as through any web browser. To access the App through your mobile device just enter the link and go!",
                },
            ],
        },
        {
            category: "Submitting and Managing Requests",
            icon: HandRaisedIcon,
            questions: [
                {
                    question: "How can I raise a Request?",
                    embed: <iframe src="https://scribehow.com/embed/How_to_Raise_Request__0HiytIzERgml-t0OGcN8Mg?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
                {
                    question: "How can I view my Requests?",
                    embed: <iframe src="https://scribehow.com/embed/How_To_Access_My_Requests__tpjFyoYQQ32x1LndvuEgcg?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
                {
                    question: "How can I add a comment to my Request?",
                    embed: <iframe src="https://scribehow.com/embed/How_to_Add_a_Comment_to_your_Request__vs21IQAjQg2oSkJrF92fRA?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
            ],
        },
        {
            category: "Notifications",
            icon: BellIcon,
            questions: [
                {
                    question: "How do I access my Notifications?",
                    embed: <iframe src="https://scribehow.com/embed/Viewing_your_Notifications__QUtLNAxNTXCB-fOdJdtzEw?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
                {
                    question: "When will I receive Notifications?",
                    answer:
                        "If you're logged in you'll receive a live notification in the bottom right (Desktop) top middle (Mobile) of your screen.",
                },
            ],
        },
        {
            category: "Troubleshooting",
            icon: DocumentMagnifyingGlassIcon,
            questions: [
                {
                    question: "I want to change my Password, how can I do that?",
                    embed: <iframe src="https://scribehow.com/embed/Updating_Profile_Password_on_SEAA_Assignment_Platform__IrTOBQA5T4SVe9yCffQb2A?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
                {
                    question: "I can't log in to my FacilityCare account. What should I do?",
                    answer:
                        'If you’re having trouble logging in, send an email to your Facility Management department and they’ll get it reset for you.',
                },
            ],
        }
    ];

    return (
        <>
            <Header headerTitle="Help and Frequently Asked Questions" />

            <div className="mx-auto  mt-10 lg:mt-20">
                {faqs.map((faqCategory, index) => (
                    <div key={index} className="mb-12">
                        <div className="flex flex-row justify-start gap-2 items-center">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                <faqCategory.icon aria-hidden="true" className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h2 className="text-lg text-left font-semibold mb-4 mt-4">{faqCategory.category}</h2>
                        </div>

                        <Accordion type="single" collapsible>
                            {faqCategory.questions.map((faq, idx) => (
                                <AccordionItem key={idx} value={`faq-${index}-${idx}`}>
                                    <AccordionTrigger>
                                        {faq.question}
                                    </AccordionTrigger>
                                    {
                                        faq.embed ? <AccordionContent>{faq.embed}</AccordionContent> : <AccordionContent>{faq.answer}</AccordionContent>
                                    }
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FrequentlyAskedQuestionsRegular;
