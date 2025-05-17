// This provides mock analysis data for the placeholder version

export function getMockAnalysisData(): any {
  // Return mock analysis results
  return {
    svAgent: {
      name: "Alex Johnson",
      metrics: {
        talkTime: 62,
        interruptions: 3,
        questions: 8,
      },
    },
    buyer: {
      name: "Sam Taylor",
      metrics: {
        talkTime: 38,
        questions: 4,
      },
      requirements: {
        budget: "$500,000 - $750,000",
        location: "Downtown Area",
        size: "1,500 - 2,000 sq ft",
        features: [
          "Modern Kitchen",
          "2+ Bathrooms",
          "Parking Space",
          "Security System"
        ],
        preferences: [
          "Near Public Transport",
          "Quiet Neighborhood",
          "Good Natural Light",
          "Storage Space",
          "Community Amenities"
        ]
      }
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
      "Reduce talk time by 15% to allow the buyer more opportunity to express their needs",
      "Ask more open-ended questions to better understand buyer requirements",
      "Avoid interrupting the buyer, especially when they're expressing concerns",
      "Use more positive language when discussing property features",
      "Provide more concrete examples of how properties match buyer preferences",
    ],
    details: {
      duration: "7:42",
      transcription: `[00:00] Alex: Good morning, Sam. Thanks for taking the time to chat with me today about properties in your desired area. How are you doing?

[00:08] Sam: I'm doing well, thanks. I've been looking forward to finding the right property.

[00:15] Alex: Great! Before we look at specific properties, could you tell me about what you're looking for?

[00:28] Sam: Sure. I'm looking for something in the downtown area, preferably 1,500 to 2,000 square feet. My budget is between $500,000 and $750,000.

[00:42] Alex: I understand. The downtown area has some great properties in that range. What specific features are most important to you?

[00:56] Sam: I definitely need a modern kitchen and at least two bathrooms. Parking is a must, and I'd really like a good security system.

[01:05] Alex: Those are all reasonable requirements. What about location preferences within downtown?

[01:18] Sam: I'd like to be near public transport if possible, and I prefer a quieter neighborhood. Good natural light is important to me too.

[01:25] Alex: I see. And what about community amenities?

[01:38] Sam: Yes, those would be nice to have. Also, adequate storage space is important to me.

[01:45] Alex: Perfect. I have several properties that match these criteria. Let me tell you about them...

[Rest of transcription continues...]`,
    },
  }
}

// Keep this function for compatibility, but it's not used in the placeholder version
export async function analyzeAudio(file: File): Promise<any> {
  return getMockAnalysisData()
}