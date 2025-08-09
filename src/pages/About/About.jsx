import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Badge } from "../../components";
import styles from "./About.module.scss";

const About = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Modern Tech Stack",
      description: "Built with React, Node.js, and cutting-edge technologies",
      icon: "⚛️",
    },
    {
      title: "Expert Content",
      description: "Quality articles from experienced developers worldwide",
      icon: "👨‍💻",
    },
    {
      title: "Community Driven",
      description: "Connect, share, and learn from fellow developers",
      icon: "🤝",
    },
    {
      title: "Always Learning",
      description: "Stay updated with the latest trends and best practices",
      icon: "📚",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Readers" },
    { number: "500+", label: "Published Articles" },
    { number: "50+", label: "Expert Contributors" },
    { number: "20+", label: "Tech Topics" },
  ];

  const team = [
    {
      name: "Alex Chen",
      role: "Founder & Lead Developer",
      avatar: "/api/placeholder/80/80",
      bio: "Full-stack developer with 8+ years of experience in React and Node.js",
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "Sarah Kim",
      role: "Content Strategist",
      avatar: "/api/placeholder/80/80",
      bio: "Technical writer passionate about making complex concepts accessible",
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "Mike Johnson",
      role: "UI/UX Designer",
      avatar: "/api/placeholder/80/80",
      bio: "Creative designer focused on user-centered design and accessibility",
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
  ];

  return (
    <div className={styles.about}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <Badge variant="secondary" className={styles.heroBadge}>
                About BlogK
              </Badge>
              <h1 className={styles.heroTitle}>
                Empowering Developers Through
                <span className={styles.heroHighlight}> Knowledge Sharing</span>
              </h1>
              <p className={styles.heroDescription}>
                BlogK is a modern platform where developers share insights,
                learn from each other, and stay ahead of the technology curve.
                We believe in the power of community-driven learning and open
                knowledge sharing.
              </p>
              <div className={styles.heroActions}>
                <Button variant="primary" size="lg" asChild>
                  <Link to="/register">Join Our Community</Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link to="/topics">Explore Content</Link>
                </Button>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.heroIllustration}>
                <div className={styles.floatingCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>Latest Article</div>
                    <div className={styles.cardText}>Building Modern Apps</div>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardAuthor}>By Expert Dev</span>
                      <span className={styles.cardDate}>2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.mission}>
          <div className={styles.missionContent}>
            <div className={styles.missionText}>
              <h2 className={styles.sectionTitle}>Our Mission</h2>
              <p className={styles.missionDescription}>
                To democratize access to high-quality programming knowledge and
                create a vibrant community where developers of all levels can
                learn, share, and grow together. We strive to bridge the gap
                between theory and practice through real-world examples and
                expert insights.
              </p>
              <div className={styles.missionPoints}>
                <div className={styles.missionPoint}>
                  <span className={styles.pointIcon}>🎯</span>
                  <span>Quality over quantity in every piece of content</span>
                </div>
                <div className={styles.missionPoint}>
                  <span className={styles.pointIcon}>🌍</span>
                  <span>Building a global community of learners</span>
                </div>
                <div className={styles.missionPoint}>
                  <span className={styles.pointIcon}>🚀</span>
                  <span>Staying ahead of technology trends</span>
                </div>
              </div>
            </div>
            <div className={styles.missionVisual}>
              <div className={styles.missionIllustration}>
                <div className={styles.missionIcon}>💡</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What Makes Us Different</h2>
            <p className={styles.sectionSubtitle}>
              Discover the features that set BlogK apart from other developer
              platforms
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${styles.featureCard} ${
                  activeFeature === index ? styles.active : ""
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.team}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Meet Our Team</h2>
            <p className={styles.sectionSubtitle}>
              The passionate people behind BlogK who make it all possible
            </p>
          </div>
          <div className={styles.teamGrid}>
            {team.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <div className={styles.teamAvatar}>
                  <img src={member.avatar} alt={member.name} />
                </div>
                <div className={styles.teamInfo}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamRole}>{member.role}</p>
                  <p className={styles.teamBio}>{member.bio}</p>
                  <div className={styles.teamSocial}>
                    <a href={member.social.github} aria-label="GitHub">
                      <span>👨‍💻</span>
                    </a>
                    <a href={member.social.twitter} aria-label="Twitter">
                      <span>🐦</span>
                    </a>
                    <a href={member.social.linkedin} aria-label="LinkedIn">
                      <span>💼</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h3 className={styles.ctaTitle}>Ready to Join Our Community?</h3>
              <p className={styles.ctaDescription}>
                Start your journey with BlogK today. Share your knowledge, learn
                from others, and grow your skills.
              </p>
              <div className={styles.ctaActions}>
                <Button variant="primary" size="lg" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
