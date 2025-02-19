import { useState } from "react";
import { useNavigate } from "react-router-dom";  // For redirection after subscription

const SubscriptionOptions = ({ setSubscriptionStatus }: { setSubscriptionStatus: (status: string) => void }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);  // Track subscription status
  const navigate = useNavigate();

  const handleSubscription = (plan: string) => {
    setSelectedPlan(plan);

    // If the parent selects a plan other than the Free plan
    if (plan !== "Free") {
      // Proceed with subscription (for now, we just activate the subscription without real payment logic)
      setSubscriptionStatus("Active");  // Set status to Active after subscription

      // Simulate successful subscription
      alert(`You have successfully subscribed to the ${plan} plan!`);

      setIsSubscribed(true); // Update the subscription status
    } else {
      // Automatically activate the Free plan
      setSubscriptionStatus("Active (Free)");
      setIsSubscribed(true); // Update the subscription status

      alert("You are now subscribed to the Free plan!");
    }
  };

  // After subscription, redirect the parent to child registration page
  const handleRegisterChild = () => {
    if (!isSubscribed) {
      alert("You must subscribe first before registering a child.");
      return;
    }
    navigate("/registerChild"); // Redirect to the child registration page
  };

  return (
    <div className="subscription-container">
      <h2>Choose a Subscription Plan</h2>

      <div className="plans">
        <div className="plan" onClick={() => handleSubscription("Premium")}>
          <h3>One Child Plan</h3>
          <p>Full access to all subjects and competitions for one child</p>
          <button>Subscribe - $10/month</button>
        </div>

        <div className="plan" onClick={() => handleSubscription("School-Wide")}>
          <h3>School-Wide</h3>
          <p>Unlimited access for multiple students</p>
          <button>Subscribe - $50/month</button>
        </div>
      </div>

      {/* After subscribing, allow the user to register a child */}
      {isSubscribed && (
        <div>
          <button onClick={handleRegisterChild}>Register Child</button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionOptions;
