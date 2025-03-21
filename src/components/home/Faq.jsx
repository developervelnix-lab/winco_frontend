import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ranabook } from "../jsondata/info";

const AccordionItem = ({ title, content, isOpen, toggle }) => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full px-2 py-2 text-base font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      >
        <span className="text-xm">{title}</span>
        {isOpen ? <FaChevronUp className="text-blue-500" /> : <FaChevronDown className="text-blue-500" />}
      </button>

      {/* Content */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-48 opacity-100 px-5 py-3 text-xm" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-700 dark:text-gray-300">{content}</p>
      </div>
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      title: ` Why is Ranabook one of the best online betting sites in India?`,
      content: "Ranabook is a trusted betting platform offering fast transactions and secure gaming experiences.",
    },
    {
      title: "Is online betting legal in India?",
      content: "Betting laws vary by state. Always check your local regulations before participating.",
    },
    {
      title: "How do I withdraw my winnings?",
      content: "Withdrawals are processed instantly using our secure banking methods. Minimum withdrawal limits apply.",
    },
    {
      title: "Can I ever win in an online casino?",
      content: "Yes, you can win in an online casino, but outcomes are based on chance, and games are designed with a house edge, so it's important to play responsibly.",
    },
    {
      title: "Is online casino games a skill or luck?",
      content: "Online casino games are generally based on luck, though some games like poker or blackjack may involve elements of skill.",
    },
  ];

  return (
    <div className="flex justify-center w-full"> {/* Center horizontally */}
      <div className="max-w-3xl w-full p-4"> {/* Added w-full */}
        <h2 className="text-xl font-serif text-center text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions (FAQs)
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              title={faq.title}
              content={faq.content}
              isOpen={openIndex === index}
              toggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;