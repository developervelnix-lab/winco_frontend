import React from 'react';

const ExclusionPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Self Exclusion</h2>
      
      <h3 className="text-xl font-semibold mb-2">What is a Self-Exclusion?</h3>
      <p className="mb-4">
        Self-exclusion is a facility that the Site offers to help those customers who feel that their gambling is out of control
        and want us to help them stop. By entering into a self-exclusion agreement with the Site, you will be prevented from using
        your Account (as defined in the terms and conditions) for a specific period, as determined by you, of between 6 months and 5 years.
      </p>
      
      <h3 className="text-xl font-semibold mb-2">How to self-exclude from the Site</h3>
      <p className="mb-4">
        If at any time you should wish to exclude yourself from use of the Site, you must submit this request by WhatsApp.
        Please inform us of the period for which you wish to self-exclude. The minimum is 6 months and the maximum is 5 years.
        If you request self-exclusion but do not specify a period, we will exclude you for the minimum period of six months.
      </p>
      
      <h3 className="text-xl font-semibold mb-2">How soon after requesting a self-exclusion will it be activated?</h3>
      <p className="mb-4">
        We will endeavour to apply your exclusion as soon as practically possible. Normally, we will be able to reset your
        password to prevent you from accessing the Site within 24 hours of your request.
      </p>
      
      <h3 className="text-xl font-semibold mb-2">What happens if I self-exclude?</h3>
      <ul className="list-disc pl-5 mb-4">
        <li>Prevent any marketing material being forwarded to you;</li>
        <li>Remove you from any marketing databases operated by us;</li>
        <li>Suspend your activity by cancelling your ability to access the Site for the requested period;</li>
        <li>Permanently close your Customer Account if instructed to do so, and return all funds owed to you.</li>
      </ul>
      
      <h3 className="text-xl font-semibold mb-2">Can I re-activate my Account or open a new Account during the self-exclusion period?</h3>
      <p className="mb-4">
        Accounts that have been self-excluded cannot be reactivated under any circumstances until the expiry of the self-exclusion period.
        During this period, you must not attempt to re-open any existing Account(s), seek to open any new Accounts, or place bets through any other customer’s Account.
      </p>
      
      <h3 className="text-xl font-semibold mb-2">If I would like to re-activate my Account, is this possible?</h3>
      <p>
        At the end of the self-exclusion period, you must contact us in person and confirm such intention in writing.
        If it is decided (in the Site’s absolute discretion) to permit you to re-open your Account/open a new Account,
        you should be aware that a 24-hour waiting period will be imposed before the Account is available for use.
      </p>
    </div>
  );
};

export default ExclusionPolicy;
