// External libraries
import { DocumentMagnifyingGlassIcon, BuildingOffice2Icon, WrenchScrewdriverIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

// Internal
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../../components/ui/accordion';
import Header from "../../../utilities/Header";


const FrequentlyAskedQuestionsAdmin = () => {

    const faqs = [
        {
            category: "Building Management",
            icon: BuildingOffice2Icon,
            questions: [
                {
                    question: "How can I create a Building?",
                    embed: <iframe src="https://scribehow.com/embed/Creating_a_new_Building__5awNxv0gRaa3gl88HwbbxA?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
                {
                    question: "How can I update a Buildings details?",
                    embed: <iframe src="https://scribehow.com/embed/Updating_a_Building_Details__dm2MVzm8SPOmDj9aSOfm1Q?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
                {
                    question: "I need to update the Users assigned to a Building, how do I do that?",
                    embed: <iframe src="https://scribehow.com/embed/How_to_Assign_and_Remove_Users_against_Buildings__kwLihJsFQ5SwYe3-9da4gw?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
            ],
        },
        {
            category: "Service Configuration",
            icon: WrenchScrewdriverIcon,
            questions: [
                {
                    question: "How can I create a new Service?",
                    embed: <iframe src="https://scribehow.com/embed/Creating_a_New_Service__H8k-D9-hTkyzljQ5xJzl0Q?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
                {
                    question: "I need to disabled a Service, where do I do that?",
                    embed: <iframe src="https://scribehow.com/embed/Updating_Services__lJvNZVesQMmO7nX-Ry0qvw?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                }
            ],
        },
        {
            category: "Request Management",
            icon: ClipboardDocumentListIcon,
            questions: [
                {
                    question: "Where can I find all Requests?",
                    embed: <iframe src="https://scribehow.com/embed/How_to_Access_Requests__SOpps3dVSvGSEm9IrIovrg?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
                {
                    question: "How do I update a Request state?",
                    embed: <iframe src="https://scribehow.com/embed/Updating_Request_Statuses__XwYuAglvSPK1R2Np7iGBIg?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
                },
                {
                    question: "I need to notify a User regarding a Request, where do I do that?",
                    embed: <iframe src="https://scribehow.com/embed/Adding_comments_to_requests__pu8-pVLjThC8fNWe5Viviw?skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>
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

export default FrequentlyAskedQuestionsAdmin;
