import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || ''
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload the audio file
    const uploadResponse = await client.upload(buffer, {
      fileName: file.name
    });

    // Create transcription config
    const transcriptionConfig = {
      audio_url: uploadResponse.audioUrl,
      speaker_labels: true,
      sentiment_analysis: true,
      auto_chapters: true
    };

    // Start transcription
    const transcript = await client.transcripts.transcribe(transcriptionConfig);
    
    // Process results into the expected format
    const results = {
      svAgent: {
        name: "SV Agent",
        metrics: {
          talkTime: calculateTalkTime(transcript.utterances || [], 'A'),
          interruptions: calculateInterruptions(transcript.utterances || []),
          questions: countQuestions(transcript.utterances || [], 'A')
        }
      },
      buyer: {
        name: "Buyer",
        metrics: {
          talkTime: calculateTalkTime(transcript.utterances || [], 'B'),
          questions: countQuestions(transcript.utterances || [], 'B')
        },
        requirements: extractRequirements(transcript.entities || [], transcript.text || '')
      },
      sentiment: {
        overall: calculateOverallSentiment(transcript.sentiment_analysis_results || []),
        timeline: createSentimentTimeline(transcript.sentiment_analysis_results || [], transcript.utterances || []),
        keywords: extractKeywords(transcript.sentiment_analysis_results || [])
      },
      improvements: generateImprovements(transcript),
      details: {
        duration: formatDuration(transcript.audio_duration || 0),
        transcription: transcript.text || '',
      }
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateTalkTime(utterances: any[], speaker: string): number {
  const speakerUtterances = utterances.filter(u => u.speaker === speaker);
  const totalDuration = utterances.reduce((sum, u) => sum + (u.end - u.start), 0);
  const speakerDuration = speakerUtterances.reduce((sum, u) => sum + (u.end - u.start), 0);
  return Math.round((speakerDuration / totalDuration) * 100);
}

function calculateInterruptions(utterances: any[]): number {
  let interruptions = 0;
  for (let i = 1; i < utterances.length; i++) {
    if (utterances[i].speaker !== utterances[i-1].speaker && 
        utterances[i].start < utterances[i-1].end) {
      interruptions++;
    }
  }
  return interruptions;
}

function countQuestions(utterances: any[], speaker: string): number {
  return utterances.filter(u => 
    u.speaker === speaker && u.text.includes('?')
  ).length;
}

function extractRequirements(entities: any[], text: string): any {
  // Simple extraction logic - in a real app, you might want to use NLP
  return {
    budget: "Not specified",
    location: "Not specified",
    size: "Not specified",
    features: [],
    preferences: []
  };
}

function calculateOverallSentiment(results: any[]): number {
  if (results.length === 0) return 50;
  const scores = results.map(r => 
    r.sentiment === 'POSITIVE' ? 80 : 
    r.sentiment === 'NEUTRAL' ? 50 : 20
  );
  return Math.round(scores.reduce((a, b) => a + b) / scores.length);
}

function createSentimentTimeline(sentimentResults: any[], utterances: any[]): any[] {
  return sentimentResults.map((result, index) => ({
    time: formatDuration(result.start),
    score: result.sentiment === 'POSITIVE' ? 80 :
           result.sentiment === 'NEUTRAL' ? 50 : 20,
    speaker: findSpeaker(result.start, utterances)
  }));
}

function findSpeaker(time: number, utterances: any[]): string {
  const utterance = utterances.find(u => time >= u.start && time <= u.end);
  return utterance?.speaker || 'A';
}

function extractKeywords(results: any[]): any {
  const positive = results
    .filter(r => r.sentiment === 'POSITIVE')
    .map(r => r.text.split(' ').slice(0, 3).join(' '))
    .slice(0, 5);
    
  const negative = results
    .filter(r => r.sentiment === 'NEGATIVE')
    .map(r => r.text.split(' ').slice(0, 3).join(' '))
    .slice(0, 5);
    
  return { positive, negative };
}

function generateImprovements(transcript: any): string[] {
  return [
    "Reduce talk time to allow more buyer input",
    "Ask more open-ended questions",
    "Avoid interrupting the buyer",
    "Provide more specific property details",
    "Follow up with concrete next steps"
  ];
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}