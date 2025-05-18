import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';
import OpenAI from 'openai';

// Initialize APIs
const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || ''
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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

// Helper function to analyze conversion likelihood
async function analyzeConversionLikelihood(transcript: string) {
  const prompt = `
Analyze this conversation between a Magicbricks SV agent and a buyer. Assess the likelihood of conversion (buyer booking a site visit or showing strong interest).

Conversation:
${transcript}

Consider:
1. Buyer engagement level
2. Questions about property details
3. Discussion about site visits
4. Date/time scheduling attempts
5. Address confirmation for cab booking
6. Overall sentiment and interest

Return ONLY a JSON object:
{
  "likelihood": number (0-100),
  "confidence": "high/medium/low",
  "key_indicators": ["list", "of", "positive", "signals"],
  "concerns": ["list", "of", "potential", "objections"],
  "next_steps": ["recommended", "actions"],
  "stage": "initial_inquiry/requirements_gathering/property_discussion/site_visit_scheduling/conversion"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 600
    });

    const content = response.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {
      likelihood: 50,
      confidence: "medium",
      key_indicators: [],
      concerns: [],
      next_steps: [],
      stage: "initial_inquiry"
    };
  } catch (error) {
    console.error('Error analyzing conversion:', error);
    return {
      likelihood: 50,
      confidence: "medium",
      key_indicators: [],
      concerns: [],
      next_steps: [],
      stage: "initial_inquiry"
    };
  }
}

// Helper function to analyze project pitching
async function analyzeProjectPitching(transcript: string, projects: any[] = []) {
  const prompt = `
Analyze this conversation between a Magicbricks SV agent and a buyer. Determine if the agent is pitching SV projects and identify mentioned projects.

Conversation:
${transcript}

Available Projects:
${projects.map(p => `${p.name} (${p.category}): ${p.description || 'No description'}`).join('\n')}

Return ONLY a JSON object:
{
  "is_pitching_multiple": boolean,
  "mentioned_projects": ["list", "of", "project", "names"],
  "cross_selling_effectiveness": number (0-100),
  "clone_projects_mentioned": boolean,
  "pitch_quality": "excellent/good/average/poor",
  "recommendations": ["suggestions", "for", "improvement"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 500
    });

    const content = response.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {
      is_pitching_multiple: false,
      mentioned_projects: [],
      cross_selling_effectiveness: 50,
      clone_projects_mentioned: false,
      pitch_quality: "average",
      recommendations: []
    };
  } catch (error) {
    console.error('Error analyzing project pitching:', error);
    return {
      is_pitching_multiple: false,
      mentioned_projects: [],
      cross_selling_effectiveness: 50,
      clone_projects_mentioned: false,
      pitch_quality: "average",
      recommendations: []
    };
  }
}

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
    
    // Upload the audio file to AssemblyAI
    const uploadResponse = await assemblyai.upload(buffer, {
      fileName: file.name
    });

    // Create transcription config
    const transcriptionConfig = {
      audio_url: uploadResponse.audioUrl,
      language_code: 'hi', // Hindi/Hinglish support
      speaker_labels: true,
      speakers_expected: 2,
      sentiment_analysis: true,
      auto_highlights: true
    };

    // Start transcription
    const transcript = await assemblyai.transcripts.transcribe(transcriptionConfig);
    
    // Process transcript data
    const fullTranscript = transcript.text || '';
    const utterances = transcript.utterances || [];
    const sentimentResults = transcript.sentiment_analysis_results || [];
    
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

    // Parallel processing with GPT-4
    const [conversionData, projectData] = await Promise.all([
      analyzeConversionLikelihood(fullTranscript),
      analyzeProjectPitching(fullTranscript)
    ]);

    // Process sentiment timeline
    const sentimentTimeline = sentimentResults.map((item, index) => ({
      time: `${Math.floor(index * 30 / 60)}:${String(Math.floor(index * 30 % 60)).padStart(2, '0')}`,
      score: item.sentiment === 'POSITIVE' ? 80 : 
             item.sentiment === 'NEUTRAL' ? 50 : 20,
      speaker: utterances.find(u => 
        u.start <= item.start && u.end >= item.end
      )?.speaker || agentLabel
    }));

    // Extract sentiment keywords
    const positiveKeywords = sentimentResults
      .filter(s => s.sentiment === 'POSITIVE')
      .map(s => s.text.split(' ').slice(0, 3).join(' '))
      .slice(0, 5);
    
    const negativeKeywords = sentimentResults
      .filter(s => s.sentiment === 'NEGATIVE')
      .map(s => s.text.split(' ').slice(0, 3).join(' '))
      .slice(0, 5);

    // Format response
    const results = {
      svAgent: {
        name: "SV Agent",
        metrics: {
          talkTime: agentTalkTime,
          interruptions: agentMetrics.interruptions,
          questions: agentMetrics.questions
        }
      },
      buyer: {
        name: "Buyer",
        metrics: {
          talkTime: buyerTalkTime,
          questions: buyerMetrics.questions
        },
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
          Math.round(sentimentResults.reduce((sum, s) => 
            sum + (s.sentiment === 'POSITIVE' ? 80 : s.sentiment === 'NEUTRAL' ? 50 : 20), 0
          ) / sentimentResults.length) : 50,
        timeline: sentimentTimeline,
        keywords: {
          positive: positiveKeywords,
          negative: negativeKeywords
        }
      },
      conversion: conversionData,
      projects: projectData,
      improvements: [
        "Reduce talk time to allow buyer more opportunity to express needs",
        "Ask more open-ended questions to understand requirements better",
        "Avoid interrupting the buyer during important discussions",
        "Provide more specific property details and benefits",
        "Follow up with concrete next steps"
      ],
      details: {
        duration: `${Math.floor(transcript.audio_duration / 60)}:${String(Math.floor(transcript.audio_duration % 60)).padStart(2, '0')}`,
        transcription: fullTranscript
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