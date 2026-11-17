
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiChevronDown,
  FiHelpCircle,
} from "react-icons/fi";
import "./FAQ.css";
import "../InfoPage.css";

const faqData = [
  {
    category: "Orders",
    questions: [
      {
        question: "How can I place an order?",
        answer:
          "Browse our products, add your preferred items to the cart, and proceed to checkout. Enter your delivery details and confirm your order.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Login to your ShopNexa account and open the My Orders page. Select an order to view its available status and details.",
      },
      {
        question: "Can I cancel my order?",
        answer:
          "Order cancellation depends on the current order status. Please contact our support team as soon as possible with your order details.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        question: "What payment methods are available?",
        answer:
          "Currently, Cash on Delivery is available for eligible orders. Available payment options are displayed during checkout.",
      },
      {
        question: "When do I pay for a Cash on Delivery order?",
        answer:
          "For Cash on Delivery orders, payment is collected when the order is delivered to your address.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        question: "How can I request a return?",
        answer:
          "Please contact our support team with your order ID and the reason for your return. Return eligibility will be checked according to the applicable policy.",
      },
      {
        question: "How will I receive my refund?",
        answer:
          "Refund method and processing details will be communicated by our support team after your request is reviewed and approved.",
      },
    ],
  },
  {
    category: "Account",
    questions: [
      {
        question: "How do I create a ShopNexa account?",
        answer:
          "Click Register, enter the requested details, and submit the form to create your account.",
      },
      {
        question: "I forgot my password. What should I do?",
        answer:
          "Use the Forgot Password option if available on the login page, or contact our support team for assistance.",
      },
    ],
  },
];

function FAQ() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <main className="info-page faq-page">
      <div className="info-container">
        <Link to="/" className="info-back">
          <FiArrowLeft /> Back to Home
        </Link>

        <header className="info-header">
          <span>HELP CENTER</span>
          <h1>Frequently Asked Questions</h1>
          <p>
            Find answers to common questions about shopping at ShopNexa.
          </p>
        </header>

        <div className="faq-content">
          {faqData.map((section, sectionIndex) => (
            <section className="faq-section" key={section.category}>
              <h2>{section.category}</h2>

              {section.questions.map((item, questionIndex) => {
                const id = `${sectionIndex}-${questionIndex}`;
                const isOpen = activeQuestion === id;

                return (
                  <div
                    className={`faq-item ${isOpen ? "active" : ""}`}
                    key={id}
                  >
                    <button
                      className="faq-question"
                      onClick={() => toggleQuestion(id)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <FiChevronDown
                        className={isOpen ? "faq-chevron open" : "faq-chevron"}
                      />
                    </button>

                    {isOpen && (
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ))}
        </div>

        <div className="faq-help">
          <FiHelpCircle />
          <div>
            <h3>Still need help?</h3>
            <p>Our support team is here to help you.</p>
            <Link to="/contact">Contact Support</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FAQ;
