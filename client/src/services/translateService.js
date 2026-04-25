/**
 * Dynamic Translation Service using Google Translate API (Unofficial)
 * Optimized to preserve Markdown formatting and provide authentic Thanglish transliteration.
 */

const CACHE = {};

export const translateText = async (text, targetLang) => {
  if (!text || targetLang === 'en') return text;

  if (targetLang === 'all') return null;

  const cacheKey = `${targetLang}_${text.substring(0, 100)}`;
  if (CACHE[cacheKey]) return CACHE[cacheKey];

  const actualTarget = targetLang === 'th' ? 'ta' : targetLang;

  try {
    const lines = text.split('\n');

    const translatedLines = await Promise.all(
      lines.map(async (line) => {
        if (!line.trim()) return line;

        const headerMatch = line.match(/^(#+\s+)(.*)$/);
        const listMatch = line.match(/^(\s*[-*]\s+)(.*)$/);
        const quoteMatch = line.match(/^(>\s+)(.*)$/);

        let prefix = '';
        let content = line;

        if (headerMatch) {
          prefix = headerMatch[1];
          content = headerMatch[2];
        } else if (listMatch) {
          prefix = listMatch[1];
          content = listMatch[2];
        } else if (quoteMatch) {
          prefix = quoteMatch[1];
          content = quoteMatch[2];
        }

        let translatedContent = await fetchTranslation(content, actualTarget);

        if (targetLang === 'th') {
          translatedContent = transliterateToThanglish(translatedContent);
        }

        return `${prefix}${translatedContent}`;
      })
    );

    const result = translatedLines.join('\n');
    CACHE[cacheKey] = result;
    return result;
  } catch (error) {
    console.error('Translation Error:', error);
    return text;
  }
};

const fetchTranslation = async (text, targetLang) => {
  if (!text.trim()) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0].map(item => item[0]).join('');
  } catch (err) {
    return text;
  }
};

/**
 * Phonetic Transliteration Engine (Tamil -> Thanglish)
 * Converts Tamil unicode characters into English phonetic script.
 */
export const transliterateToThanglish = (tamilText) => {
  if (!tamilText) return "";

  // 1. Technical Term Preservation (Words already in English script)
  const technicalTerms = ['Node.js', 'React', 'MongoDB', 'Express', 'API', 'UI', 'UX', 'JSON', 'JWT', 'CORS', 'Client', 'Server'];

  // 2. Comprehensive Phonetic Mapping
  // Vowels
  const vowels = {
    'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo',
    'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oe', 'ஔ': 'au', 'ஃ': 'h'
  };

  // Consonants + Vowel signs
  const consonants = {
    'க': 'ka', 'ங': 'nga', 'ச': 'cha', 'ஞ': 'gna', 'ட': 'ta', 'ண': 'na',
    'த': 'tha', 'ந': 'na', 'ப': 'pa', 'ம': 'ma', 'ய': 'ya', 'ர': 'ra',
    'ல': 'la', 'வ': 'va', 'ழ': 'zha', 'ள': 'la', 'ற': 'ra', 'ன': 'na'
  };

  const signs = {
    'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo',
    'ெ': 'e', 'ே': 'ae', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oe', 'ௌ': 'au', '்': ''
  };

  // 3. Transformation Logic
  let result = tamilText;

  // Preserve technical terms by wrapping them
  technicalTerms.forEach(term => {
    const reg = new RegExp(term, 'gi');
    result = result.replace(reg, ` __${term}__ `);
  });

  // Basic Phonetic Replacement (Approximation)
  // This is a simplified engine for real-time display
  const tamilToEnglish = (text) => {
    let output = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i+1];

        if (consonants[char]) {
            if (signs[nextChar] !== undefined) {
                output += consonants[char].slice(0, -1) + signs[nextChar];
                i++;
            } else {
                output += consonants[char];
            }
        } else if (vowels[char]) {
            output += vowels[char];
        } else {
            output += char;
        }
    }
    return output;
  };

  result = tamilToEnglish(result);

  // Clean up markers
  result = result.replace(/__/g, '');

  // 4. Common Word Polish (Native Thanglish feel)
  const polishMap = {
    'kaaranamaaga': 'kaaranama',
    'irukkirathu': 'irukku',
    'therikirathu': 'theriyuthu',
    'seyyavum': 'pannunga',
    'seithu': 'panni',
    'nanri': 'Thanks'
  };

  Object.keys(polishMap).forEach(key => {
    const reg = new RegExp(key, 'g');
    result = result.replace(reg, polishMap[key]);
  });

  return result;
};
