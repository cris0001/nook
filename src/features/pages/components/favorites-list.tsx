import { usePages } from '../hooks/use-pages';
import { usePagesTranslation } from '../i18n';
import { favoritesOf } from '../utils/page-lists';
import { PageLinkRow } from './page-link-row';

// Starred pages above the tree. Hidden entirely until something is starred.
export function FavoritesList() {
  const t = usePagesTranslation();
  const state = usePages();
  const favorites = state.status === 'ready' ? favoritesOf(state.pages) : [];

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="pb-3">
      <p className="eyebrow px-2 pt-2 pb-2">{t.favorites}</p>
      <ul>
        {favorites.map((page) => (
          <li key={page.id}>
            <PageLinkRow page={page} className="pl-[30px]" />
          </li>
        ))}
      </ul>
    </div>
  );
}
