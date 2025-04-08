export function formatDuration(input: string): string | null {
    const trimmed = input.trim().toLowerCase();
    const regex = /^((\d+(\.\d+)?h)?\s*(\d+m)?)$/;
    if (!regex.test(trimmed)) return null;
  
    let totalMinutes = 0;
    const hourMatch = trimmed.match(/(\d+(\.\d+)?)h/);
    const minuteMatch = trimmed.match(/(\d+)m/);
  
    if (hourMatch) {
      totalMinutes += parseFloat(hourMatch[1]) * 60;
    }
    if (minuteMatch) {
      totalMinutes += parseInt(minuteMatch[1]);
    }
  
    if (totalMinutes < 5) return null;
  
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return [
      hours > 0 ? `${hours} hr` : null,
      minutes > 0 ? `${minutes} min` : null
    ].filter(Boolean).join(" ") || null;
  }