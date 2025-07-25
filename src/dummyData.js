const ActiveUsers = [
    { month: "Jan", activeUsers: 250 },
    { month: "Feb", activeUsers: 600 },
    { month: "March", activeUsers: 2000 },
    { month: "April", activeUsers: 5000 },
  ];
 export const dummydata = [
    { timestamp: "2025-03-26T08:00:00", messageCount: 15 },
    { timestamp: "2025-05-26T09:00:00", messageCount: 30 },
    { timestamp: "2025-07-26T10:00:00", messageCount: 45 },
    { timestamp: "2025-03-26T11:00:00", messageCount: 20 },
    { timestamp: "2025-09-26T12:00:00", messageCount: 55 },
    { timestamp: "2025-03-26T13:00:00", messageCount: 40 }
  ];

export const lineData = [
  // Today's data (assuming today's date is 2025-04-03)
  {
    timestamp: "2025-04-03T10:05:00Z",
    messageIndex: 1,
    sender: "User10",
    receiver: "User20",
    message: "Good morning, team!"
  },
  {
    timestamp: "2025-04-03T10:25:00Z",
    messageIndex: 2,
    sender: "User21",
    receiver: "User22",
    message: "Let's sync up in 10 minutes."
  },

  // Data from previous days
  {
    timestamp: "2025-04-02T14:20:00Z",
    messageIndex: 3,
    sender: "User30",
    receiver: "User31",
    message: "Did you complete the report?"
  },
  {
    timestamp: "2025-04-01T18:45:00Z",
    messageIndex: 4,
    sender: "User40",
    receiver: "User41",
    message: "Let's catch up later today."
  },
  {
    timestamp: "2025-03-30T16:30:00Z",
    messageIndex: 5,
    sender: "User50",
    receiver: "User51",
    message: "How was your day?"
  }
];

  
  // For brevity, here we show the first 50 objects. In your test file, you’d include all 300 objects.
  
  export const pieDAta = [
    { name: "Alice", totalMessages: 100, sent: 40, received: 60 },
    { name: "Bob", totalMessages: 80, sent: 30, received: 50 },
    { name: "Carol", totalMessages: 70, sent: 40, received: 30 },
    { name: "Dave", totalMessages: 120, sent: 70, received: 50 },
    { name: "Eve", totalMessages: 90, sent: 35, received: 55 },
    { name: "Frank", totalMessages: 110, sent: 60, received: 50 },
    { name: "Grace", totalMessages: 95, sent: 45, received: 50 },
    { name: "Hank", totalMessages: 85, sent: 40, received: 45 },
    { name: "Ivy", totalMessages: 75, sent: 30, received: 45 },
    { name: "Jack", totalMessages: 130, sent: 70, received: 60 },
    { name: "Kathy", totalMessages: 105, sent: 50, received: 55 },
    { name: "Leo", totalMessages: 115, sent: 60, received: 55 },
    { name: "Mona", totalMessages: 90, sent: 40, received: 50 },
    { name: "Nate", totalMessages: 80, sent: 35, received: 45 },
    { name: "Olivia", totalMessages: 100, sent: 50, received: 50 },
    { name: "Paul", totalMessages: 95, sent: 40, received: 55 },
    { name: "Quincy", totalMessages: 85, sent: 30, received: 55 },
    { name: "Rachel", totalMessages: 125, sent: 65, received: 60 },
    { name: "Steve", totalMessages: 110, sent: 55, received: 55 },
    { name: "Tina", totalMessages: 90, sent: 45, received: 45 },
    { name: "Uma", totalMessages: 80, sent: 35, received: 45 },
    { name: "Victor", totalMessages: 120, sent: 65, received: 55 },
    { name: "Wendy", totalMessages: 105, sent: 50, received: 55 },
    { name: "Xander", totalMessages: 100, sent: 50, received: 50 },
    { name: "Yvonne", totalMessages: 115, sent: 60, received: 55 },
    { name: "Zack", totalMessages: 85, sent: 40, received: 45 },
    { name: "Aaron", totalMessages: 95, sent: 45, received: 50 },
    { name: "Bella", totalMessages: 110, sent: 55, received: 55 },
    { name: "Cody", totalMessages: 100, sent: 40, received: 60 },
    { name: "Diana", totalMessages: 90, sent: 45, received: 45 }
  ];
  




let formattedData = (data)=>{
  return new Date(data).getHours() + ":00"
}

export let Data = dummydata.map((item)=>{
  return {
    ...item,timestamp : formattedData(item.timestamp)
  }
})

  export default ActiveUsers;
  