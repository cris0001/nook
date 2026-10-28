import type { SlashItem } from '../utils/slash-items';
import { createSuggestionStore } from '../utils/suggestion-store';

export const useSlashMenuStore = createSuggestionStore<SlashItem>();
