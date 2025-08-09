import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import styles from "./AppLayout.module.scss";

const AppLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children || <Outlet />}</main>
      <Footer />
      <ChatBubble
        allowedPaths={["/", "/blog", "/topics", "/posts", "/topic"]}
      />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
