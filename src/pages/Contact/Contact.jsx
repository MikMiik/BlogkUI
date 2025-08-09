import { useState } from "react";
import { Button, Badge } from "../../components";
import styles from "./Contact.module.scss";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      value: "hello@blogk.dev",
      description: "Send us an email anytime",
    },
    {
      icon: "💬",
      title: "Live Chat",
      value: "Available 9 AM - 6 PM EST",
      description: "Chat with our support team",
    },
    {
      icon: "📱",
      title: "Social Media",
      value: "@blogk_dev",
      description: "Follow us for updates",
    },
    {
      icon: "🌍",
      title: "Location",
      value: "San Francisco, CA",
      description: "Where we're based",
    },
  ];

  const faqItems = [
    {
      question: "How can I contribute to BlogK?",
      answer:
        "You can contribute by writing articles, sharing your expertise, or helping improve our platform. Check out our contributor guidelines for more information.",
    },
    {
      question: "Is BlogK free to use?",
      answer:
        "Yes! BlogK is completely free to read and contribute to. We believe in open access to knowledge.",
    },
    {
      question: "How do I report a technical issue?",
      answer:
        "You can report technical issues through this contact form or email us directly at tech@blogk.dev.",
    },
    {
      question: "Can I request specific topics?",
      answer:
        "Absolutely! We welcome topic requests and feedback from our community. Let us know what you'd like to learn about.",
    },
  ];

  return (
    <div className={styles.contact}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <Badge variant="secondary" className={styles.heroBadge}>
              Contact Us
            </Badge>
            <h1 className={styles.heroTitle}>
              Let&apos;s Start a
              <span className={styles.heroHighlight}> Conversation</span>
            </h1>
            <p className={styles.heroDescription}>
              Have questions, suggestions, or want to collaborate? We&apos;d
              love to hear from you. Get in touch and let&apos;s build something
              amazing together.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Contact Info Section */}
        <section className={styles.contactInfo}>
          <div className={styles.contactGrid}>
            {contactInfo.map((info, index) => (
              <div key={index} className={styles.contactCard}>
                <div className={styles.contactIcon}>{info.icon}</div>
                <h3 className={styles.contactTitle}>{info.title}</h3>
                <div className={styles.contactValue}>{info.value}</div>
                <p className={styles.contactDescription}>{info.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formContent}>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Send us a Message</h2>
                <p className={styles.formDescription}>
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>

              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.formLabel}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="content">Content Collaboration</option>
                    <option value="business">Business Partnership</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    required
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                  />
                </div>

                {submitStatus === "success" && (
                  <div className={styles.successMessage}>
                    ✅ Thank you! Your message has been sent successfully.
                    We&apos;ll get back to you soon.
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            <div className={styles.formSidebar}>
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Quick Response</h3>
                <p className={styles.sidebarText}>
                  We typically respond within 24 hours during business days.
                </p>
              </div>

              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Join Our Community</h3>
                <p className={styles.sidebarText}>
                  Connect with other developers in our Discord community for
                  real-time discussions and support.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className={styles.sidebarButton}
                >
                  Join Discord
                </Button>
              </div>

              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Newsletter</h3>
                <p className={styles.sidebarText}>
                  Stay updated with our latest articles and platform updates.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className={styles.sidebarButton}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faq}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>
              Find quick answers to common questions about BlogK
            </p>
          </div>

          <div className={styles.faqGrid}>
            {faqItems.map((item, index) => (
              <div key={index} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{item.question}</h3>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h3 className={styles.ctaTitle}>Ready to Get Started?</h3>
              <p className={styles.ctaDescription}>
                Join thousands of developers who are already part of the BlogK
                community.
              </p>
              <div className={styles.ctaActions}>
                <Button variant="primary" size="lg">
                  Create Account
                </Button>
                <Button variant="secondary" size="lg">
                  Browse Articles
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
