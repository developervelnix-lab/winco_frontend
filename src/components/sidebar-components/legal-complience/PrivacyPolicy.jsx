import Navbar from "@/components/navbar/Navbar";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <>
    
     <Navbar/>


  

    <div className="p-6 max-w-4xl mt-[112px] mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        We are the flagship brand of <strong>winbuzz360.com</strong>, offering Our Services to You, wherein You can also participate in various Contests hosted on Our Platform. Any person utilizing the Platform or any of its features, including participation in various Contests, shall be bound by the terms of this Privacy Policy.
      </p>
      <p className="mb-4">
        We respect the privacy of our Users and are committed to protecting it. To offer an enriching and holistic internet experience, we collect user information as follows:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Information supplied by Users.</li>
        <li>Information automatically tracked during navigation.</li>
      </ul>
      <p className="mb-4">
        By using any part of the Platform, You consent to the collection, use, disclosure, and transfer of Your information for the purposes outlined in this Privacy Policy.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Purpose and Usage</h2>
      <p className="mb-4">
        To avail certain features on the Platform, Users may be required to provide the following information:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Username</li>
        <li>Email Address</li>
        <li>Date Of Birth</li>
        <li>State</li>
        <li>Government ID (Aadhaar card, driving license, or voter ID)</li>
      </ul>
      <p className="mb-4">
        Additionally, we may collect information related to your device, operating system, network, and location for enhancing our services.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Disclosure & Sharing</h2>
      <p className="mb-4">
        We may share your information with our affiliates, group entities, or third-party service providers for data analytics, storage, and improving our services. However, we take necessary measures to ensure your data is protected.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Use of Cookies</h2>
      <p className="mb-4">
        We use cookies and similar electronic tools to collect information for a better user experience. Cookies help us understand user preferences and improve our services accordingly.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Security</h2>
      <p className="mb-4">
        All gathered information is securely stored in a controlled database, with restricted access. However, while we implement robust security measures, no system is entirely impenetrable.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Data Retention & Account Deletion</h2>
      <p className="mb-4">
        Your personal information will be retained only as long as necessary for legitimate business purposes or legal requirements. You may request account and data deletion by contacting our support team.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p className="mb-4">
        If you have any queries regarding this Privacy Policy, feel free to contact us at the details provided in the footer.
      </p>
    </div>

    </>
  );
};

export default PrivacyPolicy;
