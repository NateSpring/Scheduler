import React from "react";

function ThemedSuspense() {
  let quoteBank = [
    {
      quote: "Having no problems is the biggest problem of all.",
      author: "Taiicho Ohno",
    },
    {
      quote: "Everything can be improved.",
      author: "Clarence W. Barron",
    },
    {
      quote: "You have to start to be great at something.",
      author: "Zig Ziglar",
    },
    {
      quote:
        "If you are not willing ot learn, no one can help you. If you are determined to learn, no one can stop you.",
      author: "Zig Ziglar",
    },
    {
      quote:
        "The more clearly you understand a system, the more impactful your changes become.",
      author: "Étan Gnirps",
    },
    {
      quote: "Continuous imporvement is better than delayed perfection.",
      author: "Mark Twain",
    },
  ];

  let randomQuote = () => {
    let min = 0;
    let max = quoteBank.length;
    return quoteBank[Math.floor(Math.random() * (max - min) + min)];
  };

  return (
    <div className="w-full h-screen p-6 text-lg font-medium text-gray-600 dark:text-gray-400 dark:bg-gray-900">
      <div className="flex flex-col">
        <h2 className="text-4xl mb-10">
          <span className="text-7xl">"</span>
          {randomQuote().quote}
          <span className="text-7xl">"</span>
        </h2>
        <h3 className="text-xl font-bold italic">-{randomQuote().author}</h3>
      </div>
    </div>
  );
}

export default ThemedSuspense;
