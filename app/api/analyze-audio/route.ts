import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';
import OpenAI from 'openai';
import { Buffer, File } from 'node:buffer';

// Initialize APIs with type safety
const assemblyAiKey = process.env.ASSEMBLYAI_API_KEY || '';
const openaiKey = process.env.OPENAI_API_KEY || '';

if (!assemblyAiKey) {
  console.error('Warning: ASSEMBLYAI_API_KEY environment variable is not set');
}

if (!openaiKey) {
  console.error('Warning: OPENAI_API_KEY environment variable is not set');
}

const assemblyai = new AssemblyAI({
  apiKey: assemblyAiKey
});

const openai = new OpenAI({
  apiKey: openaiKey
});

// Helper function to calculate talk time from diarization
function calculateTalkTime(utterances: any[]) {
  const speakerTime: Record<string, number> = {};
  
  utterances.forEach(utterance => {
    const speaker = utterance.speaker;
    const duration = utterance.end - utterance.start;
    
    if (!speakerTime[speaker]) {
      speakerTime[speaker] = 0;
    }
    speakerTime[speaker] += duration;
  });
  
  const totalTime = Object.values(speakerTime).reduce((sum, time) => sum + time, 0);
  
  return Object.entries(speakerTime).reduce((acc: Record<string, any>, [speaker, time]) => {
    acc[speaker] = {
      duration: time,
      percentage: Math.round((time / totalTime) * 100)
    };
    return acc;
  }, {});
}

// Helper function to count speaker metrics
function calculateSpeakerMetrics(utterances: any[]) {
  const metrics: Record<string, any> = {};
  
  utterances.forEach(utterance => {
    const speaker = utterance.speaker;
    
    if (!metrics[speaker]) {
      metrics[speaker] = {
        utterances: 0,
        questions: 0,
        interruptions: 0
      };
    }
    
    metrics[speaker].utterances++;
    
    if (utterance.text.includes('?')) {
      metrics[speaker].questions++;
    }
  });
  
  for (let i = 1; i < utterances.length; i++) {
    const current = utterances[i];
    const previous = utterances[i - 1];
    
    if (current.speaker !== previous.speaker && current.start < previous.end) {
      metrics[current.speaker].interruptions++;
    }
  }
  
  return metrics;
}

// Process Audio function implementing the provided code
async function processAudio(audioUrl: string) {
  try {
    console.log("Starting transcription...");
    console.log('Using audio URL for transcription:', audioUrl);
    
    // Request transcription with diarization + sentiment
    const transcriptConfig = {
      audio_url: audioUrl,
      speaker_labels: true,
      sentiment_analysis: true,
      language_code: "en"  // Hinglish is recognized under "en"
    };
    
    // Start transcription
    const transcript = await assemblyai.transcripts.transcribe(transcriptConfig);
    
    // Use the full transcript for analysis
    const fullTranscript = transcript.text || '';
    const sentimentResults = transcript.sentiment_analysis_results || [];
    const utterances = transcript.utterances || [];
    
    // Separate agent/buyer time calculation
    const speakerDurations: Record<string, number> = {};
    for (const utterance of utterances) {
      const speaker = utterance.speaker;
      const duration = utterance.end - utterance.start;
      speakerDurations[speaker] = (speakerDurations[speaker] || 0) + duration;
    }
    
    // Normalize speaker labels
    const speakers = Object.keys(speakerDurations);
    const agent = speakers[0] || 'A';
    const buyer = speakers.length > 1 ? speakers[1] : 'B';
    
    const totalTime = Object.values(speakerDurations).reduce((a, b) => a + b, 0);
    const agentPct = ((speakerDurations[agent] || 0) / totalTime) * 100;
    const buyerPct = ((speakerDurations[buyer] || 0) / totalTime) * 100;
    
    // Send to GPT for buyer sentiment and conversion likelihood analysis
    const gptAnalysis = await analyzeWithGpt(fullTranscript);
    
    return {
      transcript_text: fullTranscript,
      gpt_analysis: gptAnalysis,
      talk_ratio: {
        agent: `${agentPct.toFixed(2)}%`,
        buyer: `${buyerPct.toFixed(2)}%`
      },
      speaker_sentiments: sentimentResults,
      utterances: utterances
    };
  } catch (error) {
    console.error('Error in process audio:', error);
    throw error;
  }
}

// Helper function to analyze with GPT
async function analyzeWithGpt(transcriptText: string) {  const safeTranscriptText = transcriptText || 'No transcript available';
  const prompt = `
You are analyzing a call between a real estate agent and a buyer. Below is the transcript.
Your tasks:
1. Describe the buyer's sentiment (positive, neutral, negative).
2. Estimate the likelihood of conversion (low, medium, high).
Transcript:
${safeTranscriptText}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    return response?.choices?.[0]?.message?.content?.trim();
  } catch (error) {
    console.error('Error analyzing with GPT:', error);
    return "Analysis failed. Unable to determine buyer sentiment and conversion likelihood.";
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as unknown as File;
    
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No valid audio file provided' },
        { status: 400 }
      );
    }
    
    // Log file metadata to help with debugging
    console.log('Audio file received:', {
      type: file.type,
      size: file.size
    });

    // Convert Blob to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload the audio buffer directly to AssemblyAI
    console.log('Uploading file to AssemblyAI');
    
    // Use the upload method from the library
    let uploadResponse;
    try {
      // Use the TypeScript any type to bypass TypeScript errors
      const assemblyAiAny = assemblyai as any;
      
      if (assemblyAiAny.files && typeof assemblyAiAny.files.upload === 'function') {
        // Create a File object from the buffer
        const audioBlob = new Blob([buffer], { type: file.type });
        const audioFile = new File([buffer], file.name, { type: file.type });
        uploadResponse = await assemblyAiAny.files.upload(audioFile);
      } else if (typeof assemblyAiAny.upload === 'function') {
        // Try direct upload method
        uploadResponse = await assemblyAiAny.upload(buffer, { fileName: file.name });
      } else {
        throw new Error('No upload method available in AssemblyAI SDK');
      }
      
      console.log('Upload completed, response:', uploadResponse);
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload audio file');
    }    // Extract the audio URL from the upload response
    let audioUrl = '';
    
    if (typeof uploadResponse === 'string') {
      audioUrl = uploadResponse;
    } else if (uploadResponse && typeof uploadResponse === 'object') {
      if (uploadResponse.url) {
        audioUrl = uploadResponse.url;
      } else if (uploadResponse.audio_url) {
        audioUrl = uploadResponse.audio_url;
      } else if (uploadResponse.audioUrl) {
        audioUrl = uploadResponse.audioUrl;
      }
    }
    
    if (!audioUrl) {
      console.error('Invalid upload response format:', uploadResponse);
      throw new Error('Could not extract audio URL from upload response');
    }
    
    console.log('Using audio URL:', audioUrl);
    
    // Use our processAudio function to analyze the audio
    const audioAnalysis = await processAudio(audioUrl);
      // Extract data from audio analysis with null safety
    const fullTranscript = audioAnalysis?.transcript_text || '';
    const utterances = audioAnalysis?.utterances || [];
    const sentimentResults = audioAnalysis?.speaker_sentiments || [];
    const gptAnalysis = audioAnalysis?.gpt_analysis || 'No analysis available';
    const talkRatio = audioAnalysis?.talk_ratio || { agent: '0%', buyer: '0%' };
    
    // Calculate speaker metrics
    const speakerMetrics = calculateSpeakerMetrics(utterances);
    const talkTime = calculateTalkTime(utterances);
    
    // Identify agent and buyer
    const speakers = Object.keys(speakerMetrics);
    const agentLabel = speakers[0] || 'A';
    const buyerLabel = speakers[1] || 'B';
    
    const agentMetrics = speakerMetrics[agentLabel] || { utterances: 0, questions: 0, interruptions: 0 };
    const buyerMetrics = speakerMetrics[buyerLabel] || { utterances: 0, questions: 0, interruptions: 0 };
    const agentTalkTime = talkTime[agentLabel]?.percentage || 0;
    const buyerTalkTime = talkTime[buyerLabel]?.percentage || 0;
    
    // Process sentiment timeline
    const sentimentTimeline = sentimentResults.map((item: any, index: number) => ({
      time: `${Math.floor(index * 30 / 60)}:${String(Math.floor(index * 30 % 60)).padStart(2, '0')}`,
      score: item.sentiment === 'POSITIVE' ? 80 : 
             item.sentiment === 'NEUTRAL' ? 50 : 20,
      speaker: utterances.find((u: any) => 
        u.start <= item.start && u.end >= item.end
      )?.speaker || agentLabel
    }));

    // Extract sentiment keywords
    const positiveKeywords = sentimentResults
      .filter((s: any) => s.sentiment === 'POSITIVE')
      .map((s: any) => s.text.split(' ').slice(0, 3).join(' '))
      .slice(0, 5);
    
    const negativeKeywords = sentimentResults
      .filter((s: any) => s.sentiment === 'NEGATIVE')
      .map((s: any) => s.text.split(' ').slice(0, 3).join(' '))
      .slice(0, 5);

    // Extract information from GPT analysis
    const conversionLikelihood = gptAnalysis.includes('high') ? 'high' : 
                                gptAnalysis.includes('medium') ? 'medium' : 'low';
    
    const buyerSentiment = gptAnalysis.includes('positive') ? 'positive' : 
                          gptAnalysis.includes('neutral') ? 'neutral' : 'negative';
    
    // Format response with the combined data
    const results = {
      svAgent: {
        name: "Agent",
        metrics: {
          talkTime: agentTalkTime,
          talkPercentage: talkRatio.agent,
          interruptions: agentMetrics.interruptions,
          questions: agentMetrics.questions
        }
      },
      buyer: {
        name: "Buyer",
        metrics: {
          talkTime: buyerTalkTime,
          talkPercentage: talkRatio.buyer,
          questions: buyerMetrics.questions
        },
        sentiment: buyerSentiment,
        requirements: {
          budget: "Not specified",
          location: "Not specified",
          size: "Not specified",
          features: [],
          preferences: []
        }
      },
      sentiment: {
        overall: sentimentResults.length > 0 ? 
          Math.round(sentimentResults.reduce((sum: number, s: any) => 
            sum + (s.sentiment === 'POSITIVE' ? 80 : s.sentiment === 'NEUTRAL' ? 50 : 20), 0
          ) / sentimentResults.length) : 50,
        timeline: sentimentTimeline,
        keywords: {
          positive: positiveKeywords,
          negative: negativeKeywords
        }
      },
      conversion: {
        likelihood: conversionLikelihood === 'high' ? 80 : conversionLikelihood === 'medium' ? 50 : 30,
        assessment: gptAnalysis
      },
      improvements: [
        "Ensure appropriate talk time balance with buyer",
        "Ask more open-ended questions to understand requirements better",
        "Provide specific property details and benefits",
        "Follow up with concrete next steps"
      ],
      details: {
        duration: `${Math.floor((utterances[utterances.length - 1]?.end || 0) / 1000 / 60)}:${String(Math.floor((utterances[utterances.length - 1]?.end || 0) / 1000 % 60)).padStart(2, '0')}`,
        transcription: fullTranscript
      }
    };

    return NextResponse.json(results);  } catch (error) {
    // More detailed error logging and response
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: errorMessage },
      { status: 500 }
    );
  }
}
