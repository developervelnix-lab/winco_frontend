import React from 'react';

const ResponsibleGambling = () => {
  return (
    <div className="bg-white p-6 rounded-md shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Responsible Gambling</h2>
      <p className="text-gray-700 mb-4">
        The Site is committed to Responsible Gambling and we take our responsibilities towards our customers very seriously.
        We aim to provide an environment in which you can bet in a safe, fair, and above all responsible manner. If you feel
        you may have a problem when it comes to controlling your gambling, please consider using one of our tools aimed at
        helping this:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>By selecting a deposit limit per day, week, or month.</li>
        <li>
          By using our “time out” facility to allow you to suspend your account activity for the following durations - 24
          hours, one week, one month, or any other period as you may reasonably request up to a maximum of 6 weeks.
        </li>
        <li>
          Opting for a self-exclusion, the minimum period being six months, which means your account will be blocked for a set
          amount of time. Self-exclusions cannot be undone and may only be unlocked by contacting customer services when the
          self-exclusion time runs out.
        </li>
      </ul>
    </div>
  );
};

export default ResponsibleGambling;
