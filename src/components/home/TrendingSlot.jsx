import React from "react";

const QuickLinks = () => {
  const quickLinks = [
    { name: "Loyalty Hub", img: "https://images.ubo-cms.com/cdn-cgi/image/format=auto,width=32,height=32,dpr=2/cms/3d6bd6ce-5e79-4ff5-84b9-e55a266e7722" },
    { name: "Promotions", img: "https://images.ubo-cms.com/cdn-cgi/image/format=auto,width=32,height=32,dpr=2/cms/b8425b6f-b506-4481-afb2-0ac18ac2ce57" },
    { name: "All Live", img: "https://images.ubo-cms.com/cdn-cgi/image/format=auto,width=32,height=32,dpr=2/cms/d30b85da-47da-4ece-be32-e0fc7eb1af0b" },
    { name: "IPL", img: "https://images.ubo-cms.com/cdn-cgi/image/format=auto,width=32,height=32,dpr=2/cms/50d52bfe-2689-4dc4-9385-76022440af2e" },
    { name: "EPL", img: "https://images.ubo-cms.com/cdn-cgi/image/format=auto,width=32,height=32,dpr=2/cms/c00dc7de-ddfd-41a3-b9dc-bbb479c238e9" },
    { name: "Virtual Penalty", img: "https://images.ubo-cms.com/cdn-cgi/image/format=auto,width=32,height=32,dpr=2/cms/ce07b340-7627-48a1-8c1e-d907537fd5ee" },
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-300">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800 uppercase tracking-wide">
        Quick Access
      </h2>

      {/* Small white boxes evenly spread */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {quickLinks.map((link, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-md p-3 flex flex-col items-center shadow-sm hover:shadow-md transition"
          >
            <img
              src={link.img}
              alt={link.name}
              className="w-8 h-8 border border-gray-400 rounded-full mb-2"
            />
            <p className="text-xs text-gray-700 text-center">{link.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
