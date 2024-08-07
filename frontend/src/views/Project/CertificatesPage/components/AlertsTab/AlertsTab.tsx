import { motion } from "framer-motion";

import { AlertsSection } from "./components";

export const AlertsTab = () => {
  return (
    <motion.div
      key="panel-alerts"
      transition={{ duration: 0.15 }}
      initial={{ opacity: 0, translateX: 30 }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: 30 }}
    >
      <AlertsSection />
    </motion.div>
  );
};
