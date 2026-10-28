import type { MentionItem } from '../utils/mention-items';
import { createSuggestionStore } from '../utils/suggestion-store';

export const useMentionMenuStore = createSuggestionStore<MentionItem>();
