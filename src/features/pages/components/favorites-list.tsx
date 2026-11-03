import { useFavoritePages } from '../hooks/use-page-lists';
import { usePagesTranslation } from '../i18n';
import { SECTION_LABEL } from '../utils/row-styles';
import { PageLinkRow } from './page-link-row';

export function FavoritesList() {
  const t = usePagesTranslation();
  const favorites = useFavoritePages();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div>
      <p className={SECTION_LABEL}>{t.favorites}</p>
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
