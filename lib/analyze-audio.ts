// This provides mock analysis data for the placeholder version

export function getMockAnalysisData(): any {
  // Return mock analysis results
  return {
    salesPerson: {
      name: "Alex Johnson",
      metrics: {
        talkTime: 62,
        interruptions: 3,
        questions: 8,
      },
    },
    customer: {
      name: "Sam Taylor",
      metrics: {
        talkTime: 38,
        questions: 4,
      },
    },
    sentiment: {
      overall: 68,
      timeline: [
        { time: "0:00", score: 50, speaker: "Alex" },
        { time: "1:00", score: 65, speaker: "Sam" },
        { time: "2:00", score: 45, speaker: "Alex" },
        { time: "3:00", score: 70, speaker: "Sam" },
        { time: "4:00", score: 60, speaker: "Alex" },
        { time: "5:00", score: 75, speaker: "Sam" },
        { time: "6:00", score: 80, speaker: "Alex" },
        { time: "7:00", score: 68, speaker: "Sam" },
      ],
      keywords: {
        positive: ["solution", "benefit", "value", "opportunity", "partnership", "understand"],
        negative: ["problem", "expensive", "difficult", "complicated", "unsure"],
      },
    },
    improvements: [
      "Reduce talk time by 15% to allow the customer more opportunity to express their needs",
      "Ask more open-ended questions to better understand customer requirements",
      "Avoid interrupting the customer, especially when they're expressing concerns",
      "Use more positive language when discussing product features",
      "Provide more concrete examples of how the product solves specific problems",
    ],
    details: {
      duration: "7:42",
      transcription: `[00:00] Alex: Good morning, Sam. Thanks for taking the time to chat with me today about our enterprise solution. How are you doing?

[00:08] Sam: I'm doing well, thanks. I've been looking forward to learning more about what you offer.

[00:15] Alex: Great! I'm excited to share how our platform can help streamline your operations. Before I dive in, could you tell me a bit about the challenges you're currently facing?

[00:28] Sam: Sure. We're struggling with our current system. It's slow, and we're having trouble getting the insights we need from our data. It's becoming a real problem for our team.

[00:42] Alex: I understand how frustrating that can be. Our solution is specifically designed to address those exact issues. Our platform processes data 3x faster than industry averages.

[00:56] Sam: That sounds promising, but I'm concerned about the implementation. How complicated is it to get started?

[01:05] Alex: That's a great question. Actually, our onboarding process is quite straightforward. We have a dedicated team that handles the entire setup, and most clients are up and running within a week.

[01:18] Sam: A week sounds reasonable. What about training? Our team isn't very technical.

[01:25] Alex: We provide comprehensive training as part of the package. Our interface is intuitive, and we've designed it with non-technical users in mind. We also offer ongoing support.

[01:38] Sam: That's helpful. Now, let's talk about pricing. I've heard your solution is on the expensive side.

[01:45] Alex: I understand budget considerations are important. While we're not the cheapest option, our clients typically see ROI within the first quarter due to efficiency gains. Would it be helpful if I shared some case studies?

[02:00] Sam: Yes, that would be very helpful. Especially if you have examples from our industry.

[02:08] Alex: I'll send those over right after our call. We actually worked with a company similar to yours last year, and they saw a 30% reduction in processing time and a 25% increase in actionable insights.

[02:22] Sam: Those are impressive numbers. What about scalability? We're planning to expand next year.

[02:30] Alex: Our platform is built to scale. You can easily add users and increase capacity as needed. There's no need to migrate to a different solution as you grow.

[02:42] Sam: That's good to know. I'm also curious about integration with our existing tools.

[02:50] Alex: We have APIs and pre-built integrations for most major business tools. Which specific systems are you currently using?

[03:00] Sam: We use Salesforce, Microsoft 365, and a custom CRM.

[03:08] Alex: Perfect! We have native integrations for both Salesforce and Microsoft 365. For your custom CRM, our team can work with your developers to ensure smooth data flow.

[03:20] Sam: That sounds promising. What kind of support do you offer after implementation?

[03:28] Alex: We provide 24/7 technical support via phone, email, and chat. You'll also have a dedicated account manager who checks in regularly to ensure everything is running smoothly.

[03:42] Sam: That's comprehensive. I appreciate the thorough explanation.

[03:48] Alex: You're welcome! Based on what we've discussed, I think our Enterprise Plus plan would be the best fit for your needs. It includes all the features we've talked about, plus advanced analytics.

[04:02] Sam: The Enterprise Plus plan sounds like it could work. Can you send me a detailed proposal?

[04:10] Alex: I'll put together a customized proposal and send it over by the end of day. Would you also like me to include those case studies we mentioned?

[04:22] Sam: Yes, please. And if possible, include information about the implementation timeline.

[04:30] Alex: I'll make sure to include all of that. Is there anything else you'd like me to address in the proposal?

[04:38] Sam: I think that covers everything for now. I'll review it with my team and get back to you with any questions.

[04:46] Alex: Sounds great, Sam. I really appreciate your time today. I'm confident our solution can address the challenges you're facing and provide significant value to your organization.

[05:00] Sam: Thanks for the presentation. I'm looking forward to reviewing the proposal.

[05:08] Alex: Perfect! I'll send that over shortly. In the meantime, feel free to reach out if any questions come up. Have a great rest of your day!

[05:18] Sam: You too, Alex. Goodbye.

[05:20] Alex: Goodbye, Sam.`,
    },
  }
}

// Keep this function for compatibility, but it's not used in the placeholder version
export async function analyzeAudio(file: File): Promise<any> {
  return getMockAnalysisData()
}
