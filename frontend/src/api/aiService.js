const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

export const generateSongRecommendations = async (userInput) => {
  if (!userInput || userInput.trim().length < 10) {
    throw new Error('Please provide at least 10 characters');
  }

  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not found. Please set VITE_GROQ_API_KEY in your .env file. Get your free key at: https://console.groq.com/');
  }

  const prompt = `You are a music recommendation expert. Based on this user request: "${userInput}"

Generate 15-20 song search queries (song titles and artists) that match the mood, genre, or vibe described. 
Return ONLY a JSON array of strings, each string being a song search query (e.g., "Shape of You Ed Sheeran" or "Blinding Lights The Weeknd").
Focus on popular songs that would be available on music streaming platforms, especially Indian music (Hindi, Punjabi, etc.) and international hits.

Example format: ["Song Title Artist Name", "Another Song Another Artist"]

Return only the JSON array, no other text:`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful music recommendation assistant. Always return valid JSON arrays only, no explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error('No response from AI service');
    }

    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
      try {
        const songs = JSON.parse(jsonMatch[0]);
        if (Array.isArray(songs) && songs.length > 0) {
          return songs.filter(song => typeof song === 'string' && song.trim().length > 0);
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
      }
    }
    
    try {
      const songs = JSON.parse(content);
      if (Array.isArray(songs)) {
        return songs.filter(song => typeof song === 'string' && song.trim().length > 0);
      }
    } catch {
      const fallbackSongs = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//') && !line.startsWith('/*'))
        .map(line => line.replace(/[\[\]"]/g, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 20);
      
      if (fallbackSongs.length > 0) {
        return fallbackSongs;
      }
    }
    
    throw new Error('Could not parse song recommendations from AI response');
  } catch (error) {
    console.error('AI generation error:', error);
    if (error.message.includes('API key')) {
      throw error;
    }
    throw new Error('Failed to generate playlist. Please try again.');
  }
};

