export function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

export function errorResponse(res, message = 'Something went wrong', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

export function formatAIResponse(rawText) {
  return {
    text: rawText,
    sections: parseAISections(rawText)
  };
}

function parseAISections(text) {
  const sections = [];
  const lines = text.split('\n');
  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('##') || trimmed.startsWith('**')) {
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: trimmed.replace(/[#*]/g, '').trim(), content: [] };
    } else if (trimmed && currentSection) {
      currentSection.content.push(trimmed);
    } else if (trimmed && !currentSection) {
      currentSection = { heading: 'Overview', content: [trimmed] };
    }
  }
  if (currentSection) sections.push(currentSection);
  return sections;
}
