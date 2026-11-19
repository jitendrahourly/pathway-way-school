export type ContentPointStyle = 'bullet' | 'labeled' | 'numbered';

export interface ContentPoint {
  readonly label: string;
  readonly text: string;
  readonly number?: string;
}

export interface ContentBlock {
  readonly kind: 'text' | 'points';
  readonly text: string;
  readonly style: ContentPointStyle;
  readonly points: readonly ContentPoint[];
}

const BULLET_PATTERN = /^[•·]\s*/;
const NUMBERED_PATTERN = /^(\d{1,2})[.)]\s+([A-Z][^:]{1,58}):\s*(.+)$/;
const LABELED_PATTERN = /^([A-Z][A-Za-z0-9 &/'’()\-]{1,48}):\s*(.+)$/;
const DASHED_PATTERN = /^([A-Z][A-Za-z0-9 &/'’()\-]{1,40})\s+[–—]\s*(.+)$/;

function parsePoint(value: string): { style: ContentPointStyle; point: ContentPoint } | null {
  const text = value.trim();

  if (BULLET_PATTERN.test(text)) {
    return {
      style: 'bullet',
      point: { label: '', text: text.replace(BULLET_PATTERN, '') },
    };
  }

  const numbered = text.match(NUMBERED_PATTERN);
  if (numbered) {
    return {
      style: 'numbered',
      point: { number: numbered[1], label: numbered[2].trim(), text: numbered[3].trim() },
    };
  }

  const labeled = text.match(LABELED_PATTERN);
  if (labeled) {
    return {
      style: 'labeled',
      point: { label: labeled[1].trim(), text: labeled[2].trim() },
    };
  }

  const dashed = text.match(DASHED_PATTERN);
  if (dashed) {
    return {
      style: 'labeled',
      point: { label: dashed[1].trim(), text: dashed[2].trim() },
    };
  }

  return null;
}

/**
 * Converts managed paragraph strings into narrative paragraphs and grouped point
 * cards. Consecutive bullets/labeled lines stay together so the renderer can lay
 * them out as one responsive grid.
 */
export function buildContentBlocks(
  paragraphs: readonly string[],
  bullets: readonly string[] = [],
): readonly ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let runStyle: ContentPointStyle | null = null;
  let runPoints: ContentPoint[] = [];

  const flush = () => {
    if (runStyle && runPoints.length) {
      blocks.push({ kind: 'points', text: '', style: runStyle, points: runPoints });
    }
    runStyle = null;
    runPoints = [];
  };

  for (const raw of paragraphs) {
    const text = raw.trim();
    if (!text) continue;

    const parsed = parsePoint(text);
    if (parsed) {
      if (runStyle !== parsed.style) {
        flush();
        runStyle = parsed.style;
      }
      runPoints.push(parsed.point);
      continue;
    }

    flush();
    blocks.push({ kind: 'text', text, style: 'bullet', points: [] });
  }

  flush();

  if (bullets.length) {
    blocks.push({
      kind: 'points',
      text: '',
      style: 'bullet',
      points: bullets
        .map((bullet) => bullet.trim())
        .filter(Boolean)
        .map((bullet) => ({ label: '', text: bullet.replace(BULLET_PATTERN, '') })),
    });
  }

  return blocks;
}
